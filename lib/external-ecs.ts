import { BaseProvider, ecsRunCommand, EcsRunnerProvider, IRunnerImageBuilder, IRunnerProvider, IRunnerProviderStatus, Os, RunnerImage, RunnerImageBuilder, RunnerImageBuilderProps, RunnerImageComponent, RunnerProviderProps, RunnerRuntimeParameters, RunnerVersion } from '@cloudsnorkel/cdk-github-runners';
import {
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_iam as iam,
  aws_logs as logs,
  aws_stepfunctions as stepfunctions,
  aws_stepfunctions_tasks as stepfunctions_tasks,
  RemovalPolicy,
} from 'aws-cdk-lib';
import { Volume } from 'aws-cdk-lib/aws-ecs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { IntegrationPattern } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';

const MINIMAL_ECS_SSM_SESSION_MANAGER_POLICY_STATEMENT = new iam.PolicyStatement({
  actions: [
    'ssmmessages:CreateControlChannel',
    'ssmmessages:CreateDataChannel',
    'ssmmessages:OpenControlChannel',
    'ssmmessages:OpenDataChannel',
    's3:GetEncryptionConfiguration',
  ],
  resources: ['*'],
});

/**
 * Properties for EcsRunnerProvider.
 */
export interface ExternalEcsRunnerProviderProps extends RunnerProviderProps {
  /**
   * Runner image builder used to build Docker images containing GitHub Runner and all requirements.
   *
   * The image builder determines the OS and architecture of the runner.
   *
   * @default EcsRunnerProvider.imageBuilder()
   */
  readonly imageBuilder?: IRunnerImageBuilder;

  readonly volumes?: Volume[]  

  readonly environment?: {
    [key: string]: string;
  } | undefined

  /**
   * GitHub Actions labels used for this provider.
   *
   * These labels are used to identify which provider should spawn a new on-demand runner. Every job sends a webhook with the labels it's looking for
   * based on runs-on. We match the labels from the webhook with the labels specified here. If all the labels specified here are present in the
   * job's labels, this provider will be chosen and spawn a new runner.
   *
   * @default ['ecs']
   */
  readonly labels?: string[];

  /**
   * VPC to launch the runners in.
   *
   * @default default account VPC
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Security groups to assign to the task.
   *
   * @default a new security group
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Existing ECS cluster to use.
   *
   * @default a new cluster
   */
  readonly cluster?: ecs.Cluster;

  /**
   * The number of cpu units used by the task. 1024 units is 1 vCPU. Fractions of a vCPU are supported.
   *
   * @default 1024
   */
  readonly cpu?: number;

  /**
   * The amount (in MiB) of memory used by the task.
   *
   * @default 3500, unless `memoryReservationMiB` is used and then it's undefined
   */
  readonly memoryLimitMiB?: number;

  /**
   * The soft limit (in MiB) of memory to reserve for the container.
   *
   * @default undefined
   */
  readonly memoryReservationMiB?: number;

  /**
   * Support building and running Docker images by enabling Docker-in-Docker (dind) and the required CodeBuild privileged mode. Disabling this can
   * speed up provisioning of CodeBuild runners. If you don't intend on running or building Docker images, disable this for faster start-up times.
   *
   * @default true
   */
  readonly dockerInDocker?: boolean;
}

interface EcsEc2LaunchTargetProps {
  readonly enableExecute: boolean;
}

class EcsExternalLaunchTarget implements stepfunctions_tasks.IEcsLaunchTarget {
  constructor(readonly props: EcsEc2LaunchTargetProps) {
  }

  /**
   * Called when the ECS launch type configured on RunTask
   */
  public bind(_task: stepfunctions_tasks.EcsRunTask,
    _launchTargetOptions: stepfunctions_tasks.LaunchTargetBindOptions): stepfunctions_tasks.EcsLaunchTargetConfig {
    return {
      parameters: {
        LaunchType: 'EXTERNAL',
        PropagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
        EnableExecuteCommand: this.props.enableExecute,
      },
    };
  }
}

