# Chromium Binaries for AWS Lambda

This repository provides Chromium binaries compiled for AWS Lambda, compatible and tested with Playwright and Puppeteer. 

We offer both `ARM_64` and `X86_64` binaries, as well as support for both Amazon Linux 2 (NodeJS 16 & 18) and Amazon Linux 2023 (NodeJS 20 & 22).

## Installation

Already using Puppeteer or Playwright? No need to add additional NPM packages to your project! 

Simply set the appropriate environment variables in Lambda and Playwright/Puppeteer will automatically download our Lambda-compatible binaries. Alternatively, you can download and install our binaries manually.

## Usage

- For automatic installation, set environment variables and Playwright/Puppeteer will automatically download compatible binaries ([details](#download-a-supported-browser-binary-from-your-function-code)). 
- For installation via a Lambda layer, download the correct zip file containing Chromium and it's required dependencies and upload to Lambda yourself ([details](#installation-via-a-lambda-layer)).

## Releases

We strive to make compatible Chromium versions available as soon as they're officially released. However, compiling, debugging, and testing these builds is resource-intensive and requires significant computational power and human effort. To ensure we can continue to provide this service, we require a pro subscription or a one-time payment for access to the latest 5 versions.

| Chromium Version | Compatible Playwright Versions | Compatible Puppeteer Versions | ARM Download | X86 Download |
| --- | --- | --- | --- | --- |
| `131.0.6778` | `v1.49.0` | `v23.10.0`, `v23.10.1`, `v23.10.2`, `v23.8.0`, `v23.9.0` | [Download AL2](https://pro.chromiumforlambda.org)\*<br/>[Download AL2023](https://pro.chromiumforlambda.org)\* | [Download AL2](https://pro.chromiumforlambda.org)\*<br/>[Download AL2023](https://pro.chromiumforlambda.org)\* | 
| `130.0.6723` | `v1.48.0`, `v1.48.1`, `v1.48.2` | `v23.6.0`, `v23.6.1`, `v23.7.0`, `v23.7.1` | [Download AL2](https://pro.chromiumforlambda.org)\*<br/>[Download AL2023](https://pro.chromiumforlambda.org)\* | [Download AL2](https://pro.chromiumforlambda.org)\*<br/>[Download AL2023](https://pro.chromiumforlambda.org)\* | 
| `129.0.6668` | `v1.47.0`, `v1.47.1`, `v1.47.2` | `v23.4.0`, `v23.4.1`, `v23.5.0`, `v23.5.1`, `v23.5.2`, `v23.5.3` | [Download AL2](https://pro.chromiumforlambda.org)\*<br/>[Download AL2023](https://pro.chromiumforlambda.org)\* | [Download AL2](https://pro.chromiumforlambda.org)\*<br/>[Download AL2023](https://pro.chromiumforlambda.org)\* | 
| `128.0.6613` | `v1.46.0`, `v1.46.1` | `v23.2.0`, `v23.2.1`, `v23.2.2`, `v23.3.0`, `v23.3.1` | [Download AL2](https://pro.chromiumforlambda.org)\*<br/>[Download AL2023](https://pro.chromiumforlambda.org)\* | [Download AL2](https://pro.chromiumforlambda.org)\*<br/>[Download AL2023](https://pro.chromiumforlambda.org)\* | 
| `127.0.6533` | `v1.45.0`, `v1.45.1`, `v1.45.2`, `v1.45.3` | `v22.14.0`, `v22.15.0`, `v23.0.0`, `v23.0.1`, `v23.0.2`, `v23.1.0`, `v23.1.1` | [Download AL2](https://pro.chromiumforlambda.org)\*<br/>[Download AL2023](https://pro.chromiumforlambda.org)\* | [Download AL2](https://pro.chromiumforlambda.org)\*<br/>[Download AL2023](https://pro.chromiumforlambda.org)\* | 
| `126.0.6478` |  | `v22.11.0`, `v22.11.1`, `v22.11.2`, `v22.12.0`, `v22.12.1`, `v22.13.0`, `v22.13.1` | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2-chromium-126.0.6478)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2023-chromium-126.0.6478) | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2-chromium-126.0.6478)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2023-chromium-126.0.6478) | 
| `125.0.6422` | `v1.44.0`, `v1.44.1` | `v22.10.0`, `v22.10.1`, `v22.9.0` | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2-chromium-125.0.6422)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2023-chromium-125.0.6422) | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2-chromium-125.0.6422)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2023-chromium-125.0.6422) | 
| `124.0.6367` | `v1.43.0`, `v1.43.1` | `v22.7.0`, `v22.7.1`, `v22.8.0`, `v22.8.1`, `v22.8.2` | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2-chromium-124.0.6367)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2023-chromium-124.0.6367) | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2-chromium-124.0.6367)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2023-chromium-124.0.6367) | 
| `123.0.6312` | `v1.42.0`, `v1.42.1` | `v22.6.0`, `v22.6.1`, `v22.6.2`, `v22.6.3`, `v22.6.4`, `v22.6.5` | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2-chromium-123.0.6312)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2023-chromium-123.0.6312) | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2-chromium-123.0.6312)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2023-chromium-123.0.6312) | 
| `122.0.6261` |  | `v22.2.0`, `v22.3.0`, `v22.4.0`, `v22.4.1`, `v22.5.0` | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2-chromium-122.0.6261)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2023-chromium-122.0.6261) | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2-chromium-122.0.6261)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2023-chromium-122.0.6261) | 
| `121.0.6167` | `v1.41.0`, `v1.41.1`, `v1.41.2` | `v21.10.0`, `v21.11.0`, `v21.9.0`, `v22.0.0`, `v22.1.0` | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2-chromium-121.0.6167)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2023-chromium-121.0.6167) | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2-chromium-121.0.6167)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2023-chromium-121.0.6167) | 
| `120.0.6099` | `v1.40.0`, `v1.40.1` | `v21.8.0` | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2-chromium-120.0.6099)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/arm64-amazon-linux-2023-chromium-120.0.6099) | [Download AL2](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2-chromium-120.0.6099)<br/>[Download AL2023](https://github.com/chromium-for-lambda/chromium-binaries/releases/tag/x86_64-amazon-linux-2023-chromium-120.0.6099) | 

<sup>*Accessing the 5 newest major Chromium release binaries requires a [pro subscription or a one-time payment](https://pro.chromiumforlambda.org).</sup>

## Examples 
### Automatic installation

Both Puppeteer and Playwright have built-in functionality to download a compatible browser from a CDN. Instead of using the default CDN, we set an environment variable to instruct Puppeteer / Playwright to download the browser from `files.chromiumforlambda.org` instead. On Lambda, only the /tmp directory is writable, so we need to save the browser there.

#### Automatic installation with Playwright
If you don't have Playwright installed yet: `npm install playwright-core@<playwright-version>`.

Configure the following environment variables. Additionally, you can choose to configure [`PLAYWRIGHT_CHROMIUM_USE_HEADLESS_NEW`](https://github.com/microsoft/playwright/blob/ec681ca78c7ce8a3a841f2583ec2a72c205cba4a/packages/playwright-core/src/server/chromium/chromium.ts#L311) which Playwright uses to activate the new headless mode.
```bash
PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST=https://files.chromiumforlambda.org/amazon-linux-2/arm64 # (if you're using NodeJS 16/18 on ARM64)
PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST=https://files.chromiumforlambda.org/amazon-linux-2023/arm64 # (if you're using NodeJS 20/22 on ARM64)
PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST=https://files.chromiumforlambda.org/amazon-linux-2/x86_64 # (if you're using NodeJS 16/18 on x86_64)
PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST=https://files.chromiumforlambda.org/amazon-linux-2023/x86_64 # (if you're using NodeJS 20/22 on x86_64)
PLAYWRIGHT_BROWSERS_PATH=/tmp
```

```javascript
// Make sure that:
// - You're using a supported Playwright version (see https://github.com/chromium-for-lambda/binaries?tab=readme-ov-file#versions).
// - You've set process.env.PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST and process.env.PLAYWRIGHT_BROWSERS_PATH.

import { chromium } from "playwright-core";

export const handler = async () => {
  const install = require('playwright-core/lib/server').installBrowsersForNpmInstall;
  await install(['chromium']);

  const browser = await chromium.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--single-process', '--no-zygote'],
  });

  const page = await browser.newPage();

  // your Playwright code as usual
}

```

#### Automatic installation with Puppeteer >= 23
If you don't have Puppeteer installed yet: `npm install puppeteer@<puppeteer-version>`.

Configure the following environment variables.
```bash
PUPPETEER_CHROME_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2/arm64 # (if you're using NodeJS 16/18 on ARM64)
PUPPETEER_CHROME_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2023/arm64 # (if you're using NodeJS 20/22 on ARM64)
PUPPETEER_CHROME_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2/x86_64 # (if you're using NodeJS 16/18 on x86_64)
PUPPETEER_CHROME_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2023/x86_64 # (if you're using NodeJS 20/22 on x86_64)
PUPPETEER_CHROME_HEADLESS_SHELL_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2/arm64 # (if you're using NodeJS 16/18 on ARM64)
PUPPETEER_CHROME_HEADLESS_SHELL_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2023/arm64 # (if you're using NodeJS 20/22 on ARM64)
PUPPETEER_CHROME_HEADLESS_SHELL_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2/x86_64 # (if you're using NodeJS 16/18 on x86_64)
PUPPETEER_CHROME_HEADLESS_SHELL_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2023/x86_64 # (if you're using NodeJS 20/22 on x86_64)
PUPPETEER_SKIP_CHROME_HEADLESS_SHELL_DOWNLOAD=true # (if you're using the new headless mode)
PUPPETEER_SKIP_CHROME_DOWNLOAD=true # (if you're using the old headless mode)
PUPPETEER_CACHE_DIR=/tmp
```

```javascript
// Make sure that:
// - You're using a supported Puppeteer version (see https://github.com/chromium-for-lambda/binaries?tab=readme-ov-file#versions).
// - You've set process.env.PUPPETEER_CHROME_DOWNLOAD_BASE_URL, process.env.PUPPETEER_CHROME_HEADLESS_SHELL_DOWNLOAD_BASE_URL and process.env.PUPPETEER_CACHE_DIR.

import puppeteer from "puppeteer";

export const handler = async () => {
  const install = require(`puppeteer/internal/node/install.js`).downloadBrowsers;
  await install()

  const browser = await puppeteer.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--single-process', '--no-zygote', '--no-sandbox'],
    headless: 'shell' | true // true launches the browser in the new headless mode, 'shell' launches shell known as the old headless mode.
  });

  const page = await browser.newPage();

  // your Puppeteer code as usual
}
```

#### Automatic installation with Puppeteer 22 ≤ x < 23
If you don't have Puppeteer installed yet: `npm install puppeteer@<puppeteer-version>`.

Configure the following environment variables.
```bash
PUPPETEER_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2/arm64 # (if you're using NodeJS 16/18 on ARM64)
PUPPETEER_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2023/arm64 # (if you're using NodeJS 20/22 on ARM64)
PUPPETEER_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2/x86_64 # (if you're using NodeJS 16/18 on x86_64)
PUPPETEER_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2023/x86_64 # (if you're using NodeJS 20/22 on x86_64)
PUPPETEER_SKIP_CHROME_HEADLESS_SHELL_DOWNLOAD=true # (if you're using the new headless mode)
PUPPETEER_SKIP_CHROME_DOWNLOAD=true # (if you're using the old headless mode)
PUPPETEER_CACHE_DIR=/tmp
```

```javascript
// Make sure that:
// - You're using a supported Puppeteer version (see https://github.com/chromium-for-lambda/binaries?tab=readme-ov-file#versions).
// - You've set process.env.PUPPETEER_DOWNLOAD_BASE_URL and process.env.PUPPETEER_CACHE_DIR.

import puppeteer from "puppeteer";

export const handler = async () => {
  const install = require(`puppeteer/internal/node/install.js`).downloadBrowser;
  await install()

  const browser = await puppeteer.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--single-process', '--no-zygote', '--no-sandbox'],
    headless: 'shell' | true // true launches the browser in the new headless mode, 'shell' launches shell known as the old headless mode.
  });

  const page = await browser.newPage();

  // your Puppeteer code as usual
}
```

#### Automatic installation with Puppeteer < 22
If you don't have Puppeteer installed yet: `npm install puppeteer@<puppeteer-version>`.

Configure the following environment variables.
```bash
PUPPETEER_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2/arm64 # (if you're using NodeJS 16/18 on ARM64)
PUPPETEER_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2023/arm64 # (if you're using NodeJS 20/22 on ARM64)
PUPPETEER_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2/x86_64 # (if you're using NodeJS 16/18 on x86_64)
PUPPETEER_DOWNLOAD_BASE_URL=https://files.chromiumforlambda.org/amazon-linux-2023/x86_64 # (if you're using NodeJS 20/22 on x86_64)
PUPPETEER_SKIP_CHROME_HEADLESS_SHELL_DOWNLOAD=true # (if you're using the new headless mode)
PUPPETEER_SKIP_CHROME_DOWNLOAD=true # (if you're using the old headless mode)
PUPPETEER_CACHE_DIR=/tmp
```

```javascript
// Make sure that:
// - You're using a supported Puppeteer version (see https://github.com/chromium-for-lambda/binaries?tab=readme-ov-file#versions).
// - You've set process.env.PUPPETEER_DOWNLOAD_BASE_URL and process.env.PUPPETEER_CACHE_DIR.

import puppeteer from "puppeteer";

export const handler = async () => {
  const install = require(`puppeteer/internal/node/install.js`).downloadBrowser;
  await install()

  const browser = await puppeteer.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--single-process', '--no-zygote', '--no-sandbox'],
    headless: true | 'new' // 'new' launches the browser in the new headless mode, true launches shell known as the old headless mode.
  });

  const page = await browser.newPage();

  // your Puppeteer code as usual
}
```

### Installation via a Lambda layer

A Lambda layer is a .zip file archive that contains supplementary code or data. You can use a Lambda layer to package the Chromium browser with your function. Due to size limits, Chromium can only be used with the old headless mode (via the chrome-headless-shell binary). Sadly the full Chromium binary used in the new headless mode is too large to be installed via a layer.

You can download the headless_shell-*.zip that matches your Playwright / Puppeteer version and upload it as a layer.

#### Layer usage with Playwright
If you don't have Playwright installed yet: `npm install playwright-core@<playwright-version>`.

Make sure the `PLAYWRIGHT_CHROMIUM_USE_HEADLESS_NEW` environment variable is not set as the new headless mode is not supported via a layer.

```javascript
// Make sure that:
// - You're using a supported Playwright version (see https://github.com/chromium-for-lambda/binaries?tab=readme-ov-file#versions).
// - You've uploaded the headless_shell-*.zip file as a Lambda layer and configured your Lambda to use that layer.

import { chromium } from "playwright-core";

export const handler = async () => {
  const browser = await chromium.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--single-process', '--no-zygote'],
    executablePath: '/opt/chrome-headless-shell-linux64/chrome-headless-shell'
  });

  const page = await browser.newPage();

  // your Playwright code as usual
}

```

#### Layer usage with Puppeteer >= 22
If you don't have Puppeteer installed yet: `npm install puppeteer-core@<puppeteer-version>`.

```javascript
// Make sure that:
// - You're using a supported Puppeteer version (see https://github.com/chromium-for-lambda/binaries?tab=readme-ov-file#versions).
// - You've uploaded the headless_shell-*.zip file as a Lambda layer and configured your Lambda to use that layer.

import puppeteer from "puppeteer-core";

export const handler = async () => {
  const browser = await puppeteer.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--single-process', '--no-zygote', '--no-sandbox'],
    headless: 'shell',
    executablePath: '/opt/chrome-headless-shell-linux64/chrome-headless-shell'
  });

  const page = await browser.newPage();

  // your Puppeteer code as usual
}
```

#### Layer usage with Puppeteer < 22
If you don't have Puppeteer installed yet: `npm install puppeteer-core@<puppeteer-version>`.

```javascript
// Make sure that:
// - You're using a supported Puppeteer version (see https://github.com/chromium-for-lambda/binaries?tab=readme-ov-file#versions).
// - You've uploaded the headless_shell-*.zip file as a Lambda layer and configured your Lambda to use that layer.

import puppeteer from "puppeteer-core";

export const handler = async () => {
  const browser = await puppeteer.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--single-process', '--no-zygote', '--no-sandbox'],
    headless: true,
    executablePath: '/opt/chrome-headless-shell-linux64/chrome-headless-shell'
  });

  const page = await browser.newPage();

  // your Puppeteer code as usual
}
```

## Support

We thoroughly test our binaries before publishing. But feel free to [create an issue](https://github.com/chromium-for-lambda/binaries/issues) if you experience unexpected behaviour.

## FAQ

### Am I supposed to just trust your binaries?
Our binaries are compiled [in a Github action](https://github.com/chromium-for-lambda/chromium-binaries/actions). This means you can follow exactly how our Chromium binaries are built, from source to deployment. This means you can verify the integrity and quality of our binaries, and have a better understanding of the process that goes into creating them.

### What is the difference between automatic and manual installation via a layer?
Automatic installation uses environment variables to configure Playwright/Puppeteer to download Lambda-compatible binaries from our CDN. Manual installation requires downloading the correct zip file containing required dependencies and uploading to Lambda manually via a Lambda layer.

### Why are there different Chromium binaries for Amazon Linux 2 (AL2) and Amazon Linux 2023 (AL2023)?
The Chromium binaries for Amazon Linux 2 (AL2) and Amazon Linux 2023 (AL2023) are different because they are compiled with different versions of the Linux kernel and dependencies. 

The main differences are:
- Kernel version: AL2 is based on the 4.14 kernel, while AL2023 is based on the 5.10 kernel. This means that the AL2023 binaries are compiled with a newer kernel version, which can provide better support for newer hardware and features.
- Dependency versions: The dependencies used to build the Chromium binaries, such as glibc, libstdc++, and other libraries, are also different between AL2 and AL2023. These differences can affect the compatibility and functionality of the Chromium browser.

### Which version should I download?
If you are using Amazon Linux 2 (AL2), you should download the Chromium binaries specifically compiled for AL2. If you are using Amazon Linux 2023 (AL2023), you should download the Chromium binaries specifically compiled for AL2023.

If you're using Node.js, please note that:
- The Node.js 16 and 18 Lambda runtimes are using Amazon Linux 2 (AL2)
- The Node.js 20 and 22 Lambda runtimes are using Amazon Linux 2023 (AL2023)

## Got an example codebase that is actually using this?
Yes. Please take a look at [this](https://github.com/chromium-for-lambda/playwright-screenshot/blob/main/src/index.ts).
