import BN from 'bn.js'
import Web3 from 'web3'

import { PlasmaCashBlock } from './plasma-cash-block'
import { bytesToHexAddr } from '../crypto-utils'
import { PlasmaCashTx } from './plasma-cash-tx'
import { ethers } from 'ethers'
import { hexBN } from '../helpers'

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
  timestamp: BN
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

export interface IPlasmaFinalizeExitsParams extends ISendTxOptions {
  slots: BN[]
}

export interface IPlasmaCancelExitsParams extends ISendTxOptions {
  slots: BN[]
}

export interface IPlasmaFinalizeExitParams extends ISendTxOptions {
  slot: BN
}

export interface IPlasmaCancelExitParams extends ISendTxOptions {
  slot: BN
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
  private _ethers: ethers.Signer
  private _web3: Web3
  private _plasmaContract: ethers.Contract
  private _plasmaEventListener: any

  /**
   * Web3 contract instance of the Plasma Cash contract on Ethereum.
   */
  get plasmaCashContract(): ethers.Contract {
    return this._plasmaContract
  }

  /**
   * Web3 contract instance of the Plasma Cash contract linked to a wss enabled endpoint for listening to events
   */
  get plasmaEvents(): any {
    return this._plasmaEventListener
  }

  get web3(): Web3 {
    return this._web3
  }

  constructor(_ethers: ethers.Signer, plasmaContractAddr: string, eventsEndpoint: string) {
    this._ethers = _ethers
    const plasmaABI = require(`./contracts/plasma-cash-abi.json`)
    this._plasmaContract = new ethers.Contract(plasmaContractAddr, plasmaABI, this._ethers)

    // Setup a second instance of the contract because Metamask does not support filtering events
    // Use ethers here for listening to events
    const web3 = new Web3(new Web3.providers.WebsocketProvider(eventsEndpoint))
    this._web3 = web3
    this._plasmaEventListener = new web3.eth.Contract(plasmaABI, plasmaContractAddr)
  }

