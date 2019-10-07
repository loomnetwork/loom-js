import test from 'tape'

import {
  execAndWaitForMillisecondsAsync,
  getTestUrls,
  waitForMillisecondsAsync
} from '../../helpers'
import { deployContract2 } from '../../evm-helpers'
import { LoomProvider2 } from '../../../loom-provider-2'

/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.22;
 *
 * contract SimpleStore {
 *   uint value;
 *
 *   constructor() {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint _value);
 *
 *   function set(uint _value) public {
 *     value = _value;
 *     emit NewValueSet(value);
 *   }
 *
 *   function get() public view returns (uint) {
 *     return value;
 *   }
 * }
 *
 */

const contractData =
  '0x608060405234801561001057600080fd5b50600a600081905550610114806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c14606c575b600080fd5b606a600480360381019080803590602001909291905050506094565b005b348015607757600080fd5b50607e60df565b6040518082815260200191505060405180910390f35b806000819055507f2afa03c814297ffc234ff967b6f0863d3c358be243103f20217c8d3a4d39f9c060005434604051808381526020018281526020019250505060405180910390a150565b600080549050905600a165627a7a72305820deed812a797567167162d0af3ae5f0528c39bea0620e32b28e243628cd655dc40029'

async function newTransactionToSetState(loomProvider: LoomProvider2, fromAddr: string) {
  const contractDeployResult = await deployContract2(loomProvider, contractData)
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

  await waitForMillisecondsAsync(2000)

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
  loomProvider: LoomProvider2,
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

async function testGetLogsLatest(t: test.Test, loomProvider: LoomProvider2, fromAddr: string) {
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

async function testGetLogsAny(t: test.Test, loomProvider: LoomProvider2, fromAddr: string) {
  const curBlock = await loomProvider.sendAsync({
    id: 6,
    method: 'eth_blockNumber',
    params: []
  })

  const fromBlock = curBlock.result
  await newTransactionToSetState(loomProvider, fromAddr)

  // Filtering to get logs
  let ethGetLogs = await loomProvider.sendAsync({
    id: 7,
    method: 'eth_getLogs',
    params: [{ fromBlock }]
  })

  t.equal(ethGetLogs.result.length, 1, ' LoomProvider.getEVMLogsAsync one log for anything filter')
}

async function testGetLogsAnyPending(t: test.Test, loomProvider: LoomProvider2, fromAddr: string) {
  const curBlock = await loomProvider.sendAsync({
    id: 8,
    method: 'eth_blockNumber',
    params: []
  })
  const fromBlock = curBlock.result
  await newTransactionToSetState(loomProvider, fromAddr)

  // Filtering to get logs
  let ethGetLogs = await loomProvider.sendAsync({
    id: 9,
    method: 'eth_getLogs',
    params: [{ fromBlock, toBlock: 'pending' }]
  })

  t.equal(ethGetLogs.result.length, 1, 'Should return one log for anything pending filter')
}

test('LoomProvider.getEVMLogsAsync', async t => {
  let loomProvider
  try {
    const { wsEth } = getTestUrls()
    loomProvider = new LoomProvider2(wsEth)

    const fromAddr = await loomProvider.wallet.getAddress()

    await testGetLogsPendingState(t, loomProvider, fromAddr)
    await testGetLogsLatest(t, loomProvider, fromAddr)
    await testGetLogsAny(t, loomProvider, fromAddr)
    await testGetLogsAnyPending(t, loomProvider, fromAddr)
  } catch (err) {
    t.error(err)
  }

  if (loomProvider) {
    loomProvider.disconnect()
  }

  t.end()
})
