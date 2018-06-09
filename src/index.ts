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
