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
export { unmarshalBigUIntPB, marshalBigUIntPB } from './big-uint'
export { SignedTxMiddleware, NonceTxMiddleware } from './middleware'
export { createDefaultTxMiddleware } from './helpers'
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
  marshalDepositEvent,
  IPlasmaChallenge,
  marshalChallengeEvent
} from './plasma-cash/ethereum-client'
export { PlasmaCashTx } from './plasma-cash/plasma-cash-tx'
export { IEthereumSigner, Web3Signer, OfflineWeb3Signer, soliditySha3 } from './solidity-helpers'
export { EthErc721Contract } from './plasma-cash/eth-erc721-contract'
export { Entity, IEntityParams } from './plasma-cash/entity'
export { User as PlasmaUser, IAddressbook } from './plasma-cash/user'
export { SparseMerkleTree, ISparseMerkleTreeLevel } from './plasma-cash/sparse-merkle-tree'

import SignedContract from './plasma-cash/signed-contract'
export { SignedContract }

export { PlasmaDB, IDatabaseCoin } from './plasma-cash/db'
