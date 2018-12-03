import { TransferGateway } from './transfer-gateway'
import { Client } from '../client'
import { Address } from '../address'
import { TransferGatewayWithdrawLoomCoinRequest } from '../proto/transfer_gateway_pb'
import { marshalBigUIntPB } from '../big-uint'
import BN from 'bn.js'

export class LoomCoinTransferGateway extends TransferGateway {
  static async createAsync(client: Client, callerAddr: Address): Promise<LoomCoinTransferGateway> {
    const contractAddr = await client.getContractAddressAsync('loomcoin-gateway')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address for TransferGateway')
    }

    return new LoomCoinTransferGateway({ contractAddr, callerAddr, client })
  }

  /**
   * Sends a request to the DAppChain Gateway to begin withdrawal of LOOM from the current
   * DAppChain account to an Ethereum account.
   * @param amount Amount to withdraw.
   * @param mainnetLoomcoinAddress Ethereum address of Ethereum Gateway.
   * @param recipient Ethereum address of the account the token should be withdrawn to, if this is
   *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
   *                  address of the Ethereum account mapped to the current DAppChain account.
   * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
   *          request.
   */
  withdrawLoomCoinAsync(
    amount: BN,
    mainnetLoomcoinAddress: Address,
    recipient?: Address
  ): Promise<void> {
    const req = new TransferGatewayWithdrawLoomCoinRequest()
    req.setAmount(marshalBigUIntPB(amount))
    req.setTokenContract(mainnetLoomcoinAddress.MarshalPB())
    if (recipient) {
      req.setRecipient(recipient.MarshalPB())
    }

    return this.callAsync<void>('WithdrawLoomCoin', req)
  }
}
