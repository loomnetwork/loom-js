import test from 'tape'
import BN from 'bn.js'

import { ethers } from "ethers"
import { ecrecover, privateToPublic, fromRpcSig } from 'ethereumjs-util'

import { LocalAddress, CryptoUtils } from '../../index'

import { LoomProvider } from '../../loom-provider'
import { soliditySha3 } from '../../solidity-helpers'
import { bytesToHexAddr } from '../../crypto-utils'

import { deployContract } from '../evm-helpers'
import { createTestClient, rejectOnTimeOut, createWeb3TestClient } from '../helpers'
import { SimpleStore } from './test-contract/SimpleStore'


test("LoomProvider/Ethers Eth Sign (/query)", (t) => testEthersSign(t, false))
test("LoomProvider/Ethers Eth Sign (/eth)", (t) => testEthersSign(t, true))

test('LoomProvider/Ethers Get version (/query)', (t: any) => testNetId(t, false))
test('LoomProvider/Ethers Get version (/eth)', (t: any) => testNetId(t, true))

test('LoomProvider/Ethers getBlockNumber (/query)', (t: any) => testBlockNumber(t, false))
test('LoomProvider/Ethers getBlockNumber (/eth)', (t: any) => testBlockNumber(t, true))

// /query getBlockByNumber fails: invalid hash (arg="hash", value=undefined, version=4.0.26)
test.skip('LoomProvider/Ethers getBlockByNumber (/query)', (t) => testBlockByNumber(t, false))
test('LoomProvider/Ethers getBlockByNumber (/eth)', (t) => testBlockByNumber(t, true))

// /query getBlockByNumber fails: invalid hash (arg="hash", value=undefined, version=4.0.26)
test.skip('LoomProvider/Ethers getBlock by hash (/query)', (t) => testBlockByHash(t, false))
test('LoomProvider/Ethers getBlock by hash (/eth)', (t) => testBlockByHash(t, true))

// Fails : LoomProvider returns null, ethers expects number
test.skip('LoomProvider/Ethers getGasPrice (/query)', (t) => testGasPrice(t, false))
test.skip('LoomProvider/Ethers getGasPrice (/eth)', (t) => testGasPrice(t, true))

test('LoomProvider/Ethers getBalance (/query)', (t) => testBalance(t, false))
test('LoomProvider/Ethers getBalance (/eth)', (t) => testBalance(t, true))


test('LoomProvider/Ethers getTransactionReceipt (/query)', (t) => testTransactionReceipt(t, false))
test('LoomProvider/Ethers getTransactionReceipt (/eth)', (t) => testTransactionReceipt(t, true))

test.skip('LoomProvider/Ethers Logs (/query)', (t) => testPastEvents(t, false))
test('LoomProvider/Ethers Logs (/eth)', (t: any) => testPastEvents(t, true))

test('LoomProvider/Ethers getStorageAt (/eth)', (t: any) => testGetStorageAt(t, true))

test.skip("LoomProvider/Ethers Event topics (/query)", (t) => testMismatchedTopic(t, true))
test.skip("LoomProvider/Ethers Event topics (/eth)", (t) => testMismatchedTopic(t, true))



async function testEthersSign(t: test.Test, useEthEndpoint: boolean) {
  const { client, ethersProvider, from, privKey } = await newContractAndClient(useEthEndpoint)
  try {
    const msg = '0xff'
    const result = await ethersProvider.getSigner().signMessage(ethers.utils.arrayify(msg))

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
    t.error(err)
  }
  client.disconnect()
  t.end()
}


async function testNetId(t: any, useEthEndpoint: boolean) {
  const { client, ethersProvider } = await newContractAndClient(useEthEndpoint)
  try {
    const chainIdHash = soliditySha3(client.chainId)
      .slice(2)
      .slice(0, 13)
    const netVersionFromChainId = new BN(chainIdHash).toNumber()

    const result = await ethersProvider.getNetwork()
    t.equal(`${netVersionFromChainId}`, `${result.chainId}`, 'Should version match')
  } catch (err) {
    t.error(err)
  }
  client.disconnect()
  t.end()
}

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
  const ethersProvider = new ethers.providers.Web3Provider(loomProvider);
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
  const contract = new ethers.Contract(result.contractAddress, ABI, ethersProvider.getSigner()) as SimpleStore

  return { contract, client, ethersProvider, from, privKey }
}



async function testBlockNumber(t: any, useEthEndpoint: boolean) {
  const { client, ethersProvider } = await newContractAndClient(useEthEndpoint)
  try {
    const blockNumber = await ethersProvider.getBlockNumber()
    t.assert(typeof blockNumber === 'number', 'Block number should be a number')

  } catch (err) {
    t.error(err)
  }
  client.disconnect()
  t.end()
}


async function testBlockByNumber(t: any, useEthEndpoint: boolean) {
  const { client, ethersProvider } = await newContractAndClient(useEthEndpoint)
  try {
    const blockNumber = await ethersProvider.getBlockNumber()
    const blockInfo = await ethersProvider.getBlock(blockNumber, false)
    t.equal(blockInfo.number, blockNumber, 'Block number should be equal')
  } catch (err) {
    t.error(err)
  }
  client.disconnect()
  t.end()
}


