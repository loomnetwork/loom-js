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
 *
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
 *   function setTwiceEvent(uint _value) public {
 *     value = _value;
 *     emit NewValueSet(_value);
 *     emit NewValueSet(_value + 1);
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
    '608060405234801561001057600080fd5b50600a6000819055506101b6806100286000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063076a66cc1461005c57806360fe47b1146100895780636d4ce63c146100b6575b600080fd5b34801561006857600080fd5b50610087600480360381019080803590602001909291905050506100e1565b005b34801561009557600080fd5b506100b460048036038101908080359060200190929190505050610148565b005b3480156100c257600080fd5b506100cb610181565b6040518082815260200191505060405180910390f35b80600081905550807fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a2600181017fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820dc62f81ecfe4f7410f8580dbb11d9d0af6ac80172a722d579e5a6a5344d742060029'

  const ABI = [
    {
      constant: false,
      inputs: [
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'setTwiceEvent',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_value',
          type: 'uint256'
        }
      ],
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
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: '_value',
          type: 'uint256'
        }
      ],
      name: 'NewValueSet',
      type: 'event'
    }
  ]

  const result = await deployContract(loomProvider, contractData)

  const contract = new web3.eth.Contract(ABI, result.contractAddress, { from })

  return { contract, client, web3, from, privKey }
}

test('LoomProvider + Web3 not matching topic', async t => {
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

test('LoomProvider + Web3 multiple topics', async t => {
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

test('LoomProvider + Eth Sign', async t => {
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

test('LoomProvider get version', async t => {
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

test('LoomProvider getBlockByNumber', async t => {
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

test.only('LoomProvider + Web3 + Dispatch event twice same contract and function', async t => {
  // We're planning to execute 4 asserts
  t.plan(4)

  const { contract, client } = await newContractAndClient()
  try {
    const newValue = 1
    const eventValues = new Array<number>()
    contract.events.NewValueSet({}, (err: Error, event: any) => {
      if (err) t.error(err)
      else {
        // Assert 1
        t.assert(
          +event.returnValues._value >= 1,
          `Value should be returned ${event.returnValues._value}`
        )

        eventValues.push(+event.returnValues._value)
      }
    })

    contract.events.NewValueSet({}, (err: Error, event: any) => {
      if (err) t.error(err)
      else {
        // Assert 2
        t.assert(
          +event.returnValues._value >= 1,
          `Value should be returned ${event.returnValues._value}`
        )

        eventValues.push(+event.returnValues._value)
      }
    })

    const receipt = await contract.methods.setTwiceEvent(newValue).send()

    // Assert 3
    t.equal(receipt.status, '0x1', 'SimpleStore.set should return correct status')

    await waitForMillisecondsAsync(2000)

    const eventSum = eventValues.reduce((acc, currValue) => acc + currValue)

    // Assert 4
    t.equal(eventSum, 3, `Sum of two events should be 3`)
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})
