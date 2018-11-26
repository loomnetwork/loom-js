import { Coin } from './coin'
import { Client } from '../client'
import { Address } from '../address'

export class EthCoin extends Coin {
  static async createAsync(client: Client, callerAddr: Address): Promise<EthCoin> {
    const contractAddr = await client.getContractAddressAsync('ethcoin')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    return new EthCoin({ contractAddr, callerAddr, client })
  }

  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super(params)
  }
}
