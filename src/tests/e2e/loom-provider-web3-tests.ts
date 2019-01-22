import test from 'tape'
import BN from 'bn.js'

import { LocalAddress, CryptoUtils } from '../../index'
import { createTestClient, waitForMillisecondsAsync } from '../helpers'

import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { ecrecover, privateToPublic, fromRpcSig } from 'ethereumjs-util'
import { soliditySha3 } from '../../solidity-helpers'
import { bytesToHexAddr } from '../../crypto-utils'

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
 *   constructor() public {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint indexed _value);
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
 *
 */

const newContractAndClient = async () => {
  const privKey = CryptoUtils.generatePrivateKey()
  const client = createTestClient()
  const from = LocalAddress.fromPublicKey(CryptoUtils.publicKeyFromPrivateKey(privKey)).toString()
  const loomProvider = new LoomProvider(client, privKey)
  const web3 = new Web3(loomProvider)

  client.on('error', console.log)

  const contractData =
    '0x608060405234801561001057600080fd5b50600a60008190555061010e806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60d9565b6040518082815260200191505060405180910390f35b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820b76f6c855a1f95260fc70490b16774074225da52ea165a58e95eb7a72a59d1700029'

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
    },
    { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: '_value', type: 'uint256' }],
      name: 'NewValueSet',
      type: 'event'
    }
  ]

  const result = await deployContract(loomProvider, contractData)

  const contract = new web3.eth.Contract(ABI, result.contractAddress, { from })

  return { contract, client, web3, from, privKey }
}

test('LoomProvider + Web3 + Event with not matching topic', async t => {
  t.plan(2)
  const { contract, client } = await newContractAndClient()

  try {
    const newValue = 1

    contract.events.NewValueSet({ filter: { _value: [4, 5] } }, (err: Error, event: any) => {
      console.log(err, event)
      if (err) t.error(err)
      else {
        t.fail('should not been dispatched')
      }
    })

    const tx = await contract.methods.set(newValue).send()
    t.equal(tx.status, '0x1', 'SimpleStore.set should return correct status')

    const resultOfGet = await contract.methods.get().call()
    t.equal(+resultOfGet, newValue, `SimpleStore.get should return correct value`)

    await waitForMillisecondsAsync(1000)
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }
})

test('LoomProvider + Web3 + Multiple event topics', async t => {
  t.plan(3)
  const { contract, client } = await newContractAndClient()
  try {
    const newValue = 1

    contract.events.NewValueSet({ filter: { _value: [1, 2, 3] } }, (err: Error, event: any) => {
      if (err) t.error(err)
      else {
        t.equal(+event.returnValues._value, newValue, `Return value should be ${newValue}`)
      }
    })

    const tx = await contract.methods.set(newValue).send()
    t.equal(tx.status, '0x1', 'SimpleStore.set should return correct status')

    const resultOfGet = await contract.methods.get().call()
    t.equal(+resultOfGet, newValue, `SimpleStore.get should return correct value`)

    await waitForMillisecondsAsync(1000)
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('LoomProvider + Web3 + Eth Sign', async t => {
  const { client, web3, from, privKey } = await newContractAndClient()
  try {
    const msg = '0xff'
    const result = await web3.eth.sign(msg, from)

    // Checking the ecrecover

    const hash = soliditySha3('\x19Ethereum Signed Message:\n32', msg).slice(2)

    const { r, s, v } = fromRpcSig(result)
    const pubKey = ecrecover(Buffer.from(hash, 'hex'), v, r, s)

    const privateHash = soliditySha3(privKey).slice(2)

    t.equal(
      bytesToHexAddr(pubKey),
      bytesToHexAddr(privateToPublic(Buffer.from(privateHash, 'hex'))),
      'Should pubKey from ecrecover be valid'
    )
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('LoomProvider + Web3 + Get version', async t => {
  const { client, web3 } = await newContractAndClient()
  try {
    const chainIdHash = soliditySha3(client.chainId)
      .slice(2)
      .slice(0, 13)
    const netVersionFromChainId = new BN(chainIdHash).toNumber()

    const result = await web3.eth.net.getId()
    t.equal(`${netVersionFromChainId}`, `${result}`, 'Should version match')
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('LoomProvider + Web3 + getBlockByNumber', async t => {
  const { client, web3 } = await newContractAndClient()
  try {
    const blockNumber = await web3.eth.getBlockNumber()
    const blockInfo = await web3.eth.getBlock(blockNumber, false)
    t.equal(parseInt(blockInfo.blockNumber, 16), blockNumber, 'Block number should be equal')
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('LoomProvider + Web3 + getBlockHash', async t => {
  const { client, web3 } = await newContractAndClient()
  try {
    const blockNumber = await web3.eth.getBlockNumber()
    const blockInfo = await web3.eth.getBlock(blockNumber, false)
    const blockInfoByHash = await web3.eth.getBlock(blockInfo.transactionHash, false)
    t.assert(blockInfoByHash, 'Should return block info by hash')
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('LoomProvider + Web3 + getGasPrice', async t => {
  const { client, web3 } = await newContractAndClient()
  try {
    const gasPrice = await web3.eth.getGasPrice()
    t.equal(gasPrice, null, "Gas price isn't used on Loomchain")
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('LoomProvider + Web3 + getBalance', async t => {
  const { client, web3, from } = await newContractAndClient()
  try {
    const balance = await web3.eth.getBalance(from)
    t.equal(balance, '0', 'Default balance is 0')
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('LoomProvider + Web3 + getTransactionReceipt', async t => {
  const { contract, client } = await newContractAndClient()
  try {
    const newValue = 1

    const tx = await contract.methods.set(newValue).send()
    console.log('tx', tx)
    t.assert(tx.events.NewValueSet.blockTime > 0, 'blockTime should be greater than 0')
    t.assert(tx.events.NewValueSet.blockHash > 0, 'blockHash should be greater than 0')
    t.equal(tx.status, '0x1', 'SimpleStore.set should return correct status')

    await waitForMillisecondsAsync(1000)
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('LoomProvider + Web3 + Logs', async t => {
  const { contract, client } = await newContractAndClient()
  try {
    const newValue = 1

    const tx = await contract.methods.set(newValue).send()
    t.equal(tx.status, '0x1', 'SimpleStore.set should return correct status')

    const events = await contract.getPastEvents('NewValueSet')
    console.log('events', events)
    t.assert(events.length > 0, 'Should have more than 0 events')

    await waitForMillisecondsAsync(1000)
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})
