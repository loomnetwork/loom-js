import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  AddressMapperAddIdentityMappingRequest,
  AddressMapperGetMappingRequest,
  AddressMapperGetMappingResponse,
  AddressMapperHasMappingRequest,
  AddressMapperHasMappingResponse
} from '../proto/address_mapper_pb'
import { ISignerAsync, soliditySha3 } from '../sign-helpers'

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
    signer: ISignerAsync
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

    const sign = await signer.signAsync(hash)
    mappingIdentityRequest.setSignature(sign)

    return this.callAsync<void>('AddIdentityMapping', mappingIdentityRequest)
  }

  async hasMappingAsync(from: Address): Promise<boolean> {
    const hasMappingRequest = new AddressMapperHasMappingRequest()
    hasMappingRequest.setFrom(from.MarshalPB())

    const result = await this.staticCallAsync(
      'HasMapping',
      hasMappingRequest,
      new AddressMapperHasMappingResponse()
    )

    return result.getHasMapping()
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
      from: Address.UnmarshalPB(result.getFrom()!),
      to: Address.UnmarshalPB(result.getTo()!)
    } as IAddressMapping
  }
}
