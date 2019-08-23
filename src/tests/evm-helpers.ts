import { LoomProvider } from '../loom-provider'
import { LocalAddress } from '../address'
import { CryptoUtils } from '..'
import { LoomProvider2 } from '../loom-provider-2'
import { waitForMillisecondsAsync } from './helpers'

export async function deployContract(loomProvider: LoomProvider, contractData: string) {
  const privKey = loomProvider.accounts.values().next().value

  if (!privKey) {
    throw Error('Private key not found on deploy contract helper')
  }

  const fromAddr = LocalAddress.fromPublicKey(
    CryptoUtils.publicKeyFromPrivateKey(privKey)
  ).toString()

  const ethSendTransactionDeployResult = await loomProvider.sendAsync({
    id: 1,
    method: 'eth_sendTransaction',
    params: [
      {
        from: fromAddr,
        data: contractData,
        gas: '0x0',
        gasPrice: '0x0',
        value: '0x0'
      }
    ]
  })

  const ethGetTransactionReceiptResult = await loomProvider.sendAsync({
    id: 2,
    method: 'eth_getTransactionReceipt',
    params: [ethSendTransactionDeployResult.result]
  })

  return ethGetTransactionReceiptResult.result
}

export async function deployContract2(loomProvider: LoomProvider2, contractData: string) {
  const fromAddr = await loomProvider.wallet.getAddress()

  const ethSendTransactionDeployResult = await loomProvider.sendAsync({
    id: 1,
    method: 'eth_sendTransaction',
    params: [
      {
        from: fromAddr,
        data: contractData,
        gas: '0x0',
        gasPrice: '0x0',
        value: '0x0'
      }
    ]
  })

  await waitForMillisecondsAsync(2000)

  const ethGetTransactionReceiptResult = await loomProvider.sendAsync({
    id: 2,
    method: 'eth_getTransactionReceipt',
    params: [ethSendTransactionDeployResult.result]
  })

  return ethGetTransactionReceiptResult.result
}
