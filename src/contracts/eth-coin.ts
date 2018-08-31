import { Coin } from './coin'
import { Client } from '../client'
import { Address } from '../address'

export class EthCoin extends Coin {
  static async createAsync(client: Client, callerAddr: Address): Promise<Coin> {
    const contractAddr = await client.getContractAddressAsync('ethcoin')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address')
    }

    return new Coin({ contractAddr, callerAddr, client })
  }
}
