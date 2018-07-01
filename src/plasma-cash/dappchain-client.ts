import BN from 'bn.js'

import { Client } from '../client'
import { Contract } from '../contract'
import { Address, LocalAddress } from '../address'
import { PlasmaCashTx, marshalPlasmaTxPB } from './plasma-cash-tx'
import { PlasmaCashBlock, unmarshalPlasmaBlockPB } from './plasma-cash-block'
import { unmarshalBigUIntPB } from '../big-uint'
import {
  GetCurrentBlockRequest,
  GetCurrentBlockResponse,
  GetBlockRequest,
  GetBlockResponse,
  PlasmaBlock,
  PlasmaTx,
  PlasmaTxRequest,
  SubmitBlockToMainnetRequest
} from '../proto/plasma_cash_pb'
import { bufferToProtobufBytes } from '../crypto-utils'

export class DAppChainPlasmaClient {
  private _dAppClient: Client
  private _plasmaContract?: Contract
  private _callerAddress: Address

  constructor(params: { dAppClient: Client; callerAddress: Address }) {
    this._dAppClient = params.dAppClient
    this._callerAddress = params.callerAddress
  }

  private async _resolvePlasmaContractAsync(): Promise<Contract> {
    if (!this._plasmaContract) {
      const addr = await this._dAppClient.getContractAddressAsync('plasmacash')
      if (!addr) {
        throw new Error('Failed to resolve Plasma Cash contract address.')
      }
      this._plasmaContract = new Contract({
        contractAddr: addr,
        contractName: 'plasmacash',
        callerAddr: this._callerAddress,
        client: this._dAppClient
      })
    }
    return this._plasmaContract
  }

  /**
   * Retrieves the latest finalized Plasma block from the DAppChain.
   */
  async getCurrentPlasmaBlockNumAsync(): Promise<BN> {
    const contract = await this._resolvePlasmaContractAsync()
    const req = new GetCurrentBlockRequest()
    const resp = await contract.staticCallAsync<GetCurrentBlockResponse>(
      'GetCurrentBlockRequest',
      req,
      new GetCurrentBlockResponse()
    )
    const blockHeight = resp.getBlockHeight()
    if (!blockHeight) {
      throw new Error('Invalid response: missing block height.')
    }
    return unmarshalBigUIntPB(blockHeight)
  }

  /**
   * Retrieves a Plasma block from the DAppChain.
   *
   * @param blockNum Height of the block to be retrieved.
   */
  async getPlasmaBlockAtAsync(blockNum: BN): Promise<PlasmaCashBlock> {
    const contract = await this._resolvePlasmaContractAsync()
    const req = new GetBlockRequest()
    const resp = await contract.staticCallAsync<GetBlockResponse>(
      'GetBlockRequest',
      req,
      new GetBlockResponse()
    )
    return unmarshalPlasmaBlockPB(resp.getBlock()!)
  }

  /**
   * Transfers a Plasma token from one entity to another.
   */
  async sendTxAsync(tx: PlasmaCashTx): Promise<void> {
    if (!tx.sig) {
      throw new Error('PlasmaCashTx must be signed before being sent to DAppChain')
    }
    const contract = await this._resolvePlasmaContractAsync()
    const req = new PlasmaTxRequest()
    req.setPlasmatx(marshalPlasmaTxPB(tx))
    await contract.callAsync('PlasmaTxRequest', req)
  }

  /**
   * Requests that the DAppChain prepares a Plasma block for submission to Ethereum.
   *
   * This method is only provided for debugging & testing, in practice only DAppChain Plasma Oracles
   * will be permitted to make this request.
   */
  async debugFinalizeBlockAsync(): Promise<void> {
    const contract = await this._resolvePlasmaContractAsync()
    const req = new SubmitBlockToMainnetRequest()
    await contract.callAsync('SubmitBlockToMainnet', req)
  }
}
