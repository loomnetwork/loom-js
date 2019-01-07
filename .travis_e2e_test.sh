#!/bin/bash

set -euxo pipefail

eval "$(GIMME_GO_VERSION=1.10.2 gimme)"

export BUILD_ID=nonce-on-write-url

bash e2e_tests.sh
bash e2e_plasma_cash_test.sh
