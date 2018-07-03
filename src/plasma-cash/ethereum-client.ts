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
  state: PlasmaCoinState
}

export interface IPlasmaDeposit {
  slot: BN
  blockNumber: BN
  denomination: BN
  from: string
}

// TODO: This probably shouldn't be exposed, instead add API to EthereumPlasmaClient to retrieve
// already marshalled event data
export function marshalDepositEvent(data: {
  slot: string
  blockNumber: string
  denomination: string
  from: string
}): IPlasmaDeposit {
  const { slot, blockNumber, denomination, from } = data
  return {
    slot: new BN(slot),
    blockNumber: new BN(blockNumber),
    denomination: new BN(denomination),
    from
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
      state: parseInt(coin[4], 10)
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
