import test from 'tape'

import { LocalAddress, CryptoUtils } from '../../../index'
import { createTestClient, execAndWaitForMillisecondsAsync, getTestUrls } from '../../helpers'
import { LoomProvider } from '../../../loom-provider'
import { deployContract } from '../../evm-helpers'
import { LoomProvider2 } from '../../../loom-provider-2'

/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.18;
 * contract SimpleStore {
 *  function set(uint _value) public {
 *   value = _value;
 *  }
 * function get() public constant returns (uint) {
 *   return value;
 * }
 *  uint value;
 * }
 *
 */

const newContractAndClient = async () => {
  const privKey = CryptoUtils.generatePrivateKey()
  const client = createTestClient()
  const from = LocalAddress.fromPublicKey(CryptoUtils.publicKeyFromPrivateKey(privKey)).toString()
  const loomProvider = new LoomProvider(client, privKey)

  const contractData =
    '608060405234801561001057600080fd5b50600a600081905550610118806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60e3565b6040518082815260200191505060405180910390f35b806000819055507fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b6000546040518082815260200191505060405180910390a150565b600080549050905600a165627a7a72305820fabe42649c29e53c4b9fad19100d72a1e825603058e1678432a76f94a10d352a0029'

  const { contractAddress, transactionHash } = await deployContract(loomProvider, contractData)

  client.on('error', msg => console.error('Error on client:', msg))

  return { privKey, client, contractData, contractAddress, transactionHash, from, loomProvider }
}

test('LoomProvider2 method eth_blockNumber', async t => {
  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)

  try {
    const id = 1
    const ethBlockNumber = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_blockNumber'
      })
    )

    t.equal(ethBlockNumber.id, id, `Id for eth_blockNumber should be equal ${id}`)
    t.assert(ethBlockNumber.result, 'JSON RPC result should be set')
    t.equal(ethBlockNumber.result.indexOf('0x'), 0, 'Block number should be hex-encoded')
  } catch (err) {
    t.error(err, 'Error found')
  }

  loomProvider.disconnect()
  t.end()
})

test('LoomProvider method eth_accounts', async t => {
  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)
  const from = await loomProvider.wallet.getAddress()

  try {
    const id = 1

    const ethAccountsResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_accounts'
      })
    )

    t.deepEqual(
      ethAccountsResult,
      {
        id: 1,
        jsonrpc: '2.0',
        result: [from]
      },
      'accounts should be available on eth_accounts command'
    )
  } catch (err) {
    t.error(err, 'Error found')
  }

  loomProvider.disconnect()
  t.end()
})

test('LoomProvider method eth_getBlockByNumber (0x1)', async t => {
  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)

  try {
    const id = 1
    const ethNewBlockByNumberResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_getBlockByNumber',
        params: ['0x1']
      })
    )

    t.assert(
      ethNewBlockByNumberResult.result,
      'Block should be returned from eth_getBlockByNumber'
    )
  } catch (err) {
    t.error(err, 'Error found')
  }

  loomProvider.disconnect()
  t.end()
})

test('LoomProvider method eth_getBlockByNumber (latest)', async t => {
  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)

  try {
    const id = 1

    const ethNewBlockByNumberResultLatest = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_getBlockByNumber',
        params: ['latest', false]
      })
    )

    t.equal(
      ethNewBlockByNumberResultLatest.id,
      id,
      `Id for eth_getBlockByNumber should be equal ${id}`
    )
    t.assert(
      ethNewBlockByNumberResultLatest.result,
      'Block should be returned from eth_getBlockByNumber'
    )
  } catch (err) {
    t.error(err, 'Error found')
  }

  loomProvider.disconnect()
  t.end()
})

