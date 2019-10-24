#!/bin/bash

set -euxo pipefail

eval "$(GIMME_GO_VERSION=1.12.7 gimme)"

export BUILD_ID=build-1318

bash e2e_tests.sh

if [ "${PLASMA_TEST:-}" ]; then
  bash e2e_plasma_cash_test.sh
fi
