import { Client } from './client'
import { Contract } from './contract'
import { Address, LocalAddress } from './address'
import { publicKeyFromPrivateKey } from './crypto-utils'
import {
  AddressMapperAddContractMappingRequest,
  AddressMapperAddIdentityMappingRequest,
  AddressMapperGetMappingRequest,
  AddressMapperGetMappingResponse
} from './proto/loom_pb'
import { Web3Signer, soliditySha3 } from './plasma-cash/solidity-helpers'

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

  async addContractMappingAsync(from: Address, to: Address): Promise<void> {
    const mappingContractRequest = new AddressMapperAddContractMappingRequest()
    mappingContractRequest.setFrom(from.MarshalPB())
    mappingContractRequest.setTo(to.MarshalPB())
    return this._addressMapperContract.callAsync<void>(
      'AddContractMapping',
      mappingContractRequest
    )
  }

  async getContractMappingAsync(from: Address): Promise<AddressMapperGetMappingResponse> {
    const getMappingRequest = new AddressMapperGetMappingRequest()
    getMappingRequest.setFrom(from.MarshalPB())

    return this._addressMapperContract.staticCallAsync(
      'GetMapping',
      getMappingRequest,
      new AddressMapperGetMappingResponse()
    )
  }

  async addIdentityMappingAsync(
    from: Address,
    to: Address,
    web3Signer: Web3Signer
  ): Promise<Uint8Array | void> {
    const mappingIdentityRequest = new AddressMapperAddIdentityMappingRequest()
    mappingIdentityRequest.setFrom(from.MarshalPB())
    mappingIdentityRequest.setTo(to.MarshalPB())

    const hash = soliditySha3(
      {
        type: 'address',
        value: from.local.toString().slice(2)
      },
      { type: 'address', value: to.local.toString().slice(2) }
    )

    const sign = await web3Signer.signAsync(hash)
    mappingIdentityRequest.setSignature(sign)

    return this._addressMapperContract.callAsync<void>(
      'AddIdentityMapping',
      mappingIdentityRequest
    )
  }
}
