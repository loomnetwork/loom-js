import test from 'tape'
import BN from 'bn.js'

import { LocalAddress, CryptoUtils } from '../../index'
import { createTestClient, waitForMillisecondsAsync, createWeb3TestClient, rejectOnTimeOut } from '../helpers'

import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { ecrecover, privateToPublic, fromRpcSig } from 'ethereumjs-util'
import { soliditySha3 } from '../../solidity-helpers'
import { bytesToHexAddr } from '../../crypto-utils'

import Web3 from 'web3'
import { AbiItem } from 'web3-utils';
import { ContractSendMethod, Contract } from 'web3-eth-contract'
import { PromiEvent, TransactionReceipt } from "web3-core"
import { Client, ClientEvent } from "../../client"
import { debug } from "console"

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

const newContractAndClient = async (useEthEndpoint: boolean) => {
  const privKey = CryptoUtils.generatePrivateKey()
  const client = useEthEndpoint ? createWeb3TestClient() : createTestClient()
  const from = LocalAddress.fromPublicKey(CryptoUtils.publicKeyFromPrivateKey(privKey)).toString()
  const loomProvider = new LoomProvider(client, privKey)
  const web3 = new Web3(loomProvider)
  web3.eth.transactionConfirmationBlocks = 3
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
  const contract = new web3.eth.Contract(ABI as AbiItem[], result.contractAddress, { from })

  return { contract, client, web3, from, privKey }
}

async function testWeb3MismatchedTopic(t: test.Test, useEthEndpoint: boolean) {
  let contract: Contract, client, from
  const waitMs = 5000
  const newValue = 1
  try {
    ({ contract, client, from } = await newContractAndClient(useEthEndpoint))
    const wrongTopicPromise = new Promise((resolve) =>
      contract.events.NewValueSet({ filter: { _value: [4, 5] } }, resolve)
    )
    const rightTopicPromise = new Promise((resolve) =>
      contract.events.NewValueSet({ filter: { _value: [1, 2] } }, resolve)
    )
    contract.methods.set(newValue).send({ from })
    await Promise.all([
      rejectOnTimeOut(wrongTopicPromise, waitMs)
        .then(() => t.fail("Wrong Topic listener should not be triggered"))
        .catch(() => t.pass("Wrong topic listener not triggered within ms" + waitMs)),
      rejectOnTimeOut(rightTopicPromise, waitMs)
        .then(() => t.pass("Right Topic listener triggered"))
        .catch(() => t.fail("Right Topic listener should have been triggered within mss" + waitMs)),
    ])

  } catch (err) {
    console.error(err)
    t.fail(err)
  } finally {
    if (client) {
      client.disconnect()
    }
    t.end()
  }

}

async function testWeb3MultipleTopics(t: test.Test, useEthEndpoint: boolean) {
  t.timeoutAfter(20000)
  const newValue = 1

  const { contract, client, from } = await newContractAndClient(useEthEndpoint)

  // contract.transactionConfirmationBlocks = 3
  // contract.transactionBlockTimeout = 3
  const assertions = new Promise((resolve, reject) => {
    contract.events.NewValueSet(
      { filter: { _value: [1, 2, 3] } },
      async (err: Error, event: any) => {
        t.error(err, "contract.events.NewValueSet should not fail")
        t.equal(+event.returnValues._value, newValue, `Return value should be ${newValue}`)
        const resultOfGet: any = await contract.methods.get().call()
        t.equal(+resultOfGet, newValue, `SimpleStore.get should return correct value`)
        resolve(true)
      })
  })

  // @ts-ignore
  // tx hash assertion should be removed here maybe... we're testing events
  const txHash = new Promise(async (resolve, rej) => {
    const set: ContractSendMethod = contract.methods.set(newValue)
    set.send({ from })
      .on("transactionHash", (hash: string) => {
        t.pass("contract.methods.set emits transactionHash")
        resolve(hash)
      })
    // // for some reason this is never called
    // // https://github.com/ChainSafe/web3.js/issues/2837#issuecomment-498838831
    // .on("receipt", (hash: TransactionReceipt) => {
    //   t.pass("receipt")
    // })
  })

  await Promise.all([txHash, assertions])
  client.disconnect()

  t.end()

}

