import { Client } from './client'
import { Contract } from './contract'
import { Address, LocalAddress } from './address'
import { publicKeyFromPrivateKey } from './crypto-utils'
import {
  AddressMapperAddContractMappingRequest,
  Transaction,
  VMType,
  MessageTx,
  CallTx
} from './proto/loom_pb'
import { CryptoUtils } from '.'

export class AddressMapper {
  private _client: Client
  private _privateKey: Uint8Array
  private _addressMapperContract?: Contract

  constructor(client: Client, privateKey: Uint8Array) {
    this._client = client
    this._privateKey = privateKey
  }

  public async loadContract() {
    let contractAddr
    try {
      contractAddr = await this._client.getContractAddressAsync('addressmapper')
      if (!contractAddr) {
        throw Error('Failed to resolve contract address')
      }

      const pubKey = publicKeyFromPrivateKey(this._privateKey)
      const callerAddr = new Address(this._client.chainId, LocalAddress.fromPublicKey(pubKey))

      this._addressMapperContract = new Contract({
        contractAddr,
        callerAddr,
        client: this._client
      })
    } catch (err) {
      throw err
    }
  }

  async addContractMapping(from: Address, to: Address): Promise<Uint8Array | void> {
    const mappingRequest = new AddressMapperAddContractMappingRequest()
    mappingRequest.setFrom(from.MarshalPB())
    mappingRequest.setTo(to.MarshalPB())

    const fromSender = new Address(
      'default',
      new LocalAddress(CryptoUtils.publicKeyFromPrivateKey(this._privateKey))
    )

    const toSender = (this._addressMapperContract as Contract).address

    const callTx = new CallTx()
    callTx.setVmType(VMType.PLUGIN)
    callTx.setInput(mappingRequest.serializeBinary())

    const msgTx = new MessageTx()
    msgTx.setFrom(fromSender.MarshalPB())
    msgTx.setTo(toSender.MarshalPB())
    msgTx.setData(callTx.serializeBinary())

    const tx = new Transaction()
    tx.setId(2)
    tx.setData(mappingRequest.serializeBinary())

    return this._client.commitTxAsync<Transaction>(tx)
  }
}
