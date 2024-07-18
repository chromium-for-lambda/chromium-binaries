#!/usr/bin/env bash

set -e

CHROMIUM_VERSION=$(<chromium-version)
DIR="chromium-${CHROMIUM_VERSION}"

patches=( dependencies clang rust source )

rm -rf $DIR
git clone --depth=1 https://github.com/chromium/chromium.git  --branch $CHROMIUM_VERSION --single-branch $DIR

cd $DIR
# git reset --hard

for patch in "${patches[@]}"; do
  echo "Applying ${patch} patches..."
  for FILE in ./../assets/patches/${patch}/*.patch; do
    echo "  Applying ${FILE}..."
    git apply $FILE --check
  done
done

echo "Patches applied!"