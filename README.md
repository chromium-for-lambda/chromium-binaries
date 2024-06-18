# Chromium Binaries for AWS Lambda

This repository provides Chromium binaries compiled for AWS Lambda, compatible and tested with Playwright and Puppeteer. 

It offers both `ARM_64` and `X86_64` binaries, as well as support for both Amazon Linux 2 (NodeJS 16 & 18) and Amazon Linux 2023 (NodeJS 20+).

## Installation

No need to add additional NPM packages to your project! 

Simply configure environment variables and Playwright/Puppeteer will automatically download our Lambda-compatible binaries. Alternatively, you can download our binaries manually.

## Usage

For automatic installation, set environment variables and Playwright/Puppeteer will automatically download compatible binaries ([examples](#examples)). For manual installation, download the zip file containing Chromium and it's required dependencies and upload to Lambda yourself.

## Examples

_Coming soon._

## Versioning

We aim to release compatible Chromium versions as soon as possible after official releases. However, compiling, and testing isn't free. We therefore only offer the binaries from at least 5 major versions ago for free.

| Chromium Version | Compatible Playwright Versions | Compatible Puppeteer Versions | ARM Download | X86 Download |
| --- | --- | --- | --- | --- |
| `126.0.6478.x` |  | `v22.11.0`, `v22.11.1` |   |   | 
| `125.0.6422.x` | `v1.44.0`, `v1.44.1` | `v22.10.0`, `v22.10.1`, `v22.9.0` |   |   | 
| `124.0.6367.x` | `v1.43.0`, `v1.43.1` | `v22.7.0`, `v22.7.1`, `v22.8.0`, `v22.8.1`, `v22.8.2` |   |   | 
| `123.0.6312.x` | `v1.42.0`, `v1.42.1` | `v22.6.0`, `v22.6.1`, `v22.6.2`, `v22.6.3`, `v22.6.4`, `v22.6.5` |   |   | 
| `122.0.6261.x` |  | `v22.2.0`, `v22.3.0`, `v22.4.0`, `v22.4.1`, `v22.5.0` |   |   | 
| `121.0.6167.x` | `v1.41.0`, `v1.41.1`, `v1.41.2` | `v21.10.0`, `v21.11.0`, `v21.9.0`, `v22.0.0`, `v22.1.0` | [AL2](https://github.com/chromium-for-lambda/binaries/releases/tag/arm64-amazon-linux-2-chromium-121.0.6167)  |   | 
| `120.0.6099.x` | `v1.40.0`, `v1.40.1` | `v21.8.0` | [AL2](https://github.com/chromium-for-lambda/binaries/releases/tag/arm64-amazon-linux-2-chromium-120.0.6099)  |   | 

## Support

We thoroughly test our binaries before publishing. But feel free to [create an issue](https://github.com/chromium-for-lambda/binaries/issues) if you experience unexpected behaviour.

## FAQ
### What is the difference between automatic and manual installation?
Automatic installation uses environment variables to configure Playwright/Puppeteer to download Lambda-compatible binaries. Manual installation requires downloading the zip file containing required dependencies and uploading to Lambda manually.

### Why are there different Chromium binaries for Amazon Linux 2 (AL2) and Amazon Linux 2023 (AL2023)?
The Chromium binaries for Amazon Linux 2 (AL2) and Amazon Linux 2023 (AL2023) are different because they are compiled with different versions of the Linux kernel and dependencies. 

The main differences are:
- Kernel version: AL2 is based on the 4.14 kernel, while AL2023 is based on the 5.10 kernel. This means that the AL2023 binaries are compiled with a newer kernel version, which can provide better support for newer hardware and features.
- Dependency versions: The dependencies used to build the Chromium binaries, such as glibc, libstdc++, and other libraries, are also different between AL2 and AL2023. These differences can affect the compatibility and functionality of the Chromium browser.

### Which version should I download?
If you are using Amazon Linux 2 (AL2), you should download the Chromium binaries specifically compiled for AL2. If you are using Amazon Linux 2023 (AL2023), you should download the Chromium binaries specifically compiled for AL2023.

If you're using Node.js, please note that:
- The Node.js 16 and 18 Lambda runtimes are using Amazon Linux 2 (AL2)
- The Node.js 20 runtime is using Amazon Linux 2023 (AL2023)
