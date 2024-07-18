#!/usr/bin/env bash

set -e

chromium_version=$(<chromium-version)

patches=( dependencies clang rust source )

# rm -rf chromium
# git clone --depth=1 https://github.com/chromium/chromium.git  --branch $chromium_version --single-branch chromium

cd chromium
# git reset --hard

for patch in "${patches[@]}"; do
  echo "Applying ${patch} patches..."
  for FILE in ./../assets/patches/${patch}/*.patch; do
    echo "  Applying ${FILE}..."
    git apply $FILE --check
  done
done

echo "Patches applied!"