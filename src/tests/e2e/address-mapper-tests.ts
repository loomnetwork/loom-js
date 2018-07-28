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

async function getClientAndContract(
  createClient: () => Client
): Promise<{ client: Client; addressMapper: AddressMapper; pubKey: Uint8Array }> {
  const privKey = CryptoUtils.generatePrivateKey()
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const addressMapper = new AddressMapper(client, privKey)
  await addressMapper.loadContract()

  return { client, addressMapper, pubKey }
}

async function testContractCalls(t: test.Test, createClient: () => Client) {
  const { client, addressMapper, pubKey } = await getClientAndContract(createClient)

  const from = new Address(
    'eth',
    LocalAddress.fromHexString('0xEf90a80506682b2bb7680166694a2d37d9cBf44a')
  )

  const to = new Address('default', LocalAddress.fromPublicKey(pubKey))

  addressMapper.addContractMapping(from, to)

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
