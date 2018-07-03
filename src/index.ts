export {
  Client,
  ClientEvent,
  IClientEventArgs,
  IChainEventArgs,
  IClientErrorEventArgs,
  ITxMiddlewareHandler
} from './client'
export { Contract } from './contract'
export { EvmContract } from './evm-contract'
export { Address, LocalAddress } from './address'
export { SignedTxMiddleware, NonceTxMiddleware } from './middleware'
export { createDefaultTxMiddleware } from './helpers'
export { LoomProvider } from './loom-provider'

import * as CryptoUtils from './crypto-utils'
export { CryptoUtils }

export { IJSONRPCClient } from './internal/json-rpc-client'
export { createJSONRPCClient, IJSONRPCProtocolOptions } from './rpc-client-factory'

export { DAppChainPlasmaClient } from './plasma-cash/dappchain-client'
export { EthereumPlasmaClient, IPlasmaCoin, PlasmaCoinState } from './plasma-cash/ethereum-client'
export { PlasmaCashTx } from './plasma-cash/plasma-cash-tx'
export { Web3Signer } from './plasma-cash/solidity-helpers'
export { EthErc721Contract } from './plasma-cash/eth-erc721-contract'
