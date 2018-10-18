import BN from 'bn.js'
import Web3 from 'web3'

import { PlasmaCashBlock } from './plasma-cash-block'
import { bytesToHexAddr } from '../crypto-utils'
import { PlasmaCashTx } from './plasma-cash-tx'
import SignedContract from './signed-contract'
import { Account } from 'web3/eth/accounts'

export enum PlasmaCoinMode {
  ETH = 0,
  ERC20 = 1,
  ERC721 = 2
}

export enum PlasmaCoinState {
  Deposited = 0,
  Exiting = 1,
  Exited = 2
}

export interface IPlasmaCoin {
  slot: BN
  /** Identifier of an ERC721 token. */
  uid: BN
  /** Plasma block number at which this coin was deposited. */
  depositBlockNum: BN
  denomination: BN
  /** Hex encoded Ethereum address of the current owner of the coin, prefixed by 0x. */
  owner: string
  /** The coin's state */
  state: PlasmaCoinState
  /** the coin type */
  mode: PlasmaCoinMode
  /** Hex encoded Ethereum address of the token contract, prefixed by 0x. */
  contractAddress: string
}
export interface IPlasmaExitData {
  /** Identifier of a coin's exit. */
  slot: BN
  /** Owner of the coin's exit. */
  owner: String
  /** Plasma block number at which the exit's parent transaction was included. */
  prevBlock: BN
  /** Plasma block number at which the exit's transaction was included. */
  exitBlock: BN
  state: PlasmaCoinState
}

export interface IPlasmaChallenge {
  slot: BN
  txHash: string
}

export function marshalChallengeEvent(data: { slot: string; txHash: string }): IPlasmaChallenge {
  const { slot, txHash } = data
  return {
    slot: new BN(slot),
    txHash
  }
}

export interface IPlasmaDeposit {
  slot: BN
  blockNumber: BN
  denomination: BN
  from: string
  contractAddress: string
}

// TODO: This probably shouldn't be exposed, instead add API to EthereumPlasmaClient to retrieve
// already marshalled event data
export function marshalDepositEvent(data: {
  slot: string
  blockNumber: string
  denomination: string
  from: string
  contractAddress: string
}): IPlasmaDeposit {
  const { slot, blockNumber, denomination, from, contractAddress } = data
  return {
    slot: new BN(slot),
    blockNumber: new BN(blockNumber),
    denomination: new BN(denomination),
    from,
    contractAddress
  }
}

export interface ISendTxOptions {
  /** Address of sender (hex-encoded, prefixed by 0x) */
  from: string
  /** Max gas to use for a tx (gas limit) */
  gas?: number | string
  /** Gas price (in Wei) to use for a tx */
  gasPrice?: string
}
export interface IPlasmaExitParams extends ISendTxOptions {
  slot: BN
  exitTx: PlasmaCashTx
  exitBlockNum: BN
  prevTx?: PlasmaCashTx
  prevBlockNum?: BN
}

export interface IPlasmaWithdrawParams extends ISendTxOptions {
  slot: BN
}

export interface IPlasmaChallengeParams extends ISendTxOptions {
  slot: BN
  challengingBlockNum: BN
  challengingTx: PlasmaCashTx
}

export interface IPlasmaChallengeBeforeParams extends ISendTxOptions {
  slot: BN
  challengingTx: PlasmaCashTx
  challengingBlockNum: BN
  prevTx?: PlasmaCashTx
  prevBlockNum?: BN
}

export interface IPlasmaRspondChallengeBeforeParams extends ISendTxOptions {
  slot: BN
  challengingTxHash: string
  respondingBlockNum: BN
  respondingTx: PlasmaCashTx
}

export class EthereumPlasmaClient {
  private _web3: Web3
  private _plasmaContract: any

  /**
   * Web3 contract instance of the Plasma Cash contract on Ethereum.
   */
  get plasmaCashContract(): any {
    return this._plasmaContract
  }

  constructor(web3: Web3, ethAccount: any, plasmaContractAddr: string) {
    this._web3 = web3
    const plasmaABI = require(`./contracts/plasma-cash-abi.json`)
    this._plasmaContract = new SignedContract(
      web3,
      plasmaABI,
      plasmaContractAddr,
      ethAccount
    ).instance
  }

  async getExitAsync(params: { slot: BN; from: string }): Promise<IPlasmaExitData> {
    const { slot, from } = params
    const exit = await this._plasmaContract.getExit(slot)
    return {
      slot: slot,
      owner: exit[0],
      prevBlock: new BN(exit[1]),
      exitBlock: new BN(exit[2]),
      state: parseInt(exit[3], 10)
    }
  }

  async checkMembershipAsync(params: {
    leaf: string
    root: string
    slot: BN
    proof: string
    from: string
  }): Promise<boolean> {
    const { leaf, root, slot, proof, from } = params
    const isIncluded = await this._plasmaContract.checkMembership(leaf, root, slot, proof)
    return isIncluded
  }

  async getBlockRootAsync(params: { blockNumber: BN; from: string }): Promise<string> {
    const { blockNumber, from } = params
    const root = await this._plasmaContract.getBlockRoot(blockNumber.toString())
    return root
  }

