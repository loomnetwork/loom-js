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

test('LoomProvider + Web3', async t => {
  t.plan(3)
  try {
    const privKey = CryptoUtils.generatePrivateKey()
    const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
    const client = createTestClient()
    const web3 = new Web3(new LoomProvider(client, privKey))

    const contractAddr = await client.getContractAddressAsync('SimpleStore')
    if (!contractAddr) {
      t.fail('Failed to resolve SimpleStore contract address')
      return
    }

    const ABI = [{ "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "set", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "get", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_value", "type": "uint256" }], "name": "NewValueSet", "type": "event" }]
    const from = LocalAddress.fromPublicKey(pubKey).toString()
    const hexContractAddr = contractAddr.local.toString()
    const contract = new web3.eth.Contract(ABI, hexContractAddr, { from })
    const newValue = 2

    contract.events.NewValueSet({}, (err: Error, event: any) => {
      if (err) t.error(err)
      else {
        t.equal(event.returnValues._value, `${newValue}`, `Should event has _value equal ${newValue}`)
      }
    });

    const tx = await contract.methods.set(newValue).send()
    t.equal(tx.status, true, 'SimpleStore.set should return correct status')

    const resultOfGet = await contract.methods.get().call()
    t.equal(+resultOfGet, newValue, `SimpleStore.get should return correct value`)
    client.disconnect()
  } catch (err) {
    console.log(err)
  }
})
