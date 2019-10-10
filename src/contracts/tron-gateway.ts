import { TransferGateway } from './transfer-gateway'
import { Client } from '../client'
import { Address } from '../address'

export class TronTransferGateway extends TransferGateway {
  static async createAsync(client: Client, callerAddr: Address): Promise<TronTransferGateway> {
    const contractAddr = await client.getContractAddressAsync('tron-gateway')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address for Tron TransferGateway')
    }

    return new TronTransferGateway({ contractAddr, callerAddr, client })
  }
}
