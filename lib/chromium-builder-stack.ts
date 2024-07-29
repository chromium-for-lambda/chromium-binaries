import { Architecture, GitHubRunners, LambdaAccess, Os, RunnerImageComponent } from '@cloudsnorkel/cdk-github-runners';
import * as cdk from 'aws-cdk-lib';
import { IpProtocol, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ExternalEcsRunnerProvider } from './external-ecs';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const installCmakeCommand = RunnerImageComponent.custom({
  name: "InstallCMake",
  commands: [
    'yum install -y gcc10 gcc10-c++ zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel openssl11 openssl11-devel xz xz-devel libffi-devel',
    'export CC="/bin/gcc10-cc"',
    'export CXX="/bin/gcc10-c++"',
    'yum install -y wget tar',
    'wget https://cmake.org/files/v3.26/cmake-3.26.4.tar.gz && \
    tar -xvzf cmake-3.26.4.tar.gz && \
    cd cmake-3.26.4 && \
    ./bootstrap && \
    make -j$(nproc) && \
    make install && \
    cd .. && \
    rm -rf cmake-3.26.4 && \
    rm cmake-3.26.4.tar.gz'
  ]
})

const installAL2BuildDependencies = RunnerImageComponent.custom({
  name: "InstallAL2BuildDependencies",
  commands: [
    'yum install -y "@Development Tools" nano git alsa-lib-devel atk-devel bc bluez-libs-devel bzip2-devel cairo-devel cups-devel dbus-devel dbus-glib-devel dbus-x11 expat-devel glibc-langpack-en gperf gtk3-devel httpd libatomic libcap-devel libjpeg-devel libXScrnSaver-devel libxkbcommon-x11-devel mod_ssl ncurses-devel ncurses-compat-libs nspr-devel nss-devel pam-devel pciutils-devel perl php php-cli pulseaudio-libs-devel ruby xorg-x11-server-Xvfb libcurl-devel libxml2-devel clang libdrm-devel libuuid-devel mesa-* --skip-broken'
  ]
})

const installAL2023BuildDependencies = RunnerImageComponent.custom({
  name: "InstallAL2023BuildDependencies",
  commands: [
    'yum install -y tar zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel xz xz-devel libffi-devel openssl openssl-devel "@Development Tools" cmake libstdc++-static lld nano git alsa-lib-devel atk-devel bc bluez-libs-devel bzip2-devel cairo-devel cups-devel dbus-devel dbus-glib-devel dbus-x11 expat-devel glibc-langpack-en gperf gtk3-devel httpd libatomic libcap-devel libjpeg-devel libXScrnSaver-devel libxkbcommon-x11-devel mod_ssl ncurses-devel ncurses-compat-libs nspr-devel nss-devel pam-devel pciutils-devel perl php php-cli pulseaudio-libs-devel ruby xorg-x11-server-Xvfb libcurl-devel libxml2-devel clang libdrm-devel libuuid-devel mesa-*'
  ]
})

