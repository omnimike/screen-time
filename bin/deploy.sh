#!/bin/bash

set -euo pipefail

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd $ROOT_DIR

rm -rf build_staging
mkdir -p build_staging
yarn run webpack
cp -r server build_staging
rm -rf build_staging/server/__pycache__
BUNDLE=build.tar.gz
cd build_staging
tar czf $BUNDLE server
scp -r -i ~/.ssh/screen-time.pem $BUNDLE ubuntu@52.65.188.67:~
cd -
rm -rf build_staging

