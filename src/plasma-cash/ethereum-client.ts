import BN from 'bn.js'
import Web3 from 'web3'

import { PlasmaCashBlock } from './plasma-cash-block'
import { bytesToHexAddr } from '../crypto-utils'

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

  startExitAsync(params: { slot: BN; sendOpts: any }): Promise<object> {
    return this._plasmaContract.methods.startExit(params.slot).send(params.sendOpts)
  }

  finalizeExitsAsync(params: { sendOpts: any }): Promise<object> {
    return this._plasmaContract.methods.finalizeExits().send(params.sendOpts)
  }

  withdrawAsync() {}
  withdrawBondsAsync() {}

  /**
   * Submits a Plasma block to the Plasma Cash Solidity contract on Ethereum.
   *
   * @returns Web3 tx receipt.
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