  async getExitAsync(params: { slot: BN; from: string }): Promise<IPlasmaExitData> {
    const { slot, from } = params
    const exit = await this._plasmaContract.getExit('0x' + slot.toString(16))
    return {
      slot: slot,
      owner: exit[0],
      prevBlock: hexBN(exit[1]),
      exitBlock: hexBN(exit[2]),
      state: parseInt(exit[3], 10),
      timestamp: hexBN(exit[4])
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
    const isIncluded = await this._plasmaContract.checkMembership(
      leaf,
      root,
      '0x' + slot.toString(16),
      proof
    )
    return isIncluded
  }

  async getBlockRootAsync(params: { blockNumber: BN; from: string }): Promise<string> {
    const { blockNumber, from } = params
    const root = await this._plasmaContract.getBlockRoot('0x' + blockNumber.toString(16))
    return root
  }

  async getPlasmaCoinAsync(params: { slot: BN; from: string }): Promise<IPlasmaCoin> {
    const { slot, from } = params
    const coin = await this._plasmaContract.getPlasmaCoin('0x' + slot.toString(16))
    return {
      slot: slot,
      uid: hexBN(coin[0]),
      depositBlockNum: hexBN(coin[1]),
      denomination: hexBN(coin[2]),
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
    // @ts-ignore
    const bond = ethers.utils.parseEther('0.1')._hex

    let prevBlk
    if (prevBlockNum !== undefined) {
      prevBlk = '0x' + prevBlockNum.toString(16)
    } else {
      prevBlk = 0
    }

    return this._plasmaContract.startExit(
      '0x' + slot.toString(16),
      prevTxBytes,
      exitTxBytes,
      prevTx ? prevTx.proof : '0x',
      exitTx.proof,
      exitTx.sig,
      [prevBlk, '0x' + exitBlockNum.toString(16)],
      { value: bond, gasLimit: gas }
    )
  }

  /**
   *
   * @returns Web3 tx receipt object.
   */
  cancelExitAsync(params: IPlasmaCancelExitParams): Promise<object> {
    const { slot, from, gas, gasPrice} = params
    return this._plasmaContract.cancelExits(slot, { gasLimit: gas })
  }

  /**
   *
   * @returns Web3 tx receipt object.
   */
  cancelExitsAsync(params: IPlasmaCancelExitsParams): Promise<object> {
    const { slots, from, gas, gasPrice} = params
    return this._plasmaContract.cancelExits(slots, { gasLimit: gas })
  }


  /**
   *
   * @returns Web3 tx receipt object.
   */
  finalizeExitAsync(params: IPlasmaFinalizeExitParams): Promise<object> {
    const { slot, from, gas, gasPrice} = params
    return this._plasmaContract.finalizeExits(slot, { gasLimit: gas })
  }

  /**
   *
   * @returns Web3 tx receipt object.
   */
  finalizeExitsAsync(params: IPlasmaFinalizeExitsParams): Promise<object> {
    const { slots, from, gas, gasPrice} = params
    return this._plasmaContract.finalizeExits(slots, { gasLimit: gas })
  }

  /**
   *
   * @returns Web3 tx receipt object.
   */
  withdrawAsync(params: IPlasmaWithdrawParams): Promise<object> {
    const { slot, from, gas, gasPrice } = params
    return this._plasmaContract.withdraw('0x' + slot.toString(16), { gasLimit: gas })
  }

  /**
   *
   * @returns Web3 tx receipt object.
   */
  withdrawBondsAsync(params: ISendTxOptions): Promise<object> {
    const { from, gas, gasPrice } = params
    return this._plasmaContract.withdrawBonds({ gasLimit: gas })
  }

  /**
   * `Exit Spent Coin Challenge`: Challenge an exit with a spend after the exit's blocks.
   *
   * @returns Web3 tx receipt object.
   */
  challengeAfterAsync(params: IPlasmaChallengeParams): Promise<object> {
    const { slot, challengingBlockNum, challengingTx, from, gas, gasPrice } = params
    // console.log("challenging with", params)
    const txBytes = challengingTx.rlpEncode()
    return this._plasmaContract.challengeAfter(
      '0x' + slot.toString(16),
      '0x' + challengingBlockNum.toString(16),
      txBytes,
      challengingTx.proof,
      challengingTx.sig,
      { gasLimit: gas }
    )
  }

  /**
   * `Double Spend Challenge`: Challenge a double spend of a coin with a spend between the exit's blocks.
   *
   * @returns Web3 tx receipt object.
   */
  challengeBetweenAsync(params: IPlasmaChallengeParams): Promise<object> {
    const { slot, challengingBlockNum, challengingTx, from, gas, gasPrice } = params
    const txBytes = challengingTx.rlpEncode()
    return this._plasmaContract.challengeBetween(
      '0x' + slot.toString(16),
      '0x' + challengingBlockNum.toString(16),
      txBytes,
      challengingTx.proof,
      challengingTx.sig,
      { gasLimit: gas }
    )
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
    const bond = ethers.utils.parseEther('0.1')

    let prevBlk
    if (prevBlockNum !== undefined) {
      prevBlk = '0x' + prevBlockNum.toString(16)
    } else {
      prevBlk = 0
    }

    return this._plasmaContract.challengeBefore(
      '0x' + slot.toString(16),
      prevTxBytes,
      challengingTxBytes,
      prevTx ? prevTx.proof : '0x',
      challengingTx.proof,
      challengingTx.sig,
      [prevBlk, '0x' + challengingBlockNum.toString(16)],
      { value: bond, gasLimit: gas }
    )
  }

  /**
   * `Response to invalid history challenge`: Respond to an invalid challenge with a later tx
   *
   * @returns Web3 tx receipt object.
   */
  respondChallengeBeforeAsync(params: IPlasmaRspondChallengeBeforeParams): Promise<object> {
    const {
      slot,
      challengingTxHash,
      respondingBlockNum,
      respondingTx,
      from,
      gas,
      gasPrice
    } = params
    const respondingTxBytes = respondingTx.rlpEncode()
    return this._plasmaContract.respondChallengeBefore(
      '0x' + slot.toString(16),
      challengingTxHash,
      '0x' + respondingBlockNum.toString(16),
      respondingTxBytes,
      respondingTx.proof,
      respondingTx.sig,
      { gasLimit: gas }
    )
  }

  marshalDepositEvent(log: ethers.providers.Log): IPlasmaDeposit {
    const decoded = this.plasmaCashContract.interface.parseLog(log).values
    return {
      slot: hexBN(decoded.slot),
      blockNumber: hexBN(decoded.blockNumber),
      denomination: hexBN(decoded.denomination),
      from: decoded.from,
      contractAddress: decoded.contractAddress
    }
  }
}
