#!/bin/bash

set -o pipefail
set -e
set -u

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd $ROOT_DIR

rm -rf build
mkdir -p build
cp server/*.py build
cp -r server/templates build/templates
yarn run webpack


