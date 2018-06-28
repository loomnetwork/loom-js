import BN from 'bn.js'
import Web3 from 'web3'

const web3 = new Web3()

export class EthereumPlasmaClient {
  private _plasmaContract: any // TODO: figure out how to type this properly

  constructor(plasmaContractAddr: string) {
    const plasmaABI = require('./contracts/plasma-cash-abi.json')
    this._plasmaContract = new web3.eth.Contract(plasmaABI)
  }

  startExitAsync(params: { slot: BN; sendOpts: any }): Promise<any> {
    return this._plasmaContract.methods.startExit(params.slot).send(params.sendOpts)
  }

  finalizeExitsAsync(params: { sendOpts: any }): Promise<any> {
    return this._plasmaContract.methods.finalizeExits().send(params.sendOpts)
  }

  withdrawAsync() {}
  withdrawBondsAsync() {}
}
