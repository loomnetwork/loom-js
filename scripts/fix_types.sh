#!/bin/bash

unamestr=$(uname)
cmd="sed"
if [[ "$unamestr" == 'Darwin' ]]; then
  cmd="gsed"
fi

# Typechain bug https://github.com/ethereum-ts/TypeChain/issues/98
$cmd -i "s/sig: (string)\[\],/sig: string,/g" src/mainnet-contracts/ERC20Gateway.d.ts
