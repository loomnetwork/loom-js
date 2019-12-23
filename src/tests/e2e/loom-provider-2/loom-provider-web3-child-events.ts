import test, { Test } from 'tape'

import { LocalAddress, CryptoUtils, Contracts } from '../../../index'
import { createTestClient, getTestUrls, waitForMillisecondsAsync } from '../../helpers'
import { deployContract2 } from '../../evm-helpers'
import { LoomProvider2 } from '../../../loom-provider-2'
import { Address } from '../../../address'
import { getJsonRPCSignerAsync, EthersSigner } from '../../../solidity-helpers'
import { createDefaultTxMiddleware } from '../../../helpers'
import Web3 from 'web3'

/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity 0.4.24;
 *
 * interface ContractB {
 *   function callEvent(uint256 v) external;
 * }
 *
 * contract ContractA {
 *   event ContractAEvent(uint256 v);
 *
 *   function doEmit(uint256 _v, address _contractBAddr) public {
 *     emit ContractAEvent(_v);
 *     ContractB(_contractBAddr).callEvent(_v);
 *   }
 * }
 *
 * pragma solidity 0.4.24;
 *
 * contract ContractB {
 *   event ContractBEvent(uint256 v);
 *
 *   function callEvent(uint256 _v) public {
 *     emit ContractBEvent(_v);
 *   }
 * }
 *
 */

function contractABIAndBinary() {
  const contractBData =
    '0x6080604052348015600f57600080fd5b5060db8061001e6000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063f88d0dfc146044575b600080fd5b348015604f57600080fd5b50606c60048036038101908080359060200190929190505050606e565b005b806000819055507f8611c0f1e10aa104c81817ff1befe6e3677acee7991f16f99a8c375ca0793120816040518082815260200191505060405180910390a1505600a165627a7a723058203819249ad266695de9c923df5f4b3d2b244d3f6ba4297db60b92c4955bec2c230029'

  const contractAData =
    '0x608060405234801561001057600080fd5b50610181806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063a045846314610046575b600080fd5b34801561005257600080fd5b5061009160048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610093565b005b7fbb6ecd3f0ef42d655786d77b262f49bee128d78f171832c1ea73b1383674c23a826040518082815260200191505060405180910390a18073ffffffffffffffffffffffffffffffffffffffff1663f88d0dfc836040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561013957600080fd5b505af115801561014d573d6000803e3d6000fd5b5050505050505600a165627a7a72305820101762f1d82f0bc7e12cf1b12098f2dfda892ad477dfd98760c2efab436ae3600029'

  const ABIContractB = [
    {
      constant: false,
      inputs: [{ name: '_v', type: 'uint256' }],
      name: 'callEvent',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'v', type: 'uint256' }],
      name: 'ContractBEvent',
      type: 'event'
    }
  ]

  const ABIContractA = [
    {
      constant: false,
      inputs: [{ name: '_v', type: 'uint256' }, { name: '_contractBAddr', type: 'address' }],
      name: 'doEmit',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'v', type: 'uint256' }],
      name: 'ContractAEvent',
      type: 'event'
    }
  ]

  return { contractBData, contractAData, ABIContractB, ABIContractA }
}

const bootstrapLoomProviderTest = async () => {
  const privKey = CryptoUtils.generatePrivateKey()
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createTestClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  client.on('error', msg => console.error('Error on client:', msg))

  const addressMapper = await Contracts.AddressMapper.createAsync(
    client,
    new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
  )

  const ethAddress = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
  const ecdsaKey = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
  const ethFrom = new Address('eth', LocalAddress.fromHexString(ethAddress))
  const to = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))

  const ethers = await getJsonRPCSignerAsync('http://localhost:8545', 0)
  const ethersSigner = new EthersSigner(ethers)

  if (!(await addressMapper.hasMappingAsync(ethFrom))) {
    await addressMapper.addIdentityMappingAsync(ethFrom, to, ethersSigner)
  }

  client.disconnect()

  const { wsEth } = getTestUrls()
  const loomProvider = new LoomProvider2(wsEth, ecdsaKey)
  const from = await loomProvider.wallet.getAddress()

  return {
    from,
    loomProvider
  }
}

async function testContracts(t: Test, contractB: any, contractA: any) {
  try {
    const value = 5

    contractA.events.ContractAEvent({}, (_err: Error, event: any) => {
      t.equal(event.returnValues.v, '5', 'Value returned should be 5')
    })

    contractB.events.ContractBEvent({}, (_err: Error, event: any) => {
      t.equal(event.returnValues.v, '5', 'Value returned should be 5')
    })

    let tx = await contractA.methods.doEmit(value, contractB.options.address).send()
    t.equal(
      tx.status === true ? true : tx.status,
      true,
      `doEmit should return correct status for ${value}`
    )

    await waitForMillisecondsAsync(1000)
  } catch (err) {
    t.error(err)
  }
}

async function deployContractGanache(web3Provider: any, contractData: string) {
  const web3 = new Web3(web3Provider)
  const fromAddr = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'

  const ethSendTransactionDeployResult = await web3.eth.sendTransaction({
    from: fromAddr,
    data: contractData,
    gas: '300000',
    gasPrice: '0x1'
  })

  if (!ethSendTransactionDeployResult.status) {
    throw Error('Cant deploy contract on ganache')
  }

  const ethGetTransactionReceiptResult = await web3.eth.getTransactionReceipt(
    ethSendTransactionDeployResult.transactionHash
  )

  return ethGetTransactionReceiptResult
}

async function testGanache(t: Test) {
  const from = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'

  const websocketProvider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545')
  const web3 = new Web3(websocketProvider)

  const { contractBData, contractAData, ABIContractB, ABIContractA } = contractABIAndBinary()

  const resultB = await deployContractGanache(websocketProvider, contractBData)
  const resultA = await deployContractGanache(websocketProvider, contractAData)

  const contractB = new web3.eth.Contract(ABIContractB, resultB.contractAddress, { from })
  const contractA = new web3.eth.Contract(ABIContractA, resultA.contractAddress, { from })

  t.comment('Testing Ganache')
  await testContracts(t, contractB, contractA)

  // @ts-ignore
  web3.currentProvider.connection.close()
}

async function testLoomProvider(t: Test) {
  const { loomProvider, from } = await bootstrapLoomProviderTest()
  const web3 = new Web3(loomProvider)

  const { contractBData, contractAData, ABIContractB, ABIContractA } = contractABIAndBinary()

  const resultB = await deployContract2(loomProvider, contractBData)
  const resultA = await deployContract2(loomProvider, contractAData)

  const contractB = new web3.eth.Contract(ABIContractB, resultB.contractAddress, { from })
  const contractA = new web3.eth.Contract(ABIContractA, resultA.contractAddress, { from })

  t.comment('Testing Loom Provider')
  await testContracts(t, contractB, contractA)

  loomProvider.disconnect()
}

test('LoomProvider + Web3 + Child contracts events', async t => {
  t.plan(6)
  await testGanache(t)
  await testLoomProvider(t)
  t.end()
})
