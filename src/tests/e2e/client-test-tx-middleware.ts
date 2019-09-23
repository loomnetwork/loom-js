import test from 'tape'
import BN from 'bn.js'
import { ethers } from 'ethers'

import {
  NonceTxMiddleware,
  CachedNonceTxMiddleware,
  SignedEthTxMiddleware,
  CryptoUtils,
  Client
} from '../../index'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { Address, LocalAddress } from '../../address'
import { createDefaultTxMiddleware } from '../../helpers'
import { EthersSigner, getJsonRPCSignerAsync } from '../../solidity-helpers'
import { createTestHttpClient } from '../helpers'
import { AddressMapper, Coin } from '../../contracts'

const SimpleStore = require('./artifacts/SimpleStore.json')

// import Web3 from 'web3'
const Web3 = require('web3')

const toCoinE18 = (amount: number): BN => {
  return new BN(10).pow(new BN(18)).mul(new BN(amount))
}

async function bootstrapTest(
  createClient: () => Client
): Promise<{
  client: Client
  pubKey: Uint8Array
  privKey: Uint8Array
  signer: ethers.Signer
  loomProvider: LoomProvider
  contract: any
  ABI: any[]
  account: Address
}> {
  // Create the client
  const privKey = CryptoUtils.B64ToUint8Array(
    'D6XCGyCcDZ5TE22h66AlU+Bn6JqL4RnSl4a09RGU9LfM53JFG/T5GAnC0uiuIIiw9Dl0TwEAmdGb+WE0Bochkg=='
  )
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.on('error', err => console.error(err))
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const account = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))

  // Create LoomProvider instance
  const loomProvider = new LoomProvider(client, privKey)

  const ABI = SimpleStore.abi

  // Deploy the contract using loom provider
  const result = await deployContract(loomProvider, SimpleStore.bytecode)

  // Instantiate Contract using web3
  const web3 = new Web3(loomProvider)
  const contract = new web3.eth.Contract(SimpleStore.abi, result.contractAddress, {
    from: LocalAddress.fromPublicKey(pubKey).toString()
  })

  // And get the signer
  const signer = await getJsonRPCSignerAsync('http://localhost:8545')

  return { client, pubKey, privKey, signer, loomProvider, contract, ABI, account }
}