test('LoomProvider method eth_sendTransaction', async t => {
  const { from, contractAddress, client } = await newContractAndClient()

  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)

  try {
    const id = 1

    const ethSendTransactionResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_sendTransaction',
        params: [
          {
            to: contractAddress,
            from,
            data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000001',
            gas: '0x0',
            gasPrice: '0x0',
            value: '0x0'
          }
        ]
      })
    )

    t.equal(ethSendTransactionResult.id, id, `Id for eth_sendTransaction should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethSendTransactionResult.result),
      'Hex identification should be returned for eth_sendTransaction command (contract transaction)'
    )
  } catch (err) {
    t.error(err, 'Error found')
  }

  client.disconnect()
  loomProvider.disconnect()
  t.end()
})

test('LoomProvider method eth_sendTransaction (deploy)', async t => {
  const { from, client } = await newContractAndClient()

  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)

  try {
    const id = 1
    const contractDataToDeploy =
      '0x608060405234801561001057600080fd5b50610189806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b1146100515780636d4ce63c14610071575b600080fd5b61006f600480360381019080803590602001909291905050506100cf565b005b34801561007d57600080fd5b5061008661014e565b604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390f35b806000819055507fc403d054f8d8a57caac9df16a22fc80b97825c521da8eea2943d6d04ba3bab806000543334604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a150565b600080600054339150915090915600a165627a7a72305820c6974a05d4e327d57387c8d04a8a5ff056569a4811a69e0de4c15d9ca9135bd70029'

    const ethSendTransactionDeployResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_sendTransaction',
        params: [
          {
            from,
            data: contractDataToDeploy,
            gas: '0x0',
            gasPrice: '0x0',
            value: '0x0'
          }
        ]
      })
    )

    t.equal(
      ethSendTransactionDeployResult.id,
      id,
      `Id for eth_sendTransaction should be equal ${id}`
    )
    t.assert(
      /0x.+/.test(ethSendTransactionDeployResult.result),
      'Hex identification should be returned for eth_sendTransaction command (deploy new contract)'
    )
  } catch (err) {
    t.error(err, 'Error found')
  }

  client.disconnect()
  loomProvider.disconnect()
  t.end()
})

test('LoomProvider method eth_getCode', async t => {
  const { contractAddress, client } = await newContractAndClient()

  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)

  try {
    const id = 1
    const ethGetCodeResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_getCode',
        params: [contractAddress]
      })
    )

    t.equal(ethGetCodeResult.id, id, `Id for eth_getCode should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethGetCodeResult.result),
      'Hex identification should be returned for eth_getCode command'
    )
  } catch (err) {
    t.error(err, 'Error found')
  }

  client.disconnect()
  loomProvider.disconnect()
  t.end()
})

test('LoomProvider method eth_call', async t => {
  const { from, contractAddress, client } = await newContractAndClient()

  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)

  try {
    const id = 1
    const ethCallResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_call',
        params: [
          {
            to: contractAddress,
            from,
            data: '0x6d4ce63c'
          }
        ]
      })
    )

    t.deepEqual(
      ethCallResult,
      {
        id,
        jsonrpc: '2.0',
        result: '0x000000000000000000000000000000000000000000000000000000000000000a'
      },
      'Return from eth_call should be 0x000000000000000000000000000000000000000000000000000000000000000a'
    )
  } catch (err) {
    t.error(err, 'Error found')
  }

  loomProvider.disconnect()
  client.disconnect()
  t.end()
})

test('LoomProvider method eth_getTransactionReceipt', async t => {
  const { client, contractAddress, from } = await newContractAndClient()

  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)

  try {
    const id = 1

    const ethSendTransactionResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_sendTransaction',
        params: [
          {
            to: contractAddress,
            from,
            data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000001',
            gas: '0x0',
            gasPrice: '0x0',
            value: '0x0'
          }
        ]
      })
    )

    const ethGetTransactionReceiptResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_getTransactionReceipt',
        params: [ethSendTransactionResult.result]
      })
    )

    t.equal(
      ethGetTransactionReceiptResult.result.status,
      '0x1',
      'Status for eth_getTransactionReceipt should be 0x1'
    )
  } catch (err) {
    t.error(err, 'Error found')
  }

  loomProvider.disconnect()
  client.disconnect()
  t.end()
})

test('LoomProvider method eth_getTransactionByHash', async t => {
  const { transactionHash, client } = await newContractAndClient()

  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)

  try {
    const id = 1

    const ethGetTransactionByHashResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_getTransactionByHash',
        params: [transactionHash]
      })
    )

    t.equal(ethGetTransactionByHashResult.id, id, `Id for eth_subscribe should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethGetTransactionByHashResult.result.hash),
      'Hex identification should be returned for eth_getTransactionByHash command'
    )
  } catch (err) {
    t.error(err, 'Error found')
  }

  loomProvider.disconnect()
  client.disconnect()
  t.end()
})

test('LoomProvider method eth_subscribe', async t => {
  const { client } = await newContractAndClient()

  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)

  try {
    const id = 1

    const ethSubscribeResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_subscribe',
        params: ['logs', { topics: ['0x1'] }]
      })
    )

    t.equal(ethSubscribeResult.id, id, `Id for eth_subscribe should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethSubscribeResult.result),
      'Hex identification should be returned for eth_subscribe command'
    )
  } catch (err) {
    t.error(err, 'Error found')
  }

  loomProvider.disconnect()
  client.disconnect()
  t.end()
})

test('LoomProvider method eth_uninstallFilter', async t => {
  const { client } = await newContractAndClient()

  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth)

  try {
    const id = 1
    const ethUninstallFilter = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_uninstallFilter',
        params: ['0x1']
      })
    )

    t.equal(ethUninstallFilter.id, id, `Id for eth_subscribe should be equal ${id}`)
    t.equal(ethUninstallFilter.result, true, 'Uninstall filter should return true')
  } catch (err) {
    t.error(err, 'Error found')
  }

  loomProvider.disconnect()
  client.disconnect()
  t.end()
})
