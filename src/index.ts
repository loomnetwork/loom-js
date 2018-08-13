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
export { AddressMapper } from './address_mapper'
export { TransferGateway } from './transfer-gateway'
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
export { Web3Signer, soliditySha3 } from './plasma-cash/solidity-helpers'
export { EthErc721Contract } from './plasma-cash/eth-erc721-contract'
export { Entity, IEntityParams } from './plasma-cash/entity'
export { SparseMerkleTree, ISparseMerkleTreeLevel } from './plasma-cash/sparse-merkle-tree'