const installAL2Arm64CompilerSymlinks = RunnerImageComponent.custom({
  name: "InstallAL2Arm64CompilerSymlinks",
  commands: [
    'ln -s /usr/lib/gcc/aarch64-redhat-linux /usr/lib/gcc/aarch64-unknown-linux-gnu',
    'ln -s /usr/include/c++/10/aarch64-redhat-linux /usr/include/c++/10/aarch64-unknown-linux-gnu',
    'ln -s /usr/libexec/gcc/aarch64-redhat-linux /usr/libexec/gcc/aarch64-unknown-linux-gnu'
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

const installAL2X86CompilerSymlinks = RunnerImageComponent.custom({
  name: "InstallAL2X86CompilerSymlinks",
  commands: [
    'ln -s /usr/lib/gcc/x86_64-redhat-linux /usr/lib/gcc/x86_64-unknown-linux-gnu',
    'ln -s /usr/include/c++/10/x86_64-redhat-linux /usr/include/c++/10/x86_64-unknown-linux-gnu',
    'ln -s /usr/libexec/gcc/x86_64-redhat-linux /usr/libexec/gcc/x86_64-unknown-linux-gnu'
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

const fixAL2Seals = RunnerImageComponent.custom({
  name: "FixAL2Seals",
  commands: [
    `echo '#ifndef F_LINUX_SPECIFIC_BASE' >> /usr/include/fcntl.h`,
    `echo '#define F_LINUX_SPECIFIC_BASE 1024' >> /usr/include/fcntl.h`,
    `echo '#endif' >> /usr/include/fcntl.h`,
    `echo '#define F_ADD_SEALS (F_LINUX_SPECIFIC_BASE + 9)' >> /usr/include/fcntl.h`,
    `echo '#define F_GET_SEALS (F_LINUX_SPECIFIC_BASE + 10)' >> /usr/include/fcntl.h`,
    `echo '#define F_SEAL_SEAL 0x0001' >> /usr/include/fcntl.h`,
    `echo '#define F_SEAL_SHRINK 0x0002' >> /usr/include/fcntl.h`,
    `echo '#define F_SEAL_GROW 0x0004' >> /usr/include/fcntl.h`,
    `echo '#define F_SEAL_WRITE 0x0008' >> /usr/include/fcntl.h`,
    `echo '#define F_SEAL_FUTURE_WRITE 0x0010' >> /usr/include/fcntl.h`
  ]
});

export class ChromiumBuilderStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "VPC", {
      ipProtocol: IpProtocol.DUAL_STACK,
      maxAzs: 1
    });

    const imageBuilderAL2ARM64 = ExternalEcsRunnerProvider.imageBuilder(this, "ImageBuilderAL2ARM64", {
      vpc,
      os: Os.LINUX_AMAZON_2,
      architecture: Architecture.ARM64,
      rebuildInterval: cdk.Duration.days(100),
    });

    imageBuilderAL2ARM64.removeComponent(RunnerImageComponent.docker())

    const imageBuilderAL2023ARM64 = ExternalEcsRunnerProvider.imageBuilder(this, "ImageBuilderAL2023ARM64", {
      vpc,
      os: Os.LINUX_AMAZON_2023,
      architecture: Architecture.ARM64,
      rebuildInterval: cdk.Duration.days(100),
    })

    imageBuilderAL2023ARM64.removeComponent(RunnerImageComponent.docker())

    const imageBuilderAL2X86 = ExternalEcsRunnerProvider.imageBuilder(this, "ImageBuilderAL2X86", {
      vpc,
      os: Os.LINUX_AMAZON_2,
      architecture: Architecture.X86_64,
      rebuildInterval: cdk.Duration.days(100),
    });

    imageBuilderAL2X86.removeComponent(RunnerImageComponent.docker())

    const imageBuilderAL2023X86 = ExternalEcsRunnerProvider.imageBuilder(this, "ImageBuilderAL2023X86", {
      vpc,
      os: Os.LINUX_AMAZON_2023,
      architecture: Architecture.X86_64,
    })

    imageBuilderAL2023X86.removeComponent(RunnerImageComponent.docker())

    imageBuilderAL2X86.addComponent(installCmakeCommand)
    imageBuilderAL2ARM64.addComponent(installCmakeCommand)
    imageBuilderAL2X86.addComponent(installAL2BuildDependencies)
    imageBuilderAL2ARM64.addComponent(installAL2BuildDependencies)
    imageBuilderAL2023ARM64.addComponent(installAL2023BuildDependencies)
    imageBuilderAL2023X86.addComponent(installAL2023BuildDependencies)
    imageBuilderAL2ARM64.addComponent(installAL2Arm64CompilerSymlinks)
    imageBuilderAL2023ARM64.addComponent(installAL2023Arm64CompilerSymlinks)
    imageBuilderAL2X86.addComponent(installAL2X86CompilerSymlinks)
    imageBuilderAL2023X86.addComponent(installAL2023X86CompilerSymlinks)
    imageBuilderAL2X86.addComponent(fixAL2Seals)
    imageBuilderAL2ARM64.addComponent(fixAL2Seals)

    const x86Cluster = new Cluster(this, 'X86Cluster', {
      vpc,
    });

    const arm64Ccluster = new Cluster(this, 'ARM64Ccluster', {
      vpc,
    });

    const binariesBucket = new Bucket(this, "Binaries", { versioned: true })

    const runners = new GitHubRunners(this, 'Runners', {
      setupAccess: LambdaAccess.noAccess(),
      statusAccess: LambdaAccess.noAccess(),
      providers: [
        new ExternalEcsRunnerProvider(this, "ExternalRunnerProvider1", {
          vpc,
          cluster: arm64Ccluster,
          labels: ['arm64', 'al2'],
          imageBuilder: imageBuilderAL2ARM64,
          cpu: 15360,
          memoryReservationMiB: 30720,
          environment: { BINARIES_BUCKET: binariesBucket.bucketName }
        }),
        new ExternalEcsRunnerProvider(this, "ExternalRunnerProvider2", {
          vpc,
          cluster: arm64Ccluster,
          labels: ['arm64', 'al2023'],
          imageBuilder: imageBuilderAL2023ARM64,
          cpu: 15360,
          memoryReservationMiB: 30720,
          environment: { BINARIES_BUCKET: binariesBucket.bucketName }
        }),
        new ExternalEcsRunnerProvider(this, "ExternalRunnerProvider3", {
          vpc,
          cluster: x86Cluster,
          labels: ['x86', 'al2'],
          imageBuilder: imageBuilderAL2X86,
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
