#!/bin/bash

# To run this script locally set LOOM_BIN env var to point at the loom binary you wish to run the
# tests with.

set -exo pipefail

# These can be toggled via the options below, only useful when running the script locally.
LOOM_INIT_ONLY=false
DEBUG_LOOM=false

# Scripts options:
# -i / --init    - Reinitializes the DAppChain for a fresh test run.
# --debug-node   - Doesn't reinitialize or start the DAppChain (only Ganache), useful when you want to
#                  launch the DAppChain node manually via the debugger.
while [[ "$#" > 0 ]]; do case $1 in
  -i|--init) LOOM_INIT_ONLY=true; shift;;
  --debug-node) DEBUG_LOOM=true; shift;;
  *) echo "Unknown parameter: $1"; shift; shift;;
esac; done

echo "Only reinitializing DAppChain? $LOOM_INIT_ONLY"
echo "Skipping launching of DAppChain node? $DEBUG_LOOM"



# Spins up a Ganache node & a DAppChain node
function start_chains {
    cd $PLASMA_CASH_DIR/server
    npm run --silent migrate:dev
    sleep 1
    ganache_pid=`cat ganache.pid`
    echo 'Launched ganache' $ganache_pid

    if [[ "$DEBUG_LOOM" == false ]]; then
        cd $LOOM_DIR
        $LOOM_BIN run > loom.log 2>&1 &  
        loom_pid=$!
        echo "Launched Loom - Log(loom.log) Pid(${loom_pid})"
    fi

    # Wait for Ganache & Loom to spin up
    sleep 10
}

# Stops the Ganache node & the DAppChain node
function stop_chains {
    echo "exiting ganache-pid(${ganache_pid})"
    kill -9 "${ganache_pid}"    &> /dev/null
    
    if [[ "$DEBUG_LOOM" == false ]]; then
        echo "exiting loom-pid(${loom_pid})"
        kill -9 "${loom_pid}"   &> /dev/null
        echo "killing ${LOOM_DIR}/contracts/hostileoperator.1.0.0"
        pkill -f "${LOOM_DIR}/contracts/hostileoperator.1.0.0" || true
    fi
}

function init_honest_dappchain {
  cd $LOOM_DIR
  rm -rf app.db
  rm -rf chaindata
  cp $REPO_ROOT/e2e_support/plasma-cash/loom-test.yml loom.yml
  cp $REPO_ROOT/e2e_support/plasma-cash/eth.key $LOOM_DIR/eth.key
  cp $REPO_ROOT/e2e_support/plasma-cash/test.key $LOOM_DIR/test.key
  cp $REPO_ROOT/e2e_support/plasma-cash/oracle.key $LOOM_DIR/oracle.key
  $LOOM_BIN init -f
  cp $REPO_ROOT/e2e_support/plasma-cash/honest.genesis.json genesis.json
  echo 'Loom DAppChain initialized in ' $LOOM_DIR
}

function init_hostile_dappchain {
  cd $LOOM_DIR
  rm -rf app.db
  rm -rf chaindata
  cp $REPO_ROOT/e2e_support/plasma-cash/loom-hostile-test.yml $LOOM_DIR/loom.yml
  $LOOM_BIN init -f
  echo 'Hostile Loom DAppChain initialized in ' $LOOM_DIR
  cd $PLASMA_CASH_DIR
  rm -rf $LOOM_DIR/contracts; true
  mkdir $LOOM_DIR/contracts
  GOPATH=$GOPATH:$PLASMA_CASH_DIR/loom_test
  cd $PLASMA_CASH_DIR/loom_test
  make deps
  make contracts
  cp contracts/hostileoperator.1.0.0 $LOOM_DIR/contracts/hostileoperator.1.0.0
  cp $REPO_ROOT/e2e_support/plasma-cash/hostile.genesis.json $LOOM_DIR/genesis.json
}

function cleanup {
    stop_chains
}

function download_dappchain {
    cd $LOOM_DIR
    if [[ "`uname`" == 'Darwin' ]]; then
        wget https://private.delegatecall.com/loom/osx/build-$BUILD_NUMBER/loom
    else 
        wget https://private.delegatecall.com/loom/linux/build-$BUILD_NUMBER/loom
    fi
    chmod +x loom
    export LOOM_BIN=`pwd`/loom
}

function download_plasma_cash {
  cd $LOOM_DIR
  git clone https://github.com/loomnetwork/plasma-cash
  PLASMA_CASH_DIR=`pwd`/plasma-cash
  cd $PLASMA_CASH_DIR/server
  npm install
}

if [ "${TRAVIS:-}" ]; then
    # Kill off any plugins that weren't killed off by older builds
    pkill -f "hostileoperator.1.0.0" || true
fi

# TRAVIS_JOB_ID is usually only set Travis, so when running locally just hardcode some value
if [[ -z "$TRAVIS_JOB_ID" ]]; then
    TRAVIS_JOB_ID=123
fi

# REPO_ROOT set in travis, if the script is executed directly just use cwd
if [[ -z "$REPO_ROOT" ]]; then
    REPO_ROOT=`pwd`
fi

LOOM_DIR=`pwd`/tmp/e2e/plasma-cash-$TRAVIS_JOB_ID

if [[ "$DEBUG_LOOM" == false ]]; then
    rm -rf  $LOOM_DIR; true
fi
mkdir -p $LOOM_DIR

 if [ "${TRAVIS:-}" ]; then
    download_dappchain
    download_plasma_cash
fi

echo "REPO_ROOT=(${REPO_ROOT})"
echo "GOPATH=(${GOPATH})"

if [[ "$DEBUG_LOOM" == false ]]; then
    init_honest_dappchain
fi

if [[ "$LOOM_INIT_ONLY" == true ]]; then
    exit
fi

trap cleanup EXIT

# Cleanup all database files
cd $REPO_ROOT
rm *_db

# Reset the DAppChain again for the JS tests
init_honest_dappchain
start_chains

cd $LOOM_DIR

yarn e2e:plasma-cash:honest

stop_chains

# Wait for Ganache & Loom to stop
sleep 10

init_hostile_dappchain
start_chains

# Cleanup all database files
cd $REPO_ROOT
rm *_db

cd $LOOM_DIR
yarn e2e:plasma-cash:hostile

if [[ $LOOM_DIR ]]; then 
  rm -rf $LOOM_DIR
  fi
