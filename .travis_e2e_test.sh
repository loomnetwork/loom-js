#!/bin/bash

set -euxo pipefail

eval "$(GIMME_GO_VERSION=1.10.2 gimme)"

bash e2e_tests.sh
