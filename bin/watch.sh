#!/bin/bash

set -o pipefail
set -e
set -u

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd $ROOT_DIR

yarn run webpack --watch

