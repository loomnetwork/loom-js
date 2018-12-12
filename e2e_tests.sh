#!/bin/bash

# To run this script with a locally built loom binary set the LOOM_BIN env var to point to your loom
# binary. If you plan on running the tests frequently you'll save a lot of time if you run the
# steps in the setup_weave_blueprint in another directory, and then set LOOM_BLUEPRINT_DIR env var
# to point to it, otherwise the contract will be recloned and rebuilt every time.

set -euxo pipefail

# Prepare env
DEFAULT_GOPATH=$GOPATH
GANACHE_PORT=8545
REPO_ROOT=`pwd`
LOOM_DIR=`pwd`/tmp/e2e


# Check available platforms
PLATFORM='unknown'
unamestr=`uname`
if [[ "$unamestr" == 'Linux' ]]; then
  PLATFORM='linux'
elif [[ "$unamestr" == 'Darwin' ]]; then
  PLATFORM='osx'
else
  echo "Platform not supported on this script yet"
  exit -1
fi

download_dappchain() {
  cd $LOOM_DIR
  wget https://private.delegatecall.com/loom/$PLATFORM/build-$BUILD_NUMBER/loom
  chmod +x loom
  LOOM_BIN=`pwd`/loom
}

setup_weave_blueprint() {
  cd $LOOM_DIR
  git clone https://github.com/loomnetwork/weave-blueprint.git
  cd weave-blueprint
  git checkout fix-go-plugin
  LOOM_BLUEPRINT_DIR=`pwd`
  make deps
  make
}

setup_dappchain() {
  cd $LOOM_DIR
  $LOOM_BIN init -f
  cp -R $REPO_ROOT/e2e_support/* .
  mkdir -p contracts
  cp $LOOM_BLUEPRINT_DIR/build/contracts/* contracts
}

start_chains() {
  $REPO_ROOT/node_modules/.bin/ganache-cli -d -p $GANACHE_PORT >> ganache.log &
  GANACHE_PID=$!

  cd $LOOM_DIR
  $LOOM_BIN run &
  LOOM_PID=$!
  sleep 5

  $LOOM_BIN deploy -a public_key_acc_1 -k private_key_acc_1 -n SimpleStore -b ./SimpleStore.bin

  sleep 5
}

stop_chains() {
  kill -9 $GANACHE_PID
  kill -9 $LOOM_PID
  pkill -f "${LOOM_DIR}/contracts/blueprint.0.0.1" || true
}

run_tests() {
  yarn test:node
  yarn test:browser
  yarn e2e:node
}

cleanup() {
  stop_chains
  export GOPATH=$DEFAULT_GOPATH
}

if [ "${TRAVIS:-}" ]; then
  mkdir -p $LOOM_DIR

  setup_weave_blueprint
  download_dappchain
fi

setup_dappchain

trap cleanup EXIT

start_chains
run_tests

if [ "${TRAVIS:-}" ]; then
  rm -rf $LOOM_DIR
fi