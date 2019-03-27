import { LoomProvider } from '../loom-provider'
import { LocalAddress } from '../address'
import { CryptoUtils } from '..'

export async function deployContract(loomProvider: LoomProvider, contractData: string) {
  const privKey = loomProvider.accounts.values().next().value

  if (!privKey) {
    throw Error('Private key not found on deploy contract helper')
  }

  const fromAddr = LocalAddress.fromPublicKey(
    CryptoUtils.publicKeyFromPrivateKey(privKey)
  ).toString()

  const ethSendTransactionDeployResult = await loomProvider.sendAsync({
    id: 100,
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
    id: 200,
    method: 'eth_getTransactionReceipt',
    params: [ethSendTransactionDeployResult.result]
  })

  return ethGetTransactionReceiptResult.result
}
