// This script copies the ABIs to the dist folder and generates the necessary ts bindings

const shell = require('shelljs')
const typechain = require('typechain')
const ts_generator = require("ts-generator");


const cwd = process.cwd()
const options = {
    files: "src/mainnet-contracts/*.json",
    target: "ethers",
    outDir: "src/mainnet-contracts"
}
ts_generator.tsGenerator({ cwd, loggingLvl: "info" }, new typechain.Typechain({ cwd, rawConfig: options }))

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
