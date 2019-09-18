import test from 'tape'

import {
  SignedBinanceTxMiddleware,
  CachedNonceTxMiddleware,
  CryptoUtils,
  Client
} from '../../index'
import { BinanceSigner } from '../../binance-signer'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { Address, LocalAddress } from '../../address'
import { createDefaultTxMiddleware } from '../../helpers'
import { createTestHttpClient } from '../helpers'
import { AddressMapper } from '../../contracts'
import Web3 from 'web3'

// Get JSON truffle artifact
const SimpleStore = require('./truffle-artifacts/SimpleStore.json')

async function bootstrapTest(
  createClient: () => Client
): Promise<{
  client: Client
  pubKey: Uint8Array
  privKey: Uint8Array
  signer: BinanceSigner
  loomProvider: LoomProvider
  contract: any
  ABI: any[]
  account: Address
}> {
  // Create the client
  const privKey = CryptoUtils.B64ToUint8Array(
    '2P+LWAMkX33egniR6BXM1T58qFf+Px7HAMNZ+5fF4C3u1b0IukTungCETO8GeQc4WYpapHJRytojGSE71R217Q=='
  )
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.on('error', err => console.error(err))
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const account = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))

  // Create LoomProvider instance
  const loomProvider = new LoomProvider(client, privKey)

  // Contract data and ABI
  const contractBytecode = SimpleStore.bytecode
  const ABI = SimpleStore.abi

  // Deploy the contract using loom provider
  const result = await deployContract(loomProvider, contractBytecode)

  // Instantiate Contract using web3
  const web3 = new Web3(loomProvider)
  const contract = new web3.eth.Contract(ABI, result.contractAddress, {
    from: LocalAddress.fromPublicKey(pubKey).toString()
  })

  // Instantiate Binance signer
  const privateKey = '276932de6251efb607422ec0860fca05cb0a32f1257d6f8759b24e8371e111c4'
  const signer = new BinanceSigner(privateKey)

  return { client, pubKey, privKey, signer, loomProvider, contract, ABI, account }
}

test('Test Signed Binance Tx Middleware Type 2', async t => {
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
    const to = new Address('binance', LocalAddress.fromHexString(ethAddress))

    // Add mapping if not added yet
    if (!(await addressMapper.hasMappingAsync(from))) {
      try {
        await addressMapper.addBinanceIdentityMappingAsync(from, to, signer)
      } catch (error) {
        console.log('failed to map accounts : ' + error)
      }
    }

    try {
      const addressMapped = await addressMapper.getMappingAsync(from)
      t.assert(addressMapped.from.equals(from), 'Should be mapped the from address')
      t.assert(addressMapped.to.equals(to), 'Should be mapped the to address')
    } catch (err) {
      t.error(err)
    }

    const callerChainId = 'binance'
    // Override the default caller chain ID
    loomProvider.callerChainId = callerChainId
    // Ethereum account needs its own middleware
    loomProvider.setMiddlewaresForAddress(to.local.toString(), [
      new CachedNonceTxMiddleware(account, client),
      new SignedBinanceTxMiddleware(signer)
    ])

    const middlewaresUsed = loomProvider.accountMiddlewares.get(ethAddress.toLowerCase())
    t.assert(
      middlewaresUsed![0] instanceof CachedNonceTxMiddleware,
      'CachedNonceTxMiddleware used'
    )
    t.assert(
      middlewaresUsed![1] instanceof SignedBinanceTxMiddleware,
      'SignedBinanceTxMiddleware used'
    )

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
