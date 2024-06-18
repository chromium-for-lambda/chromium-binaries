# Chromium Binaries for AWS Lambda

Get compatible and tested Chromium binaries for AWS Lambda, compatible with Playwright and Puppeteer. 
We offer both ARM and X86 binaries, as well as support for both Amazon Linux 2 (NodeJS 16 & 18) and Amazon Linux 2023 (NodeJS 20+).

## Installation

No additional NPM package required! 
Simply configure environment variables and Playwright/Puppeteer will automatically download Lambda-compatible binaries. Alternatively, download our binaries manually and upload them to Lambda.

## Usage

For automatic installation, set environment variables and Playwright/Puppeteer will automatically download compatible binaries (see [examples](#examples)). For manual installation, download the zip file containing required dependencies and upload to Lambda.

## Examples

_Coming soon._

## Versioning

We aim to release compatible Chromium versions as soon as possible after official releases. However, compiling, and testing isn't free. We offer the most recent Chromium 5 versions for a fee. Older versions are available for free.

| Chromium Version | Compatible Playwright Version | Compatible Puppeteer Version | Download |
| --- | --- | --- | --- |
| ... | ... | ... | ... |

## Support

We thoroughly test our binaries before publishing. However, we can't provide support for specific use-cases. 

## FAQ
### What is the difference between automatic and manual installation?
Automatic installation uses environment variables to configure Playwright/Puppeteer to download Lambda-compatible binaries. Manual installation requires downloading the zip file containing required dependencies and uploading to Lambda.
