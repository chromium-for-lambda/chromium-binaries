import { Architecture, GitHubRunners, LambdaAccess, Os, RunnerImageComponent } from '@cloudsnorkel/cdk-github-runners';
import * as cdk from 'aws-cdk-lib';
import { IpProtocol, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ExternalEcsRunnerProvider } from './external-ecs';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const installAL2023BuildDependencies = RunnerImageComponent.custom({
  name: "InstallAL2023BuildDependencies",
  commands: [
    'yum install -y tar zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel xz xz-devel libffi-devel openssl openssl-devel "@Development Tools" cmake libstdc++-static lld nano git alsa-lib-devel atk-devel bc bluez-libs-devel bzip2-devel cairo-devel cups-devel dbus-devel dbus-glib-devel dbus-x11 expat-devel glibc-langpack-en gperf gtk3-devel httpd libatomic libcap-devel libjpeg-devel libXScrnSaver-devel libxkbcommon-x11-devel mod_ssl ncurses-devel ncurses-compat-libs nspr-devel nss-devel pam-devel pciutils-devel perl php php-cli pulseaudio-libs-devel ruby xorg-x11-server-Xvfb libcurl-devel libxml2-devel clang libdrm-devel libuuid-devel mesa-*'
  ]
})

const installAL2023Arm64CompilerSymlinks = RunnerImageComponent.custom({
  name: "InstallAL2023Arm64CompilerSymlinks",
  commands: [
    'ln -s /usr/lib/gcc/aarch64-amazon-linux /usr/lib/gcc/aarch64-unknown-linux-gnu',
    'ln -s /usr/include/c++/11/aarch64-amazon-linux /usr/include/c++/11/aarch64-unknown-linux-gnu',
    'ln -s /usr/libexec/gcc/aarch64-amazon-linux /usr/libexec/gcc/aarch64-unknown-linux-gnu'
  ]
})

const installAL2023X86CompilerSymlinks = RunnerImageComponent.custom({
  name: "InstallAL2023X86CompilerSymlinks",
  commands: [
    'ln -s /usr/lib/gcc/x86_64-amazon-linux /usr/lib/gcc/x86_64-unknown-linux-gnu',
    'ln -s /usr/include/c++/11/x86_64-amazon-linux /usr/include/c++/11/x86_64-unknown-linux-gnu',
    'ln -s /usr/libexec/gcc/x86_64-amazon-linux /usr/libexec/gcc/x86_64-unknown-linux-gnu'
  ]
})

export class ChromiumBuilderStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const binariesBucket = new Bucket(this, "Binaries", { versioned: true })

    const vpc = new Vpc(this, "VPC", {
      ipProtocol: IpProtocol.DUAL_STACK,
      maxAzs: 1
    });

    const imageBuilderAL2023ARM64 = ExternalEcsRunnerProvider.imageBuilder(this, "ImageBuilderAL2023ARM64", {
      vpc,
      os: Os.LINUX_AMAZON_2023,
      architecture: Architecture.ARM64,
      rebuildInterval: cdk.Duration.days(100),
    })

    imageBuilderAL2023ARM64.removeComponent(RunnerImageComponent.docker())

    const imageBuilderAL2023X86 = ExternalEcsRunnerProvider.imageBuilder(this, "ImageBuilderAL2023X86", {
      vpc,
      os: Os.LINUX_AMAZON_2023,
      architecture: Architecture.X86_64,
    })

    imageBuilderAL2023X86.removeComponent(RunnerImageComponent.docker())

    imageBuilderAL2023ARM64.addComponent(installAL2023BuildDependencies)
    imageBuilderAL2023X86.addComponent(installAL2023BuildDependencies)
    imageBuilderAL2023ARM64.addComponent(installAL2023Arm64CompilerSymlinks)
    imageBuilderAL2023X86.addComponent(installAL2023X86CompilerSymlinks)

    const x86Cluster = new Cluster(this, 'X86Cluster', {
      vpc,
    });

    const arm64Ccluster = new Cluster(this, 'ARM64Ccluster', {
      vpc,
    });

    const runners = new GitHubRunners(this, 'Runners', {
      setupAccess: LambdaAccess.noAccess(),
      statusAccess: LambdaAccess.noAccess(),
      providers: [
        new ExternalEcsRunnerProvider(this, "ExternalRunnerProvider2", {
          vpc,
          cluster: arm64Ccluster,
          labels: ['arm64', 'al2023'],
          imageBuilder: imageBuilderAL2023ARM64,
          cpu: 15360,
          memoryReservationMiB: 30720,
          environment: { BINARIES_BUCKET: binariesBucket.bucketName }
        }),
        new ExternalEcsRunnerProvider(this, "ExternalRunnerProvider4", {
          vpc,
          cluster: x86Cluster,
          labels: ['x86', 'al2023'],
          imageBuilder: imageBuilderAL2023X86,
          cpu: 15360,
          memoryReservationMiB: 30720,
          environment: { BINARIES_BUCKET: binariesBucket.bucketName }
        })
      ]
    });

    runners.providers.forEach((provider) => binariesBucket.grantWrite(provider));
  }
}