  async getPlasmaCoinAsync(params: { slot: BN; from: string }): Promise<IPlasmaCoin> {
    const { slot, from } = params
    const coin = await this._plasmaContract.getPlasmaCoin(slot.toString())
    return {
      slot: slot,
      uid: new BN(coin[0]),
      depositBlockNum: new BN(coin[1]),
      denomination: new BN(coin[2]),
      owner: coin[3],
      state: parseInt(coin[4], 10),
      mode: parseInt(coin[5], 10),
      contractAddress: coin[6]
    }
  }

  /**
   * @returns Web3 tx receipt object.
   */
  startExitAsync(params: IPlasmaExitParams): Promise<object> {
    const { slot, exitTx, exitBlockNum, prevTx, prevBlockNum, from, gas, gasPrice } = params
    const prevTxBytes = prevTx ? prevTx.rlpEncode() : '0x'
    const exitTxBytes = exitTx.rlpEncode()
    const bond = this._web3.utils.toWei('0.1', 'ether')

    return this._plasmaContract.startExit(
      [
        slot,
        prevTxBytes,
        exitTxBytes,
        prevTx ? prevTx.proof : '0x',
        exitTx.proof,
        exitTx.sig,
        [prevBlockNum || 0, exitBlockNum]
      ],
      bond
    )
  }

  /**
   *
   * @returns Web3 tx receipt object.
   */
  finalizeExitsAsync(params: ISendTxOptions): Promise<object> {
    return this._plasmaContract.finalizeExits([])
  }

  /**
   *
   * @returns Web3 tx receipt object.
   */
  withdrawAsync(params: IPlasmaWithdrawParams): Promise<object> {
    const { slot, ...rest } = params
    return this._plasmaContract.withdraw([slot])
  }

  /**
   *
   * @returns Web3 tx receipt object.
   */
  withdrawBondsAsync(params: ISendTxOptions): Promise<object> {
    return this._plasmaContract.withdrawBonds([])
  }

  /**
   * `Exit Spent Coin Challenge`: Challenge an exit with a spend after the exit's blocks.
   *
   * @returns Web3 tx receipt object.
   */
  challengeAfterAsync(params: IPlasmaChallengeParams): Promise<object> {
    const { slot, challengingBlockNum, challengingTx, ...rest } = params
    const txBytes = challengingTx.rlpEncode()
    return this._plasmaContract.challengeAfter([
      slot,
      challengingBlockNum,
      txBytes,
      challengingTx.proof,
      challengingTx.sig
    ])
  }

  /**
   * `Double Spend Challenge`: Challenge a double spend of a coin with a spend between the exit's blocks.
   *
   * @returns Web3 tx receipt object.
   */
  challengeBetweenAsync(params: IPlasmaChallengeParams): Promise<object> {
    const { slot, challengingBlockNum, challengingTx, ...rest } = params
    const txBytes = challengingTx.rlpEncode()
    return this._plasmaContract.challengeBetween([
      slot,
      challengingBlockNum,
      txBytes,
      challengingTx.proof,
      challengingTx.sig
    ])
  }

  /**
   * `Invalid History Challenge`: Challenge a coin with invalid history.
   *
   * @returns Web3 tx receipt object.
   */
  challengeBeforeAsync(params: IPlasmaChallengeBeforeParams): Promise<object> {
    const {
      slot,
      challengingTx,
      challengingBlockNum,
      prevTx,
      prevBlockNum,
      from,
      gas,
      gasPrice
    } = params
    const prevTxBytes = prevTx ? prevTx.rlpEncode() : '0x'
    const challengingTxBytes = challengingTx.rlpEncode()
    const bond = this._web3.utils.toWei('0.1', 'ether')

    return this._plasmaContract.challengeBefore(
      [
        slot,
        prevTxBytes,
        challengingTxBytes,
        prevTx ? prevTx.proof : '0x',
        challengingTx.proof,
        challengingTx.sig,
        [prevBlockNum || 0, challengingBlockNum]
      ],
      bond
    )
  }

  /**
   * `Response to invalid history challenge`: Respond to an invalid challenge with a later tx
   *
   * @returns Web3 tx receipt object.
   */
  respondChallengeBeforeAsync(params: IPlasmaRspondChallengeBeforeParams): Promise<object> {
    const { slot, challengingTxHash, respondingBlockNum, respondingTx, ...rest } = params
    const respondingTxBytes = respondingTx.rlpEncode()
    return this._plasmaContract.respondChallengeBefore([
      slot,
      challengingTxHash,
      respondingBlockNum,
      respondingTxBytes,
      respondingTx.proof,
      respondingTx.sig
    ])
  }

  /**
   * Submits a Plasma block to the Plasma Cash Solidity contract on Ethereum.
   *
   * @returns Web3 tx receipt object.
   *
   * This method is only provided for debugging & testing, in practice only DAppChain Plasma Oracles
   * will be permitted to make this request.
   */
  debugSubmitBlockAsync(params: { block: PlasmaCashBlock; from: string }): Promise<object> {
    const { block, from } = params
    return this._plasmaContract.submitBlock([bytesToHexAddr(block.merkleHash)])
  }
}
