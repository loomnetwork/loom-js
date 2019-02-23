# Typechain bug https://github.com/ethereum-ts/TypeChain/issues/98
sed -i "s/sig: (string)\[\],/sig: string,/g" src/mainnet-contracts/ERC20Gateway.d.ts
