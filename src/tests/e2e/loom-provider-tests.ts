import test from 'tape'

import { LocalAddress, CryptoUtils } from '../../index'
import { createTestClient } from '../helpers'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'

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
    const client = createTestClient()
    const fromAddr = LocalAddress.fromPublicKey(
      CryptoUtils.publicKeyFromPrivateKey(privKey)
    ).toString()
    const loomProvider = new LoomProvider(client, privKey)

    const contractData =
      '0x608060405234801561001057600080fd5b50600a600081905550610118806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60e3565b6040518082815260200191505060405180910390f35b806000819055507fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b6000546040518082815260200191505060405180910390a150565b600080549050905600a165627a7a72305820fabe42649c29e53c4b9fad19100d72a1e825603058e1678432a76f94a10d352a0029'
    const result = await deployContract(loomProvider, contractData)

    const contractAddress = result.contractAddress

    client.on('error', msg => console.error('Error on client:', msg))
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
      'accounts should be available on eth_accounts command'
    )

    const ethNewBlockFilterResult = await loomProvider.sendAsync({
      id,
      method: 'eth_newBlockFilter'
    })

    t.equal(ethNewBlockFilterResult.id, id, `Id for eth_newBlockFilter should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethNewBlockFilterResult.result),
      'Hex identification should be returned on eth_newBlockFilter'
    )

    const ethNewBlockByNumberResult = await loomProvider.sendAsync({
      id,
      method: 'eth_getBlockByNumber'
    })

    t.equal(ethNewBlockFilterResult.id, id, `Id for eth_getBlockByNumber should be equal ${id}`)
    t.assert(
      ethNewBlockByNumberResult.result,
      'Block should be returned from eth_getBlockByNumber'
    )

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
      'Should return filter from eth_getFilterChanges command'
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

    t.equal(ethSendTransactionResult.id, id, `Id for eth_sendTransaction should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethSendTransactionResult.result),
      'Hex identification should be returned for eth_sendTransaction command (contract transaction)'
    )

    const contractDataToDeploy =
      '0x608060405234801561001057600080fd5b50610189806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b1146100515780636d4ce63c14610071575b600080fd5b61006f600480360381019080803590602001909291905050506100cf565b005b34801561007d57600080fd5b5061008661014e565b604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390f35b806000819055507fc403d054f8d8a57caac9df16a22fc80b97825c521da8eea2943d6d04ba3bab806000543334604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a150565b600080600054339150915090915600a165627a7a72305820c6974a05d4e327d57387c8d04a8a5ff056569a4811a69e0de4c15d9ca9135bd70029'

    const ethSendTransactionDeployResult = await loomProvider.sendAsync({
      id,
      method: 'eth_sendTransaction',
      params: [
        {
          from: fromAddr,
          data: contractDataToDeploy,
          gas: '0x0',
          gasPrice: '0x0',
          value: '0x0'
        }
      ]
    })

    t.equal(
      ethSendTransactionDeployResult.id,
      id,
      `Id for eth_sendTransaction should be equal ${id}`
    )
    t.assert(
      /0x.+/.test(ethSendTransactionDeployResult.result),
      'Hex identification should be returned for eth_sendTransaction command (deploy new contract)'
    )

    const ethGetCodeResult = await loomProvider.sendAsync({
      id,
      method: 'eth_getCode',
      params: [contractAddress]
    })

    t.equal(ethGetCodeResult.id, id, `Id for eth_getCode should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethSendTransactionDeployResult.result),
      'Hex identification should be returned for eth_getCode command'
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

    t.deepEqual(
      ethCallResult,
      {
        id,
        jsonrpc: '2.0',
        result: '0x0000000000000000000000000000000000000000000000000000000000000001'
      },
      'Return from eth_call should be 0x0000000000000000000000000000000000000000000000000000000000000001'
    )

    const ethGetTransactionReceiptResult = await loomProvider.sendAsync({
      id,
      method: 'eth_getTransactionReceipt',
      params: [ethSendTransactionResult.result]
    })

    t.equal(
      ethGetTransactionReceiptResult.result.status,
      '0x1',
      'Status for eth_getTransactionReceipt should be 0x1'
    )

    const ethSubscribeResult = await loomProvider.sendAsync({
      id,
      method: 'eth_subscribe',
      params: ['logs', { topics: ['0x1'] }]
    })

    // Until the complete support
    t.deepEqual(
      ethSubscribeResult,
      { id: 1, jsonrpc: '2.0', result: '0x1' },
      'Hex identification for eth_subscribe should be 0x1'
    )

    const ethUninstallFilter = await loomProvider.sendAsync({
      id,
      method: 'eth_uninstallFilter',
      params: ['0x1']
    })

    // Until the complete support
    t.deepEqual(
      ethUninstallFilter,
      { id: 1, jsonrpc: '2.0', result: true },
      'Return from eth_uninstallFilter should be true'
    )

    client.disconnect()
  } catch (err) {
    console.log(err)
  }

  t.end()
})
