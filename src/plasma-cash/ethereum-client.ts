import BN from 'bn.js'
import Web3 from 'web3'

import { PlasmaCashBlock } from './plasma-cash-block'
import { bytesToHexAddr } from '../crypto-utils'
import { PlasmaCashTx } from './plasma-cash-tx'

export enum PlasmaCoinState {
  Deposited = 0,
  Exiting = 1,
  Challenged = 2,
  Exited = 3
}
export interface IPlasmaCoin {
  /** Identifier of an ERC721 token. */
  uid: BN
  /** Plasma block number at which this coin was deposited. */
  depositBlockNum: BN
  denomination: BN
  /** Hex encoded Ethereum address of the current owner of the coin, prefixed by 0x. */
  owner: string
  /** Hex encoded Ethereum address of the token contract, prefixed by 0x. */
  contractAddress: string
  state: PlasmaCoinState
}

export interface IPlasmaChallenge {
  slot: BN
  txHash: string
}

export function marshalChallengeEvent(data: {
  slot: string
  txHash: string
}): IPlasmaChallenge {
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
  private _plasmaContract: any // TODO: figure out how to type this properly

  /**
   * Web3 contract instance of the Plasma Cash contract on Ethereum.
   */
  get plasmaCashContract(): any {
    return this._plasmaContract
  }

  constructor(web3: Web3, plasmaContractAddr: string) {
    this._web3 = web3
    const plasmaABI = require(`./contracts/plasma-cash-abi.json`)
    this._plasmaContract = new this._web3.eth.Contract(plasmaABI, plasmaContractAddr)
  }

  async getPlasmaCoinAsync(params: { slot: BN; from: string }): Promise<IPlasmaCoin> {
    const { slot, from } = params
    const coin = await this._plasmaContract.methods.getPlasmaCoin(slot).call({ from })
    return {
      uid: new BN(coin[0]),
      depositBlockNum: new BN(coin[1]),
      denomination: new BN(coin[2]),
      owner: coin[3],
      contractAddress: coin[4],
      state: parseInt(coin[5], 10)
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

    return this._plasmaContract.methods
      .startExit(
        slot,
        prevTxBytes,
        exitTxBytes,
        prevTx ? prevTx.proof : '0x',
        exitTx.proof,
        exitTx.sig,
        [prevBlockNum || 0, exitBlockNum]
      )
      .send({ from, value: bond, gas, gasPrice })
  }

  /**
   *
   * @returns Web3 tx receipt object.
   */
  finalizeExitsAsync(params: ISendTxOptions): Promise<object> {
    return this._plasmaContract.methods.finalizeExits().send(params)
  }

  /**
   *
   * @returns Web3 tx receipt object.
   */
  withdrawAsync(params: IPlasmaWithdrawParams): Promise<object> {
    const { slot, ...rest } = params
    return this._plasmaContract.methods.withdraw(slot).send(rest)
  }

  /**
   *
   * @returns Web3 tx receipt object.
   */
  withdrawBondsAsync(params: ISendTxOptions): Promise<object> {
    return this._plasmaContract.methods.withdrawBonds().send(params)
  }

  /**
   * `Exit Spent Coin Challenge`: Challenge an exit with a spend after the exit's blocks.
   *
   * @returns Web3 tx receipt object.
   */
  challengeAfterAsync(params: IPlasmaChallengeParams): Promise<object> {
    const { slot, challengingBlockNum, challengingTx, ...rest } = params
    const txBytes = challengingTx.rlpEncode()
    return this._plasmaContract.methods
      .challengeAfter(slot, challengingBlockNum, txBytes, challengingTx.proof, challengingTx.sig)
      .send(rest)
  }

  /**
   * `Double Spend Challenge`: Challenge a double spend of a coin with a spend between the exit's blocks.
   *
   * @returns Web3 tx receipt object.
   */
  challengeBetweenAsync(params: IPlasmaChallengeParams): Promise<object> {
    const { slot, challengingBlockNum, challengingTx, ...rest } = params
    const txBytes = challengingTx.rlpEncode()
    return this._plasmaContract.methods
      .challengeBetween(slot, challengingBlockNum, txBytes, challengingTx.proof, challengingTx.sig)
      .send(rest)
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

    return this._plasmaContract.methods
      .challengeBefore(
        slot,
        prevTxBytes,
        challengingTxBytes,
        prevTx ? prevTx.proof : '0x',
        challengingTx.proof,
        challengingTx.sig,
        [prevBlockNum || 0, challengingBlockNum]
      )
      .send({ from, value: bond, gas, gasPrice })
  }

  /**
   * `Response to invalid history challenge`: Respond to an invalid challenge with a later tx
   *
   * @returns Web3 tx receipt object.
   */
  respondChallengeBeforeAsync(params: IPlasmaRspondChallengeBeforeParams): Promise<object> {
    const { slot, challengingTxHash, respondingBlockNum, respondingTx, ...rest } = params
    const respondingTxBytes = respondingTx.rlpEncode()
    return this._plasmaContract.methods
      .respondChallengeBefore(
        slot,
        challengingTxHash,
        respondingBlockNum,
        respondingTxBytes,
        respondingTx.proof,
        respondingTx.sig
      )
      .send(rest)
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
    return this._plasmaContract.methods
      .submitBlock(bytesToHexAddr(block.merkleHash))
      .send({ from })
  }
}
