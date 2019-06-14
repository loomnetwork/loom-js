#!/bin/bash

# To run this script with a locally built loom binary set the LOOM_BIN env var to point to your loom
# binary. 

set -euxo pipefail

# Prepare env
DEFAULT_GOPATH=$GOPATH
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
  wget https://private.delegatecall.com/loom/$PLATFORM/$BUILD_ID/loom
  chmod +x loom
  LOOM_BIN=`pwd`/loom
}

setup_dappchain() {
  cd $LOOM_DIR
  $LOOM_BIN init -f
  cp -R $REPO_ROOT/e2e_support/* .
  cp -R $REPO_ROOT/e2e_support/tm-config/* chaindata/config/
  mkdir -p contracts
  cp $LOOM_BLUEPRINT_DIR/build/contracts/* contracts
}

init_dappchain() {
  cd $LOOM_DIR
  rm -rf app.db
  rm -rf chaindata
  cp $REPO_ROOT/e2e_support/user-deployer-whitelist/loom.yml loom.yml
  $LOOM_BIN init -f
  cp $REPO_ROOT/e2e_support/user-deployer-whitelist/genesis.json genesis.json
  echo 'Loom DAppChain initialized in ' $LOOM_DIR
}

start_chains() {
  cd $LOOM_DIR
  $LOOM_BIN run &
  LOOM_PID=$!
  sleep 5
}

stop_chains() {
  if [[ -n "$LOOM_PID" ]]; then
    kill -9 $LOOM_PID
    LOOM_PID=""
  fi
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
fi

setup_dappchain

init_dappchain

trap cleanup EXIT

start_chains
run_tests
cleanup

sleep 1

if [ "${TRAVIS:-}" ]; then
  rm -rf $LOOM_DIR
fi