/**
 * GitHub Actions runner provider using ECS on EC2 to execute jobs.
 *
 * ECS can be useful when you want more control of the infrastructure running the GitHub Actions Docker containers. You can control the autoscaling
 * group to scale down to zero during the night and scale up during work hours. This way you can still save money, but have to wait less for
 * infrastructure to spin up.
 *
 * This construct is not meant to be used by itself. It should be passed in the providers property for GitHubRunners.
 */
export class ExternalEcsRunnerProvider extends BaseProvider implements IRunnerProvider {
  /**
   * Create new image builder that builds ECS specific runner images.
   *
   * You can customize the OS, architecture, VPC, subnet, security groups, etc. by passing in props.
   *
   * You can add components to the image builder by calling `imageBuilder.addComponent()`.
   *
   * Included components:
   *  * `RunnerImageComponent.requiredPackages()`
   *  * `RunnerImageComponent.runnerUser()`
   *  * `RunnerImageComponent.git()`
   *  * `RunnerImageComponent.githubCli()`
   *  * `RunnerImageComponent.awsCli()`
   *  * `RunnerImageComponent.docker()`
   *  * `RunnerImageComponent.githubRunner()`
   */
  public static imageBuilder(scope: Construct, id: string, props?: RunnerImageBuilderProps) {
    return RunnerImageBuilder.new(scope, id, {
      components: [
        RunnerImageComponent.requiredPackages(),
        RunnerImageComponent.runnerUser(),
        RunnerImageComponent.git(),
        RunnerImageComponent.githubCli(),
        RunnerImageComponent.awsCli(),
        RunnerImageComponent.docker(),
        RunnerImageComponent.githubRunner(props?.runnerVersion ?? RunnerVersion.latest()),
      ],
      ...props,
    });
  }

  /**
   * Cluster hosting the task hosting the runner.
   */
  private readonly cluster: ecs.Cluster;

  /**
   * ECS task hosting the runner.
   */
  private readonly task: ecs.ExternalTaskDefinition;

  /**
   * Container definition hosting the runner.
   */
  private readonly container: ecs.ContainerDefinition;

  /**
   * Labels associated with this provider.
   */
  readonly labels: string[];

  /**
   * VPC used for hosting the runner task.
   */
  private readonly vpc?: ec2.IVpc;

  /**
   * Grant principal used to add permissions to the runner role.
   */
  readonly grantPrincipal: iam.IPrincipal;

  /**
   * The network connections associated with this resource.
   */
  readonly connections: ec2.Connections;

  /**
   * Docker image loaded with GitHub Actions Runner and its prerequisites. The image is built by an image builder and is specific to ECS tasks.
   */
  private readonly image: RunnerImage;

  /**
   * Log group where provided runners will save their logs.
   *
   * Note that this is not the job log, but the runner itself. It will not contain output from the GitHub Action but only metadata on its execution.
   */
  readonly logGroup: logs.ILogGroup;

  /**
   * Security groups associated with this provider.
   */
  private readonly securityGroups: ec2.ISecurityGroup[];

  /**
   * Run docker in docker.
   */
  private readonly dind: boolean;

  readonly retryableErrors = [
    'Ecs.EcsException',
    'ECS.AmazonECSException',
    'Ecs.LimitExceededException',
    'Ecs.UpdateInProgressException',
  ];

