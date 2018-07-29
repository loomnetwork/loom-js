import test from 'tape'

import {
  Contract,
  Address,
  LocalAddress,
  Client,
  IChainEventArgs,
  CryptoUtils,
  createDefaultTxMiddleware,
  ClientEvent,
  AddressMapper
} from '../../index'
import { MapEntry } from '../tests_pb'
import {
  createTestClient,
  createTestHttpClient,
  createTestWSClient,
  createTestHttpWSClient
} from '../helpers'

const Web3 = require('web3')

async function getClientAndContract(
  createClient: () => Client
): Promise<{
  client: Client
  addressMapper: AddressMapper
  privKey: Uint8Array
  pubKey: Uint8Array
}> {
  const privKey = CryptoUtils.generatePrivateKey()
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const addressMapper = new AddressMapper(client, privKey)
  await addressMapper.loadContract()

  return { client, addressMapper, pubKey, privKey }
}

async function testContractCalls(t: test.Test, createClient: () => Client) {
  const { client, addressMapper, pubKey } = await getClientAndContract(createClient)

  const ethAddress = '0xEf90a80506682b2bb7680166694a2d37d9cBf44a'
  const from = new Address('eth', LocalAddress.fromHexString(ethAddress))
  const to = new Address('default', LocalAddress.fromPublicKey(pubKey))

  addressMapper.addContractMapping(from, to)

  const web3 = new Web3('http://127.0.0.1:8545')

  addressMapper.addIdentityMapping(from, to, web3, ethAddress)

  client.disconnect()
}

test('Contract', async t => {
  try {
    t.comment('Calls via HTTP')
    await testContractCalls(t, createTestHttpClient)
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
