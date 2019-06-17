import { TransferGateway } from './transfer-gateway'
import { Client } from '../client'
import { Address } from '../address'
import { TransferGatewayWithdrawLoomCoinRequest } from '../proto/transfer_gateway_pb'
import { marshalBigUIntPB } from '../big-uint'
import BN from 'bn.js'

export class BinanceTransferGateway extends TransferGateway {
  static async createAsync(client: Client, callerAddr: Address): Promise<BinanceTransferGateway> {
    const contractAddr = await client.getContractAddressAsync('binance-gateway')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address for Binance TransferGateway')
    }

    return new BinanceTransferGateway({ contractAddr, callerAddr, client })
  }

  WithdrawLoomToBinanceDexAsync(
    amount: BN,
    recipient: Address
  ): Promise<void> {
    const req = new TransferGatewayWithdrawLoomCoinRequest()
    req.setAmount(marshalBigUIntPB(amount))
    req.setRecipient(recipient.MarshalPB())
    return this.callAsync<void>('WithdrawLoomCoin', req)
  }
}
