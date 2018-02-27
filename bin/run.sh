#!/bin/bash

set -euo pipefail

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd $ROOT_DIR

pipenv run gunicorn --chdir server -b 0.0.0.0:5000 wsgi

