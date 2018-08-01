import BN from 'bn.js'

import { Client } from '../client'
import { Contract } from '../contract'
import { Address, LocalAddress } from '../address'
import { PlasmaCashTx, marshalPlasmaTxPB } from './plasma-cash-tx'
import { PlasmaCashBlock, unmarshalPlasmaBlockPB } from './plasma-cash-block'
import { unmarshalBigUIntPB, marshalBigUIntPB } from '../big-uint'
import { IPlasmaDeposit } from './ethereum-client'
import {
  GetCurrentBlockRequest,
  GetCurrentBlockResponse,
  GetBlockRequest,
  GetBlockResponse,
  DepositRequest,
  PlasmaTxRequest,
  SubmitBlockToMainnetRequest
} from '../proto/plasma_cash_pb'

export class DAppChainPlasmaClient {
  private _dAppClient: Client
  private _plasmaContract?: Contract
  private _callerAddress: Address
  private _plasmaContractName: string

  constructor(params: { dAppClient: Client; callerAddress: Address; contractName?: string }) {
    const { dAppClient, callerAddress, contractName = 'plasmacash' } = params
    this._dAppClient = dAppClient
    this._callerAddress = callerAddress
    this._plasmaContractName = contractName
  }

  private async _resolvePlasmaContractAsync(): Promise<Contract> {
    if (!this._plasmaContract) {
      const addr = await this._dAppClient.getContractAddressAsync('plasmacash')
      if (!addr) {
        throw new Error('Failed to resolve Plasma Cash contract address.')
      }
      this._plasmaContract = new Contract({
        contractAddr: addr,
        contractName: this._plasmaContractName,
        callerAddr: this._callerAddress,
        client: this._dAppClient
      })
    }
    return this._plasmaContract
  }

  /**
   * Retrieves the latest finalized Plasma block number from the DAppChain.
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
    req.setBlockHeight(marshalBigUIntPB(blockNum))
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

  /**
   * Submits a Plasma deposit from Ethereum to the DAppChain.
   *
   * This method is only provided for debugging & testing, in practice only DAppChain Plasma Oracles
   * will be permitted to make this request.
   */
  async debugSubmitDepositAsync(deposit: IPlasmaDeposit): Promise<void> {
    const contract = await this._resolvePlasmaContractAsync()
    const ownerAddr = new Address('eth', LocalAddress.fromHexString(deposit.from))
    const tokenAddr = new Address('eth', LocalAddress.fromHexString(deposit.contractAddress))
    const req = new DepositRequest()
    req.setSlot(deposit.slot.toString(10) as any)
    req.setDepositBlock(marshalBigUIntPB(deposit.blockNumber))
    req.setDenomination(marshalBigUIntPB(deposit.denomination))
    req.setFrom(ownerAddr.MarshalPB())
    req.setContract(tokenAddr.MarshalPB())
    await contract.callAsync('DepositRequest', req)
  }
}
