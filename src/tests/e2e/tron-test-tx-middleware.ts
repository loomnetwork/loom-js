import test from 'tape'

import { CachedNonceTxMiddleware, SignedTronTxMiddleware, CryptoUtils, Client } from '../../index'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { Address, LocalAddress } from '../../address'
import { createDefaultTxMiddleware } from '../../helpers'
import { TronWebSigner } from '../../tron-web-signer'
import { createTestHttpClient } from '../helpers'
import { AddressMapper } from '../../contracts'

const Web3 = require('web3')
const TronWeb = require('tronweb')

async function bootstrapTest(
  createClient: () => Client
): Promise<{
  client: Client
  pubKey: Uint8Array
  privKey: Uint8Array
  signer: TronWebSigner
  loomProvider: LoomProvider
  contract: any
  ABI: any[]
  account: Address
}> {
  // Create the client
  const privKey = CryptoUtils.B64ToUint8Array(
    '5IKwJ+M1zSrqF/eJ99OeEWGRQH1ND0GURLu8ukm8yx0QmNQm5rOoPUpBLhiR327Ac3IpLts9+ZKAzdRykkMmwg=='
  )
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.on('error', err => console.error(err))
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const account = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))

  // Create LoomProvider instance
  const loomProvider = new LoomProvider(client, privKey)

  // Contract data and ABI
  const contractData =
    '608060405234801561001057600080fd5b50600a60008190555061014e806100286000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b1146100515780636d4ce63c1461007e575b600080fd5b34801561005d57600080fd5b5061007c600480360381019080803590602001909291905050506100a9565b005b34801561008a57600080fd5b50610093610119565b6040518082815260200191505060405180910390f35b806000819055506000547f7e0b7a35f017ec94e71d7012fe8fa8011f1dab6090674f92de08f8092ab30dda33604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a250565b600080549050905600a165627a7a7230582041f33d6a8b78928e192affcb980ca6bef9b6f5b7da5aa4b2d75b1208720caeeb0029'

  const ABI = [
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
        },
        {
          indexed: false,
          name: 'sender',
          type: 'address'
        }
      ],
      name: 'NewValueSet',
      type: 'event'
    }
  ]

  // Deploy the contract using loom provider
  const result = await deployContract(loomProvider, contractData)

  // Instantiate Contract using web3
  const web3 = new Web3(loomProvider)
  const contract = new web3.eth.Contract(ABI, result.contractAddress, {
    from: LocalAddress.fromPublicKey(pubKey).toString()
  })

  // And get the tron signer
  const fullNode = new TronWeb.providers.HttpProvider('http://127.0.0.1:9090')
  const solidityNode = new TronWeb.providers.HttpProvider('http://127.0.0.1:9090')
  const eventServer = 'http://127.0.0.1:9090'
  const privateKey = '11b5b4c7ff9e69e89e66ef614d8d63a81f2799c3b2bad938a6ae3b0a10a12772'
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey)
  const tronDefaultAddr = tronWeb.defaultAddress.base58
  let trxAddress = tronWeb.address.toHex(tronDefaultAddr)
  let trxAddressHex = '0x' + trxAddress.substring(2, 100)

  const signer = new TronWebSigner(tronWeb, trxAddressHex)

  return { client, pubKey, privKey, signer, loomProvider, contract, ABI, account }
}

test('Test Signed Tron Tx Middleware Type 2', async t => {
  try {
    const { client, signer, pubKey, loomProvider, contract, account } = await bootstrapTest(
      createTestHttpClient
    )

    const addressMapper = await AddressMapper.createAsync(
      client,
      new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
    )

    // Set the mapping
    const trxAddress = await signer.getAddress()
    const from = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
    const to = new Address('tron', LocalAddress.fromHexString(trxAddress))

    // Add mapping if not added yet
    if (!(await addressMapper.hasMappingAsync(from))) {
      await addressMapper.addIdentityMappingAsync(from, to, signer)
    }

    try {
      const addressMapped = await addressMapper.getMappingAsync(from)
      t.assert(addressMapped.from.equals(from), 'Address mapper should map dappchain address')
      t.assert(addressMapped.to.equals(to), 'Address mapper should map tron address')
    } catch (err) {
      t.error(err)
    }

    const callerChainId = 'tron'
    // Override the default caller chain ID
    loomProvider.callerChainId = callerChainId
    // Tron account needs its own middleware
    loomProvider.setMiddlewaresForAddress(to.local.toString(), [
      new CachedNonceTxMiddleware(account, client),
      new SignedTronTxMiddleware(signer)
    ])

    const middlewaresUsed = loomProvider.accountMiddlewares.get(trxAddress.toLowerCase())
    t.assert(
      middlewaresUsed![0] instanceof CachedNonceTxMiddleware,
      'CachedNonceTxMiddleware used'
    )
    t.assert(middlewaresUsed![1] instanceof SignedTronTxMiddleware, 'SignedTronTxMiddleware used')

    let tx = await contract.methods.set(1).send({ from: to.local.toString() })
    t.equal(
      tx.status,
      '0x1',
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
