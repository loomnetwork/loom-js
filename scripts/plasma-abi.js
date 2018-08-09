// This script copies plasma ABI to dist folder

const shell = require('shelljs')

shell.mkdir('-p', './dist/plasma-cash/contracts')
shell.cp(
  './src/plasma-cash/contracts/plasma-cash-abi.json',
  './dist/plasma-cash/contracts/plasma-cash-abi.json'
)
