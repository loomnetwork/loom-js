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
  private _addressMapperContract!: Contract

  static async createAsync(client: Client, callerAddr: Address): Promise<AddressMapper> {
    const contractAddr = await client.getContractAddressAsync('addressmapper')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    const contract = new Contract({
      contractAddr,
      callerAddr,
      client
    })

    return new AddressMapper(contract)
  }

  constructor(contract: Contract) {
    this._addressMapperContract = contract
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

  async getContractMappingAsync(from: Address): Promise<{ from: Address; to: Address }> {
    const getMappingRequest = new AddressMapperGetMappingRequest()
    getMappingRequest.setFrom(from.MarshalPB())

    const result = await this._addressMapperContract.staticCallAsync(
      'GetMapping',
      getMappingRequest,
      new AddressMapperGetMappingResponse()
    )

    return { from: Address.UmarshalPB(result.getFrom()!), to: Address.UmarshalPB(result.getTo()!) }
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
