#!/usr/bin/env bash

set -e

stable_chromium_version=$(curl -s "https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json" | jq -r .channels.Stable.version)
printf "$stable_chromium_version" > chromium-version

echo $stable_chromium_version