#!/bin/bash

set -euxo pipefail

# Prepare env
BUILD_NUMBER=432
GANACHE_PORT=8545

# Setup and spins up a Ganache node
setup_ganache() {
  yarn add ganache-cli
  ./node_modules/.bin/ganache-cli -d -p $GANACHE_PORT &
  ganache_pid=$!
}

setup_go() {
  eval "$(GIMME_GO_VERSION=1.10.2 gimme)"
}

setup_go_loom() {
  go get github.com/loomnetwork/go-loom
}

setup_dappchain() {
  wget https://private.delegatecall.com/loom/linux/build-$BUILD_NUMBER/loom
  chmod +x loom
  loom_bin=`pwd`/loom
}

setup_weave_blueprint() {
  git clone https://github.com/loomnetwork/weave-blueprint.git
  cd weave-blueprint
  export GOPATH=$GOPATH:`pwd`
  make deps
  make
  cd build
  $loom_bin init -f
  cp -R ./../../e2e_support/* .
  $loom_bin run &
  loom_pid=$!
  sleep 5
  $loom_bin deploy -a public_key_acc_1 -k private_key_acc_1 -n SimpleStore -b ./SimpleStore.bin
}

run_test() {
  cd
  yarn test:node
  yarn test:browser
  yarn e2e:node
}

cleanup() {
  kill -9 $ganache_pid
  kill -9 $loom_pid
}

trap cleanup EXIT

setup_ganache
setup_go
setup_go_loom
setup_dappchain
setup_weave_blueprint
run_test