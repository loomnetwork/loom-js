const fs = require('fs');
const path = require('path');

// Export the ABI from the TypeChain generated bindings in src/mainnet-contracts/*.ts
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/ERC20Factory.ts'), '\nexport const abi = _abi;');
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/EthereumGatewayV1Factory.ts'), '\nexport const abi = _abi;');
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/EthereumGatewayV2Factory.ts'), '\nexport const abi = _abi;');
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/ValidatorManagerV2Factory.ts'), '\nexport const abi = _abi;');

// Copy the TypeChain generated d.ts files to dist/mainnet-contracts because the TypeScript compiler doesn't
fs.copyFileSync(path.join(__dirname, '../src/mainnet-contracts/ERC20.d.ts'), path.join(__dirname, '../dist/mainnet-contracts/ERC20.d.ts'));
fs.copyFileSync(path.join(__dirname, '../src/mainnet-contracts/EthereumGatewayV1.d.ts'), path.join(__dirname, '../dist/mainnet-contracts/EthereumGatewayV1.d.ts'));
fs.copyFileSync(path.join(__dirname, '../src/mainnet-contracts/EthereumGatewayV2.d.ts'), path.join(__dirname, '../dist/mainnet-contracts/EthereumGatewayV2.d.ts'));
fs.copyFileSync(path.join(__dirname, '../src/mainnet-contracts/ValidatorManagerV2.d.ts'), path.join(__dirname, '../dist/mainnet-contracts/ValidatorManagerV2.d.ts'));
fs.copyFileSync(path.join(__dirname, '../src/mainnet-contracts/index.d.ts'), path.join(__dirname, '../dist/mainnet-contracts/index.d.ts'));
