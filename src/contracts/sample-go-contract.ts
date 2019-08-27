import BN from 'bn.js'
import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  SampleGoContractNestedEvmRequest
} from '../proto/sample_go_contract_pb'

export class SampleGoContract extends Contract {
  static async createAsync(client: Client, callerAddr: Address): Promise<SampleGoContract> {
    const contractAddr = await client.getContractAddressAsync('sample-go-contract')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }
    return new SampleGoContract({ contractAddr, callerAddr, client })
  }

  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super(params)
  }

  testNestedEvmCallsAsync(
    innerEmitter: Address,
    outerEmitter: Address,
    innerEmitterValue: number,
    outerEmitterValue: number,
  ): Promise<Uint8Array | void> {
    const request = new SampleGoContractNestedEvmRequest()
    request.setInnerEmitter(innerEmitter.MarshalPB())
    request.setOuterEmitter(outerEmitter.MarshalPB())
    request.setInnerEmitterValue(innerEmitterValue)
    request.setOuterEmitterValue(outerEmitterValue)

    return this.callAsync<void>('TestNestedEvmCalls', request)
  }
}
