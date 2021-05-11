#!/bin/bash

set -euxo pipefail

export BUILD_ID=build-1346

bash e2e_tests.sh

if [ "${PLASMA_TEST:-}" ]; then
  bash e2e_plasma_cash_test.sh
fi
