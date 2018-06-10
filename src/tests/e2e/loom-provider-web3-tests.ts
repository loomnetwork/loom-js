import test from 'tape'

import { LocalAddress, CryptoUtils } from '../../index'
import { createTestClient } from '../helpers'

import { LoomProvider } from '../../loom-provider'

// import Web3 from 'web3'
const Web3 = require('web3')

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

test('LoomProvider + Web3', async t => {
  try {
    const privKey = CryptoUtils.generatePrivateKey()
    const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
    const client = createTestClient()
    const web3 = new Web3(new LoomProvider(client, privKey))

    const contractAddr = await client.getContractAddressAsync('SimpleStore')
    if (!contractAddr) {
      t.fail('Failed to resolve contract address')
      return
    }

    const ABI = [
      {
        constant: false,
        inputs: [{ name: '_value', type: 'uint256' }],
        name: 'set',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'get',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      }
    ]
    const from = LocalAddress.fromPublicKey(pubKey).toString()
    const hexContractAddr = CryptoUtils.bytesToHexAddr(contractAddr.local.bytes)
    const contract = new web3.eth.Contract(ABI, hexContractAddr, { from })

    const newValue = 1

    const tx = await contract.methods.set(newValue).send()
    t.equal(tx.status, true, 'Should the status returned from set function equal to true')

    const resultOfGet = await contract.methods.get().call()
    t.equal(
      +resultOfGet,
      newValue,
      `Should the value returned from get function equal to ${newValue}`
    )

    client.disconnect()
  } catch (err) {
    console.log(err)
  } finally {
    t.end()
  }
})
