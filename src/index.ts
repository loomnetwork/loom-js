export {
  Client,
  ClientEvent,
  IClientEventArgs,
  IChainEventArgs,
  IClientErrorEventArgs,
  ITxMiddlewareHandler,
  ITxHandlerResult,
  ITxResults,
  isTxAlreadyInCacheError
} from './client'
export { Contract } from './contract'
export { EvmContract } from './evm-contract'
export { Address, LocalAddress } from './address'
export { unmarshalBigUIntPB, marshalBigUIntPB } from './big-uint'
export {
  SignedTxMiddleware,
  SignedEthTxMiddleware,
  SignedEosTxMiddleware,
  NonceTxMiddleware,
  CachedNonceTxMiddleware,
  SpeculativeNonceTxMiddleware,
  isInvalidTxNonceError
} from './middleware'
export { createDefaultTxMiddleware, eosAddressToEthAddress } from './helpers'
export { LoomProvider } from './loom-provider'

import * as Contracts from './contracts'
export { Contracts }

import * as CryptoUtils from './crypto-utils'
export { CryptoUtils }

export { IJSONRPCClient } from './internal/json-rpc-client'
export { createJSONRPCClient, IJSONRPCProtocolOptions } from './rpc-client-factory'

// The Plasma Cash client API should be considered experimental, interfaces are likely to change.
export { DAppChainPlasmaClient } from './plasma-cash/dappchain-client'
export {
  EthereumPlasmaClient,
  IPlasmaCoin,
  PlasmaCoinState,
  IPlasmaDeposit,
  IPlasmaChallenge,
  marshalChallengeEvent
} from './plasma-cash/ethereum-client'
export { PlasmaCashTx } from './plasma-cash/plasma-cash-tx'
export {
  ISignerAsync,
  OfflineWeb3Signer,
  Web3Signer,
  EosScatterSigner,
  EthersSigner,
  soliditySha3,
  getJsonRPCSignerAsync,
  getMetamaskSigner
} from './sign-helpers'
export { Entity, IEntityParams } from './plasma-cash/entity'
export { User as PlasmaUser } from './plasma-cash/user'
export { DPOSUser } from './dpos-user'
export { GatewayVersion, GatewayUser } from './gateway-user'
export { CrossChainUser } from './crosschain-user'
export { SparseMerkleTree, ISparseMerkleTreeLevel } from './plasma-cash/sparse-merkle-tree'

export { PlasmaDB, IDatabaseCoin } from './plasma-cash/db'