test('Test Signed Eth Tx Middleware Type 1', async t => {
  try {
    const { client, signer, loomProvider, contract } = await bootstrapTest(createTestHttpClient)

    // Get address of the account 0 = 0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1
    const ethAddress = await signer.getAddress()
    const callerChainId = 'eth1'
    // Override the default caller chain ID
    loomProvider.callerChainId = callerChainId
    // Ethereum account needs its own middleware
    loomProvider.setMiddlewaresForAddress(ethAddress, [
      new NonceTxMiddleware(
        new Address(callerChainId, LocalAddress.fromHexString(ethAddress)),
        client
      ),
      new SignedEthTxMiddleware(signer)
    ])

    const middlewaresUsed = loomProvider.accountMiddlewares.get(ethAddress.toLowerCase())
    t.assert(middlewaresUsed![0] instanceof NonceTxMiddleware, 'Nonce2TxMiddleware used')
    t.assert(middlewaresUsed![1] instanceof SignedEthTxMiddleware, 'SignedEthTxMiddleware used')

    let tx = await contract.methods.set(1).send({ from: ethAddress })

    t.equal(
      tx.status,
      true,
      `SimpleStore.set should return correct status for address (to) ${ethAddress}`
    )

    t.equal(
      tx.events.NewValueSet.returnValues.sender,
      ethAddress,
      `Sender should be same sender from eth ${ethAddress}`
    )
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  t.end()
})

test('Test Signed Eth Tx Middleware Type 2', async t => {
  try {
    const { client, signer, pubKey, loomProvider, contract, account } = await bootstrapTest(
      createTestHttpClient
    )

    const addressMapper = await AddressMapper.createAsync(
      client,
      new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
    )

    // Set the mapping
    const ethAddress = await signer.getAddress()
    const from = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
    const to = new Address('eth', LocalAddress.fromHexString(ethAddress))

    // Add mapping if not added yet
    if (!(await addressMapper.hasMappingAsync(from))) {
      const ethersSigner = new EthersSigner(signer)
      await addressMapper.addIdentityMappingAsync(from, to, ethersSigner)
    }

    try {
      const addressMapped = await addressMapper.getMappingAsync(from)
      t.assert(addressMapped.from.equals(from), 'Should be mapped the from address')
      t.assert(addressMapped.to.equals(to), 'Should be mapped the to address')
    } catch (err) {
      t.error(err)
    }

    const callerChainId = 'eth'
    // Override the default caller chain ID
    loomProvider.callerChainId = callerChainId
    // Ethereum account needs its own middleware
    loomProvider.setMiddlewaresForAddress(to.local.toString(), [
      new CachedNonceTxMiddleware(account, client),
      new SignedEthTxMiddleware(signer)
    ])

    const middlewaresUsed = loomProvider.accountMiddlewares.get(ethAddress.toLowerCase())
    t.assert(
      middlewaresUsed![0] instanceof CachedNonceTxMiddleware,
      'CachedNonceTxMiddleware used'
    )
    t.assert(middlewaresUsed![1] instanceof SignedEthTxMiddleware, 'SignedEthTxMiddleware used')

    let tx = await contract.methods.set(1).send({ from: to.local.toString() })
    t.equal(
      tx.status,
      true,
      `SimpleStore.set should return correct status for address (to) ${to.local.toString()}`
    )

    t.equal(
      tx.events.NewValueSet.returnValues.sender.toLowerCase(),
      from.local.toString(),
      `Should be the same sender from loomchain ${from.local.toString()}`
    )
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  t.end()
})

test('Test Signed Eth Tx Middleware Type 2 with Coin Contract', async t => {
  try {
    // Create the client
    const privKey = CryptoUtils.B64ToUint8Array(
      'D6XCGyCcDZ5TE22h66AlU+Bn6JqL4RnSl4a09RGU9LfM53JFG/T5GAnC0uiuIIiw9Dl0TwEAmdGb+WE0Bochkg=='
    )
    const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
    const client = createTestHttpClient()
    client.on('error', err => console.error(err))

    // <---- From this point using loom common middleware until change
    client.txMiddleware = createDefaultTxMiddleware(client, privKey)

    // Create AddressMapper wrapper
    const addressMapper = await AddressMapper.createAsync(
      client,
      new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
    )

    // And get the signer
    const signer = await getJsonRPCSignerAsync('http://localhost:8545')

    // Set the mapping
    const ethAddress = await signer.getAddress()
    const from = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
    const to = new Address('eth', LocalAddress.fromHexString(ethAddress))

    // Add mapping if not added yet
    if (!(await addressMapper.hasMappingAsync(from))) {
      const ethersSigner = new EthersSigner(signer)
      await addressMapper.addIdentityMappingAsync(from, to, ethersSigner)
    }

    // Check if map exists
    try {
      const addressMapped = await addressMapper.getMappingAsync(from)
      t.assert(addressMapped.from.equals(from), 'Should be mapped the from address')
      t.assert(addressMapped.to.equals(to), 'Should be mapped the to address')
    } catch (err) {
      t.error(err)
    }

    // <---- From this point it should call using eth sign

    // Create Coin wrapper
    const coin = await Coin.createAsync(
      client,
      new Address('eth', LocalAddress.fromHexString(ethAddress))
    )

    const spender = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))

    client.txMiddleware = [
      new CachedNonceTxMiddleware(pubKey, client),
      new SignedEthTxMiddleware(signer)
    ]

    // Check approval on coin native contract
    await coin.approveAsync(spender, toCoinE18(1))

    // Using owner and spender as the same just for test
    const allowance = await coin.getAllowanceAsync(spender, spender)
    t.equal(allowance.toString(), '1000000000000000000', 'Allowance should ok')
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  t.end()
})
