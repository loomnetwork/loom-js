// This script copies the ABIs to the dist folder

const shell = require('shelljs')

shell.mkdir('-p', './dist/plasma-cash/contracts')
shell.cp(
  './src/plasma-cash/contracts/*.json',
  './dist/plasma-cash/contracts/'
)

shell.mkdir('-p', './dist/mainnet-contracts')
shell.cp(
  './src/mainnet-contracts/*.json',
  './dist/mainnet-contracts/'
)