async function testWeb3Sign(t: any, useEthEndpoint: boolean) {
  const { client, web3, from, privKey } = await newContractAndClient(useEthEndpoint)
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
}

async function testWeb3NetId(t: any, useEthEndpoint: boolean) {
  const { client, web3 } = await newContractAndClient(useEthEndpoint)
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
}

async function testWeb3BlockNumber(t: any, useEthEndpoint: boolean) {
  const { client, web3 } = await newContractAndClient(useEthEndpoint)
  try {
    const blockNumber = await web3.eth.getBlockNumber()
    t.assert(typeof blockNumber === 'number', 'Block number should be a number')
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
}

async function testWeb3BlockByNumber(t: any, useEthEndpoint: boolean) {
  const { client, web3 } = await newContractAndClient(useEthEndpoint)
  try {
    const blockNumber = await web3.eth.getBlockNumber()
    const blockInfo = await web3.eth.getBlock(blockNumber, false)
    t.equal(blockInfo.number, blockNumber, 'Block number should be equal')
  } catch (err) {
    console.log(err)
  }

  client.disconnect()
  t.end()
}

async function testWeb3BlockByHash(t: test.Test, useEthEndpoint: boolean) {
  t.timeoutAfter(30000)
  const { client, web3 } = await newContractAndClient(useEthEndpoint)
  try {
    const blockNumber = await web3.eth.getBlockNumber()
    const blockInfo = await web3.eth.getBlock(blockNumber, false)
    const blockInfoByHash = await web3.eth.getBlock(blockInfo.hash, false)
    t.assert(blockInfoByHash, 'Should return block info by hash')
  } catch (error) {
    console.error(error)
  }

  client.disconnect()
  t.end()
}

async function testWeb3GasPrice(t: any, useEthEndpoint: boolean) {
  const { client, web3 } = await newContractAndClient(useEthEndpoint)
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
}

async function testWeb3Balance(t: any, useEthEndpoint: boolean) {
  const { client, web3, from } = await newContractAndClient(useEthEndpoint)
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
}

async function testWeb3TransactionReceipt(t: test.Test, useEthEndpoint: boolean) {
  t.timeoutAfter(60000)
  const { contract, client, from, web3 } = await newContractAndClient(useEthEndpoint)
  let error
  try {
    const newValue = 1
    const set = contract.methods.set(newValue) as ContractSendMethod
    const txHash: string = await new Promise<string>((resolve, reject) => {
      set.send({ from })
        .on('transactionHash', resolve)
        .on('error', reject)
    });
    waitForMillisecondsAsync(3000)

    const receipt = await web3.eth.getTransactionReceipt(txHash);
    // TODO: there is no blockTime property in tx.events.NewValueSet, it's a Loom extension that's
    //       not implemented on the /eth endpoint yet, re-enable this when we implement it again
    if (!useEthEndpoint) {
      // @ts-ignore
      t.assert(receipt.logs[0].blockTime > 0, 'blockTime should be greater than 0')
    }
    t.ok(receipt.logs[0].blockHash, 'blockHash should be greater than 0')
    t.equal(receipt.status, true, 'SimpleStore.set should return correct status')

  } catch (err) {
    console.error(err)
    t.error(error, "Unexpected errors")
  }

  client.disconnect()
  t.end()
}

async function testWeb3PastEvents(t: test.Test, useEthEndpoint: boolean) {
  const { contract, client, web3 } = await newContractAndClient(useEthEndpoint)
  let error
  t.plan(useEthEndpoint ? 4 : 3)
  t.timeoutAfter(20000)
  try {
    const newValue = 1

    const blockNum = await web3.eth.getBlockNumber()
    const tx: any = await contract.methods.set(newValue).send()
    t.comment("tx.status is true")
    t.equal(tx.status, true, 'SimpleStore.set should return correct status')

    const events = await contract.getPastEvents('NewValueSet', {
      fromBlock: blockNum
    })
    console.log('events', events)
    t.assert(events.length > 0, 'Should have more than 0 events')
    // TODO: there is no blockTime property on Ethereum events, it's a Loom extension that's
    //       not implemented on the /eth endpoint yet, re-enable this when we implement it again
    if (!useEthEndpoint) {
      // @ts-ignore
      t.assert(events[0].blockTime > 0, 'blockTime should be greater than 0')
    }
    await waitForMillisecondsAsync(1000)
  } catch (err) {
    console.log(err)
    error = err
  }

  client.disconnect()
  t.error(error, "Unexpected error")

}

async function testWeb3GetStorageAt(t: any, useEthEndpoint: boolean) {
  const { client, web3, contract } = await newContractAndClient(useEthEndpoint)
  try {
    const storageValue = await web3.eth.getStorageAt(contract.options.address, 0x0, 'latest')
    t.equal(
      storageValue,
      '0x000000000000000000000000000000000000000000000000000000000000000a',
      'Storage value at 0x0 for contract SimpleStore'
    )
  } catch (err) {
    t.error(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
}

test('LoomProvider + Web3 + Event with not matching topic (/query)', (t: test.Test) =>
  testWeb3MismatchedTopic(t, false))
// test('LoomProvider + Web3 + Event with not matching topic (/eth)', (t: any) =>
//   testWeb3MismatchedTopic(t, true))
test('LoomProvider + Web3 + Multiple event topics (/query)', (t: any) =>
  testWeb3MultipleTopics(t, false))
// test('LoomProvider + Web3 + Multiple event topics (/eth)', (t: any) =>
//   testWeb3MultipleTopics(t, true))
test('LoomProvider + Web3 + Eth Sign (/query)', (t: any) => testWeb3Sign(t, false))
test('LoomProvider + Web3 + Eth Sign (/eth)', (t: any) => testWeb3Sign(t, true))
test('LoomProvider + Web3 + Get version (/query)', (t: any) => testWeb3NetId(t, false))
test('LoomProvider + Web3 + Get version (/eth)', (t: any) => testWeb3NetId(t, true))
test('LoomProvider + Web3 + getBlockNumber (/query)', (t: any) => testWeb3BlockNumber(t, false))
test('LoomProvider + Web3 + getBlockNumber (/eth)', (t: any) => testWeb3BlockNumber(t, true))
test('LoomProvider + Web3 + getBlockByNumber (/query)', (t: any) =>
  testWeb3BlockByNumber(t, false))
test('LoomProvider + Web3 + getBlockByNumber (/eth)', (t: any) => testWeb3BlockByNumber(t, true))
// test('LoomProvider + Web3 + getBlock by hash (/query)', (t: any) => testWeb3BlockByHash(t, false))
test('LoomProvider + Web3 + getBlock by hash (/eth)', (t: any) => testWeb3BlockByHash(t, true))
test('LoomProvider + Web3 + getGasPrice (/query)', (t: any) => testWeb3GasPrice(t, false))
test('LoomProvider + Web3 + getGasPrice (/eth)', (t: any) => testWeb3GasPrice(t, true))
test('LoomProvider + Web3 + getBalance (/query)', (t: any) => testWeb3Balance(t, false))
test('LoomProvider + Web3 + getBalance (/eth)', (t: any) => testWeb3Balance(t, true))
test('LoomProvider + Web3 + getTransactionReceipt (/query)', (t: any) =>
  testWeb3TransactionReceipt(t, false))
test('LoomProvider + Web3 + getTransactionReceipt (/eth)', (t: any) =>
  testWeb3TransactionReceipt(t, true))
test('LoomProvider + Web3 + Logs (/query)', (t: any) => testWeb3PastEvents(t, false))
// test('LoomProvider + Web3 + Logs (/eth)', (t: any) => testWeb3PastEvents(t, true))
test('LoomProvider + Web3 + getStorageAt (/eth)', (t: any) => testWeb3GetStorageAt(t, true))
