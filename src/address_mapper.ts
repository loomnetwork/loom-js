import { Client } from './client'
import { Contract } from './contract'
import { Address, LocalAddress } from './address'
import { publicKeyFromPrivateKey } from './crypto-utils'
import {
  AddressMapperAddContractMappingRequest,
  AddressMapperAddIdentityMappingRequest
} from './proto/loom_pb'
import { Web3Signer, soliditySha3 } from './plasma-cash/solidity-helpers'
import Web3 from 'web3'

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

  async addIdentityMapping(from: Address, to: Address, web3: Web3, ethAddress: string) {
    const mappingIdentityRequest = new AddressMapperAddIdentityMappingRequest()
    mappingIdentityRequest.setFrom(from.MarshalPB())
    mappingIdentityRequest.setTo(to.MarshalPB())

    const hash = soliditySha3(
      [
        { type: 'address', value: from.local.toString().slice(2) },
        { type: 'address', value: to.local.toString().slice(2) }
      ].join('')
    )

    const signer = new Web3Signer(web3, ethAddress)
    const sign = await signer.signAsync(hash)

    mappingIdentityRequest.setSignature(sign)

    return this._addressMapperContract.callAsync<void>(
      'AddIdentityMapping',
      mappingIdentityRequest
    )
  }
}
