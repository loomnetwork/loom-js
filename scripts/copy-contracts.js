// This script copies Solidity contract ABI files to the dist directory

const shell = require('shelljs')

shell.mkdir('-p', './dist/tests/e2e/plasma-cash/contracts')
shell.cp(
  './src/tests/e2e/plasma-cash/contracts/cards-abi.json',
  './dist/tests/e2e/plasma-cash/contracts/cards-abi.json'
)
