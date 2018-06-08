import test from 'tape'

import { LocalAddress, CryptoUtils } from '../../index'
import { createTestClient } from '../helpers'
import { promisify } from 'util'

import { LoomProvider } from '../../loom-provider'

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

test('LoomProvider', async t => {
  try {
    const privKey = CryptoUtils.generatePrivateKey()
    const fromAddr = LocalAddress.fromPublicKey(
      CryptoUtils.publicKeyFromPrivateKey(privKey)
    ).toString()
    const client = createTestClient()
    const loomContractAddress = await client.getContractAddressAsync('SimpleStore')

    if (!loomContractAddress) {
      return t.fail('Contract address cannot be null')
    }

    const contractAddress = CryptoUtils.bytesToHexAddr(loomContractAddress.local.bytes)

    client.on('error', msg => console.error('Error on client:', msg))

    const loomProvider = new LoomProvider(client, privKey)
    loomProvider.send = promisify(loomProvider.send)
    const id = 1

    const netVersionResult = await loomProvider.sendAsync({
      id,
      method: 'net_version'
    })

    t.deepEqual(
      netVersionResult,
      { id: 1, jsonrpc: '2.0', result: '474747' },
      'net_version should be 474747'
    )

    const ethAccountsResult = await loomProvider.sendAsync({
      id,
      method: 'eth_accounts'
    })

    t.deepEqual(
      ethAccountsResult,
      {
        id: 1,
        jsonrpc: '2.0',
        result: [fromAddr]
      },
      'Accounts should be available'
    )

    const ethNewBlockFilterResult = await loomProvider.sendAsync({
      id,
      method: 'eth_newBlockFilter'
    })

    t.equal(ethNewBlockFilterResult.id, id, `Id Should be equal ${id}`)
    t.assert(/0x.+/.test(ethNewBlockFilterResult.result), 'Hex identification should be returned')

    const ethNewBlockByNumberResult = await loomProvider.sendAsync({
      id,
      method: 'eth_getBlockByNumber'
    })

    t.equal(ethNewBlockFilterResult.id, id, `Id Should be equal ${id}`)
    t.assert(ethNewBlockByNumberResult.result, 'Block should be returned')

    const ethGetFilterChangesResults = await loomProvider.sendAsync({
      id,
      method: 'eth_getFilterChanges'
    })

    t.deepEqual(
      ethGetFilterChangesResults,
      [
        {
          id: 1,
          jsonrpc: '2.0',
          result: ['0x0000000000000000000000000000000000000000000000000000000000000001']
        }
      ],
      'Should return filter'
    )

    const ethSendTransactionResult = await loomProvider.sendAsync({
      id,
      method: 'eth_sendTransaction',
      params: [
        {
          to: contractAddress,
          from: fromAddr,
          data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000001',
          gas: '0x0',
          gasPrice: '0x0',
          value: '0x0'
        }
      ]
    })

    t.equal(ethSendTransactionResult.id, id, `Id Should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethSendTransactionResult.result),
      'Hex identification should be returned for transaction'
    )

    const contractData =
      '0x608060405234801561001057600080fd5b50610189806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b1146100515780636d4ce63c14610071575b600080fd5b61006f600480360381019080803590602001909291905050506100cf565b005b34801561007d57600080fd5b5061008661014e565b604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390f35b806000819055507fc403d054f8d8a57caac9df16a22fc80b97825c521da8eea2943d6d04ba3bab806000543334604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a150565b600080600054339150915090915600a165627a7a72305820c6974a05d4e327d57387c8d04a8a5ff056569a4811a69e0de4c15d9ca9135bd70029'

    const ethSendTransactionDeployResult = await loomProvider.sendAsync({
      id,
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

    t.equal(ethSendTransactionDeployResult.id, id, `Id Should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethSendTransactionDeployResult.result),
      'Hex identification should be returned for deploy transaction'
    )

    const ethGetCodeResult = await loomProvider.sendAsync({
      id,
      method: 'eth_getCode',
      params: [contractAddress]
    })

    t.equal(ethGetCodeResult.id, id, `Id Should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethSendTransactionDeployResult.result),
      'Hex identification should be returned for get code'
    )

    const ethCallResult = await loomProvider.sendAsync({
      id,
      method: 'eth_call',
      params: [
        {
          to: contractAddress,
          from: fromAddr,
          data: '0x6d4ce63c'
        }
      ]
    })

    t.deepEqual(ethCallResult, {
      id,
      jsonrpc: '2.0',
      result: '0x0000000000000000000000000000000000000000000000000000000000000001'
    })

    const ethGetTransactionReceiptResult = await loomProvider.sendAsync({
      id,
      method: 'eth_getTransactionReceipt',
      params: [ethSendTransactionResult.result]
    })

    t.equal(ethGetTransactionReceiptResult.result.status, '0x1')

    const ethSubscribeResult = await loomProvider.sendAsync({
      id,
      method: 'eth_subscribe',
      params: ['logs', { topics: ['0x1'] }]
    })

    t.deepEqual(ethSubscribeResult, { id: 1, jsonrpc: '2.0', result: '0x1' })

    const ethUninstallFilter = await loomProvider.sendAsync({
      id,
      method: 'eth_uninstallFilter',
      params: ['0x1']
    })

    t.deepEqual(ethUninstallFilter, { id: 1, jsonrpc: '2.0', result: true })

    const ethGetLogs = await loomProvider.sendAsync({
      id,
      method: 'eth_getLogs'
    })

    t.deepEqual(ethGetLogs, { id: 1, jsonrpc: '2.0', result: [] })

    client.disconnect()
  } catch (err) {
    console.log(err)
  }

  t.end()
})
