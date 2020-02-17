import test from 'tape'

import { getEthereumTxHash, createDefaultTxMiddleware } from '../../helpers'
import { CryptoUtils, LocalAddress, LoomProvider, Address } from '../..'
import { createTestClient } from '../helpers'
import { deployContract } from '../evm-helpers'
import { AddressMapper } from '../../contracts'
import { OfflineWeb3Signer } from '../../solidity-helpers'

const Web3 = require('web3')
const EthereumTx = require('ethereumjs-tx')
const TEST_ETH_ADDR = '0x41ef0087901189bB5134De780fC6b3392C7914E6'
const TEST_ETH_PRIVATE_KEY = '0110000101110100011001010111001101110100011010110110010101111001'

function signTransaction(unsignedTx: any) {
  const privateKey = new Buffer(TEST_ETH_PRIVATE_KEY, 'hex')
  const tx = new EthereumTx(unsignedTx)
  tx.sign(privateKey)
  return tx.serialize()
}

async function generateCallTransaction(value: any, contract: any, web3: any) {
  const abiEncodedData = contract.methods.set(value).encodeABI()
  const nonce = await web3.eth.getTransactionCount(TEST_ETH_ADDR)
  return {
    nonce: nonce,
    gasPrice: 0,
    gasLimit: 0,
    to: contract.options.address,
    value: 0,
    data: abiEncodedData
  }
}

async function generateDeployTransaction(web3: any) {
  const contractData =
    '0x608060405234801561001057600080fd5b50600a60008190555061010e806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60d9565b6040518082815260200191505060405180910390f35b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820b76f6c855a1f95260fc70490b16774074225da52ea165a58e95eb7a72a59d1700029'
  const nonce = await web3.eth.getTransactionCount(TEST_ETH_ADDR)

  return {
    nonce: nonce,
    gasPrice: 0,
    gasLimit: 0,
    data: contractData
  }
}

function loadRinkebyAccount(web3: any) {
  const ownerAccount = web3.eth.accounts.privateKeyToAccount('0x' + TEST_ETH_PRIVATE_KEY)
  web3.eth.accounts.wallet.add(ownerAccount)
  return { account: ownerAccount, web3 }
}

async function newContractAndClient() {
  const privKey = CryptoUtils.generatePrivateKey()
  const client = createTestClient()
  const from = LocalAddress.fromPublicKey(CryptoUtils.publicKeyFromPrivateKey(privKey)).toString()
  const web3 = new Web3('http://127.0.0.1:46658/eth')
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  client.on('error', console.log)

  const rinkeby = loadRinkebyAccount(web3)
  const signer = new OfflineWeb3Signer(rinkeby.web3, rinkeby.account)

  try {
    await mapAccounts({
      client,
      signer,
      ownerRinkebyAddress: rinkeby.account,
      ownerExtdevAddress: from
    })
  } catch (error) {
    console.log('account mapping error', error)
  }

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

  const loomProvider = new LoomProvider(client, privKey)
  let result: any
  try {
    result = await deployContract(loomProvider, contractData)
  } catch (err) {
    console.debug(err)
    process.exit(0)
  }
  let contract: any
  try {
    contract = new web3.eth.Contract(ABI, result.contractAddress, { from })
  } catch (err) {
    console.debug(err)
  }
  return { contract, web3, from, privKey, client }
}

async function mapAccounts({ client, signer, ownerRinkebyAddress, ownerExtdevAddress }: any) {
  const ownerRinkebyAddr = Address.fromString(`eth:${ownerRinkebyAddress.address}`)
  const ownerExtdevAddr = Address.fromString(`${client.chainId}:${ownerExtdevAddress}`)
  let mapperContract: AddressMapper
  try {
    mapperContract = await AddressMapper.createAsync(client, ownerExtdevAddr)
  } catch (err) {
    console.debug(err)
  }
  try {
    const mapping = await mapperContract!.getMappingAsync(ownerExtdevAddr)
    console.log(`${mapping.from.toString()} is already mapped to ${mapping.to.toString()}`)
    return
  } catch (err) {
    // assume this means there is no mapping yet, need to fix loom-js not to throw in this case
  }

  console.debug('addIdentityMappingAsync')
  try {
    await mapperContract!.addIdentityMappingAsync(ownerExtdevAddr, ownerRinkebyAddr, signer)
    console.log(`Mapped ${ownerExtdevAddr} to ${ownerRinkebyAddr}`)
  } catch (err) {
    console.debug('addIdentityMappingAsync error', err)
  }
}

test('getEthereumTxHash should generate correct tx hash for EVM call tx', async t => {
  const { contract, web3, client } = await newContractAndClient()
  try {
    const value = '0'
    const unsignedTx = await generateCallTransaction(value, contract, web3)
    const signedTx = signTransaction(unsignedTx)
    const ethTxHash = getEthereumTxHash(signedTx)
    const txSigned = '0x' + signedTx.toString('hex')

    let receipt: any
    try {
      receipt = await web3.eth.sendSignedTransaction(txSigned)
    } catch (err) {
      console.log('send tx error', err)
    }

    t.equal(receipt.transactionHash, ethTxHash, 'tx hash on receipt matches pre-generated hash')
  } catch (err) {
    console.log(err)
    t.error(err, 'Error found')
  }
  if (client) {
    client.disconnect()
  }
  t.end()
})

test('getEthereumTxHash should generate correct tx hash for EVM deploy tx', async t => {
  const { web3, client } = await newContractAndClient()
  try {
    const unsignedTx = await generateDeployTransaction(web3)
    const signedTx = signTransaction(unsignedTx)
    const ethTxHash = getEthereumTxHash(signedTx)
    const txSigned = '0x' + signedTx.toString('hex')

    let receipt: any
    try {
      receipt = await web3.eth.sendSignedTransaction(txSigned)
    } catch (err) {
      console.log('send tx error', err)
    }

    t.equal(receipt.transactionHash, ethTxHash, 'tx hash on receipt matches pre-generated hash')
  } catch (err) {
    console.log(err)
    t.error(err, 'Error found')
  }
  if (client) {
    client.disconnect()
  }
  t.end()
})
