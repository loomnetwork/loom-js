const fs = require('fs');
const path = require('path');

// Export the ABI from the TypeChain generated bindings in src/mainnet-contracts/*.ts
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/factories/ERC20__factory.ts'), '\nexport const abi = _abi;');
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/factories/EthereumGatewayV1__factory.ts'), '\nexport const abi = _abi;');
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/factories/EthereumGatewayV2__factory.ts'), '\nexport const abi = _abi;');
fs.appendFileSync(path.join(__dirname, '../src/mainnet-contracts/factories/ValidatorManagerV2__factory.ts'), '\nexport const abi = _abi;');
