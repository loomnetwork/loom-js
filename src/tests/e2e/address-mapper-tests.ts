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

  const from = new Address(
    'eth',
    LocalAddress.fromHexString('0xEf90a80506682b2bb7680166694a2d37d9cBf44a')
  )

  const to = new Address('default', LocalAddress.fromPublicKey(pubKey))

  addressMapper.addContractMapping(from, to)

  const s = 'ef4351223a622c91f3056c8de693dc03ecc9e8ab077eb5be5dc26aa62edff32d'
  const result = []

  for (let i = 0; i < s.length; i += 2) {
    result.push(parseInt(s.substring(i, i + 2), 16))
  }

  addressMapper.addIdentityMapping(from, to, Uint8Array.from(result))

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
