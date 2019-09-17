import { LoomProvider } from '../loom-provider'
import { LocalAddress } from '../address'
import { CryptoUtils } from '..'
import Web3 = require('web3')

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

// Requires ganache cli running with -d flag for deteministic results on create addresses
export async function deployContractGanache(
  web3Provider: any,
  contractData: string,
  fromAddr: string = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
) {
  const web3 = new Web3(web3Provider)

  const ethSendTransactionDeployResult = await web3.eth.sendTransaction({
    from: fromAddr,
    data: contractData,
    gas: '6721975',
    gasPrice: '0x1'
  })

  if (!ethSendTransactionDeployResult.status) {
    throw Error('Cant deploy contract on ganache')
  }

  const ethGetTransactionReceiptResult = await web3.eth.getTransactionReceipt(
    ethSendTransactionDeployResult.transactionHash
  )

  return ethGetTransactionReceiptResult
}
