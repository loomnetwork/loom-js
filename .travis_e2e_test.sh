#!/bin/bash

set -euxo pipefail

eval "$(GIMME_GO_VERSION=1.10.2 gimme)"

export BUILD_ID=build-1046

bash e2e_user_deployer_whitelist_test.sh

bash e2e_tests.sh

if [ "${PLASMA_TEST:-}" ]; then
  bash e2e_plasma_cash_test.sh
fi