  constructor(scope: Construct, id: string, props?: ExternalEcsRunnerProviderProps) {
    super(scope, id, props);

    this.labels = props?.labels ?? ['ecs'];
    this.vpc = props?.vpc ?? ec2.Vpc.fromLookup(this, 'default vpc', { isDefault: true });
    this.securityGroups = props?.securityGroups ?? [new ec2.SecurityGroup(this, 'security group', { vpc: this.vpc })];
    this.connections = new ec2.Connections({ securityGroups: this.securityGroups });
    this.cluster = props?.cluster ? props.cluster : new ecs.Cluster(
      this,
      'cluster',
      {
        vpc: this.vpc,
      },
    );

    const imageBuilder = props?.imageBuilder ?? EcsRunnerProvider.imageBuilder(this, 'Image Builder');
    const image = this.image = imageBuilder.bindDockerImage();

    this.logGroup = new logs.LogGroup(this, 'logs', {
      retention: props?.logRetention ?? RetentionDays.ONE_MONTH,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.dind = (props?.dockerInDocker ?? true) && !image.os.is(Os.WINDOWS);

    this.task = new ecs.ExternalTaskDefinition(this, 'task', { volumes: props?.volumes });
    this.container = this.task.addContainer(
      'runner',
      {
        image: ecs.AssetImage.fromEcrRepository(image.imageRepository, image.imageTag),
        cpu: props?.cpu ?? 1024,
        memoryLimitMiB: props?.memoryLimitMiB ?? (props?.memoryReservationMiB ? undefined : 3500),
        memoryReservationMiB: props?.memoryReservationMiB,
        logging: ecs.AwsLogDriver.awsLogs({
          logGroup: this.logGroup,
          streamPrefix: 'runner',
        }),
        environment: props?.environment,
        command: ecsRunCommand(this.image.os, this.dind),
        user: image.os.is(Os.WINDOWS) ? undefined : 'runner',
        privileged: this.dind,
      },
    );

    this.grantPrincipal = this.task.taskRole;

    // permissions for SSM Session Manager
    this.task.taskRole.addToPrincipalPolicy(MINIMAL_ECS_SSM_SESSION_MANAGER_POLICY_STATEMENT);
  }

  /**
   * Generate step function task(s) to start a new runner.
   *
   * Called by GithubRunners and shouldn't be called manually.
   *
   * @param parameters workflow job details
   */
  getStepFunctionTask(parameters: RunnerRuntimeParameters): stepfunctions.IChainable {
    return new stepfunctions_tasks.EcsRunTask(
      this,
      this.labels.join(', '),
      {
        integrationPattern: IntegrationPattern.RUN_JOB, // sync
        taskDefinition: this.task,
        cluster: this.cluster,
        launchTarget: new EcsExternalLaunchTarget({
          enableExecute: this.image.os.isIn(Os._ALL_LINUX_VERSIONS),
        }),
        containerOverrides: [
          {
            containerDefinition: this.container,
            environment: [
              {
                name: 'RUNNER_TOKEN',
                value: parameters.runnerTokenPath,
              },
              {
                name: 'RUNNER_NAME',
                value: parameters.runnerNamePath,
              },
              {
                name: 'RUNNER_LABEL',
                value: this.labels.join(','),
              },
              {
                name: 'GITHUB_DOMAIN',
                value: parameters.githubDomainPath,
              },
              {
                name: 'OWNER',
                value: parameters.ownerPath,
              },
              {
                name: 'REPO',
                value: parameters.repoPath,
              },
              {
                name: 'REGISTRATION_URL',
                value: parameters.registrationUrl,
              },
            ],
          },
        ],
      },
    );
  }

  grantStateMachine(_: iam.IGrantable) {
  }

  status(statusFunctionRole: iam.IGrantable): IRunnerProviderStatus {
    this.image.imageRepository.grant(statusFunctionRole, 'ecr:DescribeImages');

    return {
      type: this.constructor.name,
      labels: this.labels,
      vpcArn: this.vpc?.vpcArn,
      securityGroups: this.securityGroups.map(sg => sg.securityGroupId),
      roleArn: this.task.taskRole.roleArn,
      logGroup: this.logGroup.logGroupName,
      image: {
        imageRepository: this.image.imageRepository.repositoryUri,
        imageTag: this.image.imageTag,
        imageBuilderLogGroup: this.image.logGroup?.logGroupName,
      },
    };
  }
}