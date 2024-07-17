import { CfnOutput, Duration, Stack, StackProps, Tags } from "aws-cdk-lib";
import { Conditions, ManagedPolicy, OpenIdConnectProvider, Role, WebIdentityPrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface GithubActionsAwsAuthCdkStackProps extends StackProps {
  readonly repositoryConfig: { owner: string; repo: string; filter?: string }[]
}

export class TrustStack extends Stack {
  constructor(scope: Construct, id: string, props: GithubActionsAwsAuthCdkStackProps) {
    super(scope, id, props);

    const githubProvider = new OpenIdConnectProvider(this, 'GithubActionsProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    })

    const iamRepoDeployAccess = props.repositoryConfig.map(r => `repo:${r.owner}/${r.repo}:${r.filter ?? '*'}`)

    const conditions: Conditions = {
      StringEquals: {
        'token.actions.githubusercontent.com:sub': iamRepoDeployAccess,
        'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'
      },
    };

    const role = new Role(this, 'gitHubDeployRole', {
      assumedBy: new WebIdentityPrincipal(githubProvider.openIdConnectProviderArn, conditions),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')],
      roleName: 'githubActionsDeployRole',
      description: 'This role is used via GitHub Actions to deploy with AWS CDK or Terraform on the target AWS account',
      maxSessionDuration: Duration.hours(12),
    })

    new CfnOutput(this, 'GithubActionOidcIamRoleArn', {
      value: role.roleArn,
      description: `Arn for AWS IAM role with Github oidc auth for ${iamRepoDeployAccess}`,
      exportName: 'GithubActionOidcIamRoleArn',
    })

    Tags.of(this).add('component', 'CdkGithubActionsOidcIamRole')
  }
}
