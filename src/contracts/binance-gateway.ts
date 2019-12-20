import { TransferGateway } from './transfer-gateway'
import { Client } from '../client'
import { Address, LocalAddress } from '../address'
import {
  TransferGatewayResubmitWithdrawalRequest,
  TransferGatewayWithdrawLoomCoinRequest,
  TransferGatewayWithdrawTokenRequest,
  TransferGatewayTokenKind
} from '../proto/transfer_gateway_pb'
import { marshalBigUIntPB } from '../big-uint'
import BN from 'bn.js'

const binanceRootAddress = new Address(
  'binance',
  LocalAddress.fromHexString('0x0000000000000000000000000000000000000000')
)

export class BinanceTransferGateway extends TransferGateway {
  static async createAsync(client: Client, callerAddr: Address): Promise<BinanceTransferGateway> {
    const contractAddr = await client.getContractAddressAsync('binance-gateway')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address for Binance TransferGateway')
    }

    return new BinanceTransferGateway({ contractAddr, callerAddr, client })
  }

  /**
   * Sends a request to the DAppChain Gateway to begin withdrawal of LOOM tokens from the current
   * DAppChain account to an account on Binance Chain. Before calling this method the user
   * attempting to withdraw the tokens must approve the DAppChain Gateway to transfer the given
   * amount plus the withdrawal fee (which is always charged in BNB).
   * @param amount Amount to withdraw (not including the withdrawal fee).
   * @param recipient Binance address of the account the tokens should be withdrawn to.
   * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
   *          request.
   */
  withdrawLoomAsync(amount: BN, recipient: Address): Promise<void> {
    const req = new TransferGatewayWithdrawLoomCoinRequest()
    req.setAmount(marshalBigUIntPB(amount))
    req.setRecipient(recipient.MarshalPB())
    // TODO: It should be necessary to specify the token contract in the request, but validation
    //       checks in the gateway contract will fail if it's missing, so until the contract is
    //       fixed up we need to specify some kind of address.
    req.setTokenContract(binanceRootAddress.MarshalPB())
    return this.callAsync<void>('WithdrawLoomCoin', req)
  }

  /**
   * Sends a request to the DAppChain Gateway to begin withdrawal of BEP2 tokens from the current
   * DAppChain account to an account on Binance Chain. Before calling this method the user
   * attempting to withdraw the tokens must approve the DAppChain Gateway to transfer the given
   * amount plus the withdrawal fee (which is always charged in BNB).
   * @param amount Amount to withdraw (not including the withdrawal fee).
   * @param tokenContract DAppChain address of BEP2 contract.
   * @param recipient Binance address of the account the tokens should be withdrawn to.
   * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
   *          request.
   */
  withdrawTokenAsync(amount: BN, tokenContract: Address, recipient: Address): Promise<void> {
    const req = new TransferGatewayWithdrawTokenRequest()
    req.setTokenKind(TransferGatewayTokenKind.BEP2)
    req.setTokenAmount(marshalBigUIntPB(amount))
    req.setTokenContract(tokenContract.MarshalPB())
    req.setRecipient(recipient.MarshalPB())
    return this.callAsync<void>('WithdrawToken', req)
  }

  /**
   * Sends a request to the DAppChain Gateway to resubmit a previously rejected token withdrawal
   * from the current DAppChain account. This is currently only supported by the Binance gateway.
   * Only the original withdrawer can resubmit a reject withdrawal.
   */
  resubmitWithdrawalAsync(): Promise<void> {
    const req = new TransferGatewayResubmitWithdrawalRequest()
    return this.callAsync<void>('ResubmitWithdrawal', req)
  }
}
