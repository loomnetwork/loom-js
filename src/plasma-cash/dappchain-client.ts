import BN from 'bn.js'

import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
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

export class PlasmaCashBlock {
  private _txs: PlasmaCashTx[]

  constructor(params: { txs: PlasmaCashTx[] }) {
    this._txs = params.txs
  }

  get txs(): ReadonlyArray<PlasmaCashTx> {
    return this._txs
  }
}
export class PlasmaCashTx {
  slot: BN
  prevBlockNum: BN
  denomination: BN
  newOwner: Address
  proof: Uint8Array
}

export class DAppChainPlasmaClient {
  private _dappClient: Client
  private _plasmaContract: Contract
  private _callerAddress: Address

  constructor(params: { dappClient: Client; callerAddress: Address }) {
    this._dappClient = params.dappClient
    this._callerAddress = params.callerAddress
  }

  private async _resolvePlasmaContractAsync(): Promise<Contract> {
    if (!this._plasmaContract) {
      const addr = await this._dappClient.getContractAddressAsync('plasmacash')
      this._plasmaContract = new Contract({
        contractAddr: addr,
        contractName: 'plasmacash',
        callerAddr: this._callerAddress,
        client: this._dappClient
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
    return unmarshalBigUInt(resp.getBlockHeight_asU8())
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
    return unmarshalPlasmaBlock(resp.getBlock())
  }

  /**
   * Transfers a Plasma token from one entity to another.
   */
  async sendTxAsync(params: {
    slot: BN
    prevBlockNum: BN
    denomination: BN
    newOwner: Address
    sig: Uint8Array
  }): Promise<void> {
    const contract = await this._resolvePlasmaContractAsync()
    const tx = new PlasmaTx()
    tx.setSlot(params.slot.toNumber())
    tx.setPreviousBlock(marshalBigUInt(params.prevBlockNum))
    tx.setDenomination(marshalBigUInt(params.denomination))
    tx.setNewOwner(params.newOwner.MarshalPB())
    tx.setSignature(bufferToProtobufBytes(params.sig))
    const req = new PlasmaTxRequest()
    req.setPlasmatx(tx)
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

function unmarshalBigUInt(value: Uint8Array): BN {
  return new BN(Buffer.from(value.buffer, value.byteOffset, value.byteLength), 10, 'be')
}

function marshalBigUInt(value: BN): Uint8Array {
  return bufferToProtobufBytes(value.toArrayLike(Buffer as any, 'be') as Uint8Array)
}

function unmarshalPlasmaBlock(rawBlock: PlasmaBlock): PlasmaCashBlock {
  const txs = rawBlock.getTransactionsList().map(tx => unmarshalPlasmaTx(tx))
  return new PlasmaCashBlock({ txs })
}

function unmarshalPlasmaTx(rawTx: PlasmaTx): PlasmaCashTx {
  const tx = new PlasmaCashTx()
  tx.slot = new BN(rawTx.getSlot())
  tx.prevBlockNum = unmarshalBigUInt(rawTx.getPreviousBlock_asU8())
  tx.denomination = unmarshalBigUInt(rawTx.getDenomination_asU8())
  tx.newOwner = Address.UmarshalPB(rawTx.getNewOwner())
  tx.proof = rawTx.getProof_asU8()
  return tx
}
