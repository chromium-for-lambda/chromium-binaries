#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
  echo "Version is required."
  exit 1
fi

files=($(printf "chrome-%s-x86-al2023.zip chrome-%s-arm64-al2023.zip headless_shell-%s-x86-al2023.zip headless_shell-%s-arm64-al2023.zip system-%s-x86-al2023.zip system-%s-arm64-al2023.zip" "$1" "$1" "$1" "$1" "$1" "$1"))

mkdir -p packages
cd packages

for file in "${files[@]}"; do
  dirname="$(basename -- $file .zip)"

  if [ ! -d "$dirname" ]; then 
    if [ ! -f "$file" ]; then 
      echo "Pulling ${file}"
      aws s3api get-object --bucket chromiumbuilderstack-binaries33f8f921-x91nj0l8wcci --key $file $file --profile browsrs
    fi

    unzip -q -o "$file" -d "${dirname}"
  fi

  if [ -f "$file" ]; then 
    rm "$file"
  fi
done

cd ..
mkdir -p releases
cd releases

stripped_version=${1%.*}

versions=(arm64-al2023 x86-al2023)
for version in "${versions[@]}"; do
  dir="${stripped_version}-${version}"
  
  mkdir -p "$dir/chromium"
  mkdir -p "$dir/chrome-linux64" # puppeteer
  mkdir -p "$dir/chrome-headless-shell-linux64" # puppeteer
  cd "$dir" && ln -s "chrome-linux64" "chrome-linux" && cd .. # playwright
  
  # chromium (original)
  cp -r ../packages/chrome-$1-${version}/chrome/* "$dir/chromium"
  cp -r ../packages/headless_shell-$1-${version}/headless_shell/* "$dir/chromium"
  cp -r ../packages/system-$1-${version}/system/* "$dir/chromium"

  # chrome
  cp -r ../packages/chrome-${1}-${version}/chrome/* "$dir/chrome-linux64"
  cp -r ../packages/system-${1}-${version}/system/* "$dir/chrome-linux64"
  
  cd "$dir/chrome-linux64"
  mv chrome chrome-bin
  mv chrome-wrapper chrome
  patch -p1 <../../../scripts/chrome.patch
  for file in "locales"/*; do
    # Check if the file is not one of the two exceptions
    if [ "$file" != "locales/en-US.pak" ] && [ "$file" != "locales/en-US.pak.info" ]; then
      rm "$file"
    fi
  done
  cd ../..

  # headless_shell
  cp -r ../packages/headless_shell-${1}-${version}/headless_shell/* "$dir/chrome-headless-shell-linux64"
  cp -r ../packages/chrome-${1}-${version}/chrome/libEGL.so "$dir/chrome-headless-shell-linux64"
  cp -r ../packages/chrome-${1}-${version}/chrome/libGLESv2.so "$dir/chrome-headless-shell-linux64"
  cp -r ../packages/chrome-${1}-${version}/chrome/libvulkan.so.1 "$dir/chrome-headless-shell-linux64"
  cp -r ../packages/chrome-${1}-${version}/chrome/libvk_swiftshader.so "$dir/chrome-headless-shell-linux64"
  cp -r ../packages/chrome-${1}-${version}/chrome/vk_swiftshader_icd.json "$dir/chrome-headless-shell-linux64"
  cp -r ../packages/system-${1}-${version}/system/* "$dir/chrome-headless-shell-linux64"
  cp ../packages/chrome-${1}-${version}/chrome/chrome-wrapper "$dir/chrome-headless-shell-linux64/chrome-headless-shell"
  cd "$dir/chrome-headless-shell-linux64"
  patch -p1 <../../../scripts/headless_shell.patch
  cd ../..

  # create zips
  cd $dir

  version=$(echo $version | sed 's/al/amazon-linux-/g' | sed 's/x86/x86_64/g')

  cp -r ../../fonts .

  if [ ! -f "${1}-${version}.zip" ]; then 
    zip -y -9 -r "${1}-${version}.zip" chromium fonts
  fi

  if [ ! -f "chrome-${1}-${version}.zip" ]; then 
    zip -y -9 -r "chrome-${1}-${version}.zip" chrome-linux64 chrome-linux fonts
  fi

  if [ ! -f "headless_shell-${1}-${version}.zip" ]; then 
    zip -y -9 -r "headless_shell-${1}-${version}.zip" chrome-headless-shell-linux64 fonts
  fi

  rm -rf chrome-linux64
  rm -rf chrome-headless-shell-linux64
  rm -rf chromium
  rm chrome-linux
  rm -rf fonts

  aws s3 sync --exclude="*" --include="*.zip" . s3://chromium-for-lambda-binaries  --profile browsrs

  cd ..
done
