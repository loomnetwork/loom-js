import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  AddressMapperAddIdentityMappingRequest,
  AddressMapperGetMappingRequest,
  AddressMapperGetMappingResponse
} from '../proto/address_mapper_pb'
import { IEthereumSigner, soliditySha3 } from '../solidity-helpers'

export interface IAddressMapping {
  from: Address
  to: Address
}

export class AddressMapper extends Contract {
  static async createAsync(client: Client, callerAddr: Address): Promise<AddressMapper> {
    const contractAddr = await client.getContractAddressAsync('addressmapper')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    return new AddressMapper({ contractAddr, callerAddr, client })
  }

  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super(params)
  }

  async addIdentityMappingAsync(
    from: Address,
    to: Address,
    web3Signer: IEthereumSigner
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

    return this.callAsync<void>('AddIdentityMapping', mappingIdentityRequest)
  }

  async getMappingAsync(from: Address): Promise<IAddressMapping> {
    const getMappingRequest = new AddressMapperGetMappingRequest()
    getMappingRequest.setFrom(from.MarshalPB())

    const result = await this.staticCallAsync(
      'GetMapping',
      getMappingRequest,
      new AddressMapperGetMappingResponse()
    )

    return {
      from: Address.UmarshalPB(result.getFrom()!),
      to: Address.UmarshalPB(result.getTo()!)
    } as IAddressMapping
  }
}
