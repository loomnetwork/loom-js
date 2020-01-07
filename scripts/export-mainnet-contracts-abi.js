// This script exports the ABI from the TypeChain generated bindings in src/mainnet-contracts/*.ts

const fs = require('fs');
const path = require('path');

fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/ERC20Factory.ts'), '\nexport const abi = _abi;');
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/EthereumGatewayV1Factory.ts'), '\nexport const abi = _abi;');
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/EthereumGatewayV2Factory.ts'), '\nexport const abi = _abi;');
