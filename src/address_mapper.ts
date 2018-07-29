import { Client } from './client'
import { Contract } from './contract'
import { Address, LocalAddress } from './address'
import { publicKeyFromPrivateKey } from './crypto-utils'
import {
  AddressMapperAddContractMappingRequest,
  AddressMapperAddIdentityMappingRequest
} from './proto/loom_pb'
import { keccak256, ecsign, toBuffer } from 'ethereumjs-util'

export class AddressMapper {
  private _client: Client
  private _privateKey: Uint8Array
  private _addressMapperContract!: Contract

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
    const mappingContractRequest = new AddressMapperAddContractMappingRequest()
    mappingContractRequest.setFrom(from.MarshalPB())
    mappingContractRequest.setTo(to.MarshalPB())
    return this._addressMapperContract.callAsync<void>(
      'AddContractMapping',
      mappingContractRequest
    )
  }

  private _signIdentityMapping(from: Address, to: Address, privateKey: Uint8Array) {
    const hash = keccak256([from.toString(), to.toString()])
    return ecsign(hash, privateKey)
  }

  async addIdentityMapping(from: Address, to: Address, privateKey: Uint8Array) {
    const mappingIdentityRequest = new AddressMapperAddIdentityMappingRequest()
    mappingIdentityRequest.setFrom(from.MarshalPB())
    mappingIdentityRequest.setTo(to.MarshalPB())

    const { r, s, v } = this._signIdentityMapping(from, to, privateKey)
    const mode = toBuffer(1) as Buffer // geth
    mappingIdentityRequest.setSignature(Buffer.concat([mode, r, s, toBuffer(v)]))

    return this._addressMapperContract.callAsync<void>(
      'AddIdentityMapping',
      mappingIdentityRequest
    )
  }
}