async function testBlockByHash(t: test.Test, useEthEndpoint: boolean) {
  const { client, ethersProvider } = await newContractAndClient(useEthEndpoint)
  try {
    const blockNumber = await ethersProvider.getBlockNumber()
    const blockInfo = await ethersProvider.getBlock(blockNumber, false)
    const blockInfoByHash = await ethersProvider.getBlock(blockInfo.hash, false)
    t.assert(blockInfoByHash, 'Should return block info by hash')
  } catch (error) {
    console.error(error)
  }

  client.disconnect()
  t.end()
}

async function testGasPrice(t: test.Test, useEthEndpoint: boolean) {
  const { client, ethersProvider } = await newContractAndClient(useEthEndpoint)
  try {
    const gasPrice = await ethersProvider.getGasPrice()
    t.equal(gasPrice, null, "Gas price isn't used on Loomchain")
  } catch (err) {
    t.error(err)
  }

  client.disconnect()
  t.end()
}


async function testBalance(t: test.Test, useEthEndpoint: boolean) {
  const { client, ethersProvider, from } = await newContractAndClient(useEthEndpoint)
  try {
    const balance = await ethersProvider.getBalance(from)
    t.equal(balance.toNumber(), 0, 'Default balance is 0')
  } catch (err) {
    t.error(err)
  }
  client.disconnect()
  t.end()
}

async function testTransactionReceipt(t: test.Test, useEthEndpoint: boolean) {
  t.timeoutAfter(30000)
  const { contract, client, from, ethersProvider } = await newContractAndClient(useEthEndpoint)
  try {
    const newValue = 1
    const tx = await contract.set(newValue, { gasLimit: 0 })
    const contractReceipt = await tx.wait()
    t.ok(contractReceipt.transactionHash, "Contract receipt has transactionHash")

    const receipt = await ethersProvider.getTransactionReceipt(contractReceipt.transactionHash!);
    // TODO: there is no blockTime property in tx.events.NewValueSet, it's a Loom extension that's
    //       not implemented on the /eth endpoint yet, re-enable this when we implement it again
    // if (!useEthEndpoint) {
    //   t.assert(receipt.logs[0].blockTime > 0, 'blockTime should be greater than 0')
    // }
    t.ok(receipt.blockHash, 'blockHash should be greater than 0')
    t.equal(receipt.status, 1, 'SimpleStore.set should return correct status')

  } catch (err) {
    t.error(err, "Unexpected errors")
  }

  client.disconnect()
  t.end()
}


async function testPastEvents(t: test.Test, useEthEndpoint: boolean) {
  const { contract, client, ethersProvider } = await newContractAndClient(useEthEndpoint)
  t.timeoutAfter(20000)
  try {
    const newValue = 1

    const blockNum = await ethersProvider.getBlockNumber()
    const tx = await contract.set(newValue, { gasLimit: 0 })
    const receipt = await tx.wait()
    t.equal(receipt.status, 1, 'SimpleStore.set should return correct receipt.status')

    const events = await ethersProvider.getLogs({
      fromBlock: blockNum,
      toBlock: "latest",
      address: contract.address
    })
    t.assert(events.length > 0, 'Should have more than 0 events')

  } catch (err) {
    t.error(err, "Unexpected error")
  }

  client.disconnect()
  t.end()
}


async function testGetStorageAt(t: any, useEthEndpoint: boolean) {
  const { client, ethersProvider, contract } = await newContractAndClient(useEthEndpoint)
  try {
    const storageValue = await ethersProvider.getStorageAt(contract.address, 0x0, 'latest')
    t.equal(
      storageValue,
      '0x000000000000000000000000000000000000000000000000000000000000000a',
      'Storage value at 0x0 for contract SimpleStore'
    )
  } catch (err) {
    t.error(err)
  }
  client.disconnect()
  t.end()
}



async function testMismatchedTopic(t: test.Test, useEthEndpoint: boolean) {
  const waitMs = 10000
  let { contract, client, from, ethersProvider } = await newContractAndClient(useEthEndpoint)

  const onTopicValues = [1]
  const offTopicValues = [2]
  try {
    contract = await contract.connect(ethersProvider.getSigner())
    var address = '0x1234567890123456789012345678901234567890'
    var topicAddress = '0x000000000000000000000000' + address.substring(2);
    const topics = [
      ethers.utils.id("NewValueSet(uint256)"),
    ]
    const f = {
      address: contract.address,
      topics
    }
    // ethersProvider.on(f, console.log)

    const SetFilter = contract.filters.NewValueSet
    const onTopicPromises = onTopicValues.map(v =>
      rejectOnTimeOut(new Promise((resolve) => contract.on(contract.filters.NewValueSet(null), resolve)), waitMs)
    )
    const offTopicPromises = offTopicValues.map(v =>
      rejectOnTimeOut(new Promise((resolve) => contract.on(SetFilter(v), resolve)), waitMs)
    )
    const shouldTrigger = onTopicPromises.map(
      promise => promise
        .then(() => true)
        .catch(() => false)
        .then(called => t.true(called, "On topic listener should be called"))
    )
    const shouldNotTrigger = offTopicPromises.map(
      promise => promise
        .then(() => true)
        .catch(() => false)
        .then(called => t.false(called, "Off topic  listener should not be called"))
    )
    contract.addListener(contract.filters.NewValueSet(1), console.log)

    for (const v of onTopicValues) {
      await contract.set(v, { gasLimit: 10000 })
    }

    await Promise.all(shouldTrigger)
    await Promise.all(shouldNotTrigger)
    console.log("done")
  } catch (err) {
    console.error(err)
    t.fail(err)
  }
  if (client) {
    client.disconnect()
  }
  t.end()

}

