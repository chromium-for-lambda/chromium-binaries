#!/usr/bin/env bash

set -e

CHROMIUM_VERSION=$(<chromium-version)
DIR="chromiums/chromium-${CHROMIUM_VERSION}"

if [ -d "$DIR" ]; then 
  cd $DIR
  git reset --hard
else
  git clone --depth=1 https://github.com/chromium/chromium.git  --branch $CHROMIUM_VERSION --single-branch $DIR
  cd $DIR
fi

patches=( dependencies clang rust source )

for patch in "${patches[@]}"; do
  echo "Applying ${patch} patches..."
  for FILE in ./../../assets/patches/${patch}/*.patch; do
    echo "  Applying ${FILE}..."
    git apply $FILE --check
  done
done

# V8_REVISION=$(grep -m 1 "v8_revision': '" "DEPS" | cut -d ':' -f 2- | tr -d , | tr -d ' ' | tr -d "'")

# cd ../v8
# git reset --hard
# git fetch
# git checkout $V8_REVISION

# echo "Applying v8 patches..."
# for FILE in ./../../assets/patches/v8/*.patch; do
#   echo "  Applying ${FILE}..."
#   git apply $FILE --check
# done

# echo "Patches applied!"