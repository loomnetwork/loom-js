import BN from 'bn.js'

import { Client } from '../client'
import { Contract } from '../contract'
import { Address, LocalAddress } from '../address'
import { PlasmaCashTx, marshalPlasmaTxPB, unmarshalPlasmaTxPB } from './plasma-cash-tx'
import { PlasmaCashBlock, unmarshalPlasmaBlockPB } from './plasma-cash-block'
import { unmarshalBigUIntPB, marshalBigUIntPB } from '../big-uint'
import { IPlasmaDeposit } from './ethereum-client'
import {
  GetCurrentBlockRequest,
  GetCurrentBlockResponse,
  GetPlasmaTxRequest,
  GetPlasmaTxResponse,
  GetUserSlotsRequest,
  GetUserSlotsResponse,
  GetBlockRequest,
  GetBlockResponse,
  DepositRequest,
  PlasmaTxRequest,
  SubmitBlockToMainnetRequest,
  PlasmaTx
} from '../proto/plasma_cash_pb'
import { PlasmaDB } from './db'

export class DAppChainPlasmaClient {
  private _dAppClient: Client
  private _plasmaContract?: Contract
  private _callerAddress: Address
  private _plasmaContractName: string
  private _database: PlasmaDB

  get contractName() {
    return this._plasmaContractName
  }
  get database() {
    return this._database
  }

  constructor(params: {
    dAppClient: Client
    callerAddress: Address
    database: PlasmaDB
    contractName?: string
  }) {
    const { dAppClient, callerAddress, database, contractName = 'plasmacash' } = params
    this._dAppClient = dAppClient
    this._callerAddress = callerAddress
    this._database = database
    this._plasmaContractName = contractName
  }

  private async _resolvePlasmaContractAsync(): Promise<Contract> {
    if (!this._plasmaContract) {
      const addr = await this._dAppClient.getContractAddressAsync(this._plasmaContractName)
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
   * Retrieves a merkle proof from the DAppChain regarding a coin at a block
   *
   * @param blockNum Height of the block to be retrieved.
   * @param slot The coin id
   * @return
   */
  async getPlasmaTxAsync(slot: BN, blockNum: BN): Promise<PlasmaCashTx> {
    const contract = await this._resolvePlasmaContractAsync()
    const req = new GetPlasmaTxRequest()
    req.setBlockHeight(marshalBigUIntPB(blockNum))
    req.setSlot(slot.toString(10) as any)
    const resp = await contract.staticCallAsync<GetPlasmaTxResponse>(
      'GetPlasmaTxRequest',
      req,
      new GetPlasmaTxResponse()
    )
    const rawTx: PlasmaTx = resp.getPlasmaTx()!

    // If we're getting a non-existing transaction, we just return its slot and its non-inclusion proof
    if (!rawTx.hasNewOwner()) {
      return new PlasmaCashTx({
        slot: slot,
        prevBlockNum: new BN(0),
        denomination: 1,
        newOwner: '0x0000000000000000000000000000000000000000',
        proof: rawTx.getProof_asU8()
      })
    }

    return unmarshalPlasmaTxPB(resp.getPlasmaTx()!)
  }

  /**
   * Retrieves a merkle proof from the DAppChain regarding a coin at a block
   *
   * @param blockNum Height of the block to be retrieved.
   * @param slot The coin id
   * @return
   */
  async getUserSlotsAsync(_ethAddress: Address): Promise<BN[]> {
    const contract = await this._resolvePlasmaContractAsync()
    const req = new GetUserSlotsRequest()
    req.setFrom(_ethAddress.MarshalPB())
    const resp: GetUserSlotsResponse = await contract.staticCallAsync<GetUserSlotsResponse>(
      'GetUserSlotsRequest',
      req,
      new GetUserSlotsResponse()
    )
    return resp.getSlotsList().map(s => new BN(s))
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
