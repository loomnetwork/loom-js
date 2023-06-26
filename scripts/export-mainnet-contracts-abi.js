const fs = require('fs');
const path = require('path');

// Export the ABI from the TypeChain generated bindings in src/mainnet-contracts/*.ts
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/factories/ERC20__factory.ts'), '\nexport const abi = _abi;');
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/factories/EthereumGatewayV1__factory.ts'), '\nexport const abi = _abi;');
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/factories/EthereumGatewayV2__factory.ts'), '\nexport const abi = _abi;');
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/factories/ValidatorManagerV2__factory.ts'), '\nexport const abi = _abi;');

// Ensure dist/mainnet-contracts exists, otherwise the file copying will fail below
const contractsDistPath = path.join(__dirname, '../dist/mainnet-contracts');
if (!fs.existsSync(contractsDistPath)) {
  fs.mkdirSync(contractsDistPath, { recursive: true });
}

// Copy the TypeChain generated d.ts files to dist/mainnet-contracts because the TypeScript compiler doesn't
fs.copyFileSync(path.join(__dirname, '../src/mainnet-contracts/ERC20.d.ts'), path.join(contractsDistPath, 'ERC20.d.ts'));
fs.copyFileSync(path.join(__dirname, '../src/mainnet-contracts/EthereumGatewayV1.d.ts'), path.join(contractsDistPath, 'EthereumGatewayV1.d.ts'));
fs.copyFileSync(path.join(__dirname, '../src/mainnet-contracts/EthereumGatewayV2.d.ts'), path.join(contractsDistPath, 'EthereumGatewayV2.d.ts'));
fs.copyFileSync(path.join(__dirname, '../src/mainnet-contracts/ValidatorManagerV2.d.ts'), path.join(contractsDistPath, 'ValidatorManagerV2.d.ts'));
fs.copyFileSync(path.join(__dirname, '../src/mainnet-contracts/index.d.ts'), path.join(contractsDistPath, 'index.d.ts'));
