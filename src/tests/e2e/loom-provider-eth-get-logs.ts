import test from 'tape'

import { LocalAddress, CryptoUtils } from '../../index'
import { createTestClient, execAndWaitForMillisecondsAsync } from '../helpers'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { numberToHex } from '../../crypto-utils'
import { SimpleStore } from '../contracts_bytecode'

async function newTransactionToSetState(loomProvider: LoomProvider, fromAddr: string) {
  const contractDeployResult = await deployContract(loomProvider, SimpleStore)
  const contractAddress = contractDeployResult.contractAddress

  // Send transaction to function set in order dispatch event NewValueSet
  const ethSendTransactionResult = await loomProvider.sendAsync({
    id: 1,
    method: 'eth_sendTransaction',
    params: [
      {
        to: contractAddress,
        from: fromAddr,
        data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000002',
        gas: '0x0',
        gasPrice: '0x0',
        value: '0x0'
      }
    ]
  })

  // Transaction receipt in order to obtain the topic of the event NewValueSet
  const ethGetTransactionReceiptResult = await execAndWaitForMillisecondsAsync(
    loomProvider.sendAsync({
      id: 2,
      method: 'eth_getTransactionReceipt',
      params: [ethSendTransactionResult.result]
    })
  )

  return { ethGetTransactionReceiptResult, contractAddress }
}

async function testGetLogsPendingState(
  t: test.Test,
  loomProvider: LoomProvider,
  fromAddr: string
) {
  const newSetTransaction = await newTransactionToSetState(loomProvider, fromAddr)

  // Filtering to get logs
  let ethGetLogs = await loomProvider.sendAsync({
    id: 3,
    method: 'eth_getLogs',
    params: [
      {
        address: newSetTransaction.contractAddress,
        fromBlock: '0x1',
        toBlock: 'pending',
        topics: [newSetTransaction.ethGetTransactionReceiptResult.result.logs[0].topics[0]]
      }
    ]
  })

  t.equal(ethGetLogs.result.length, 1, 'Should return one log for the pending block')
}

async function testGetLogsLatest(t: test.Test, loomProvider: LoomProvider, fromAddr: string) {
  const newSetTransaction = await newTransactionToSetState(loomProvider, fromAddr)

  // Filtering to get logs
  let ethGetLogs = await loomProvider.sendAsync({
    id: 4,
    method: 'eth_getLogs',
    params: [
      {
        address: newSetTransaction.contractAddress,
        fromBlock: '0x1',
        toBlock: 'latest',
        topics: [newSetTransaction.ethGetTransactionReceiptResult.result.logs[0].topics[0]]
      }
    ]
  })

  t.equal(ethGetLogs.result.length, 1, 'Should return one log for the latest block')
}

async function testGetLogsAny(t: test.Test, loomProvider: LoomProvider, fromAddr: string) {
  const curBlock = await (loomProvider as any)._client.getBlockHeightAsync()
  console.log(`current block: ${curBlock}`)
  const fromBlock = numberToHex(parseInt(curBlock, 10) + 1)
  await newTransactionToSetState(loomProvider, fromAddr)

  // Filtering to get logs
  let ethGetLogs = await loomProvider.sendAsync({
    id: 5,
    method: 'eth_getLogs',
    params: [{ fromBlock }]
  })

  t.equal(ethGetLogs.result.length, 1, 'Should return one log for anything filter')
}

async function testGetLogsAnyPending(t: test.Test, loomProvider: LoomProvider, fromAddr: string) {
  const curBlock = await (loomProvider as any)._client.getBlockHeightAsync()
  console.log(`current block: ${curBlock}`)
  const fromBlock = numberToHex(parseInt(curBlock, 10) + 1)
  await newTransactionToSetState(loomProvider, fromAddr)

  // Filtering to get logs
  let ethGetLogs = await loomProvider.sendAsync({
    id: 6,
    method: 'eth_getLogs',
    params: [{ fromBlock, toBlock: 'pending' }]
  })

  t.equal(ethGetLogs.result.length, 1, 'Should return one log for anything pending filter')
}

test('LoomProvider.getEVMLogsAsync', async t => {
  let client
  try {
    const privKey = CryptoUtils.generatePrivateKey()
    client = createTestClient()
    const fromAddr = LocalAddress.fromPublicKey(
      CryptoUtils.publicKeyFromPrivateKey(privKey)
    ).toString()
    const loomProvider = new LoomProvider(client, privKey)

    client.on('error', msg => console.error('Error on client:', msg))

    await testGetLogsPendingState(t, loomProvider, fromAddr)
    await testGetLogsLatest(t, loomProvider, fromAddr)
    await testGetLogsAny(t, loomProvider, fromAddr)
    await testGetLogsAnyPending(t, loomProvider, fromAddr)
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})
