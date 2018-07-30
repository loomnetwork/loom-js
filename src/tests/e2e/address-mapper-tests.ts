import test from 'tape'

import {
  Address,
  LocalAddress,
  Client,
  CryptoUtils,
  createDefaultTxMiddleware,
  AddressMapper
} from '../../index'
import { createTestHttpClient } from '../helpers'
import { Web3Signer } from '../../plasma-cash/solidity-helpers'

const Web3 = require('web3')

// TODO: Need a factory to create connection properly likes plasma-cash test
function getWeb3Connection() {
  return new Web3('http://127.0.0.1:8545')
}

async function getClientAndContract(
  createClient: () => Client
): Promise<{
  client: Client
  addressMapper: AddressMapper
  pubKey: Uint8Array
}> {
  const privKey = CryptoUtils.generatePrivateKey()
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const addressMapper = await AddressMapper.createAsync(
    client,
    new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
  )

  return { client, addressMapper, pubKey }
}

async function testAddMapping(t: test.Test, createClient: () => Client) {
  const { client, addressMapper, pubKey } = await getClientAndContract(createClient)

  const ethAddress = '0xEf90a80506682b2bb7680166694a2d37d9cBf44a'
  const from = new Address('eth', LocalAddress.fromHexString(ethAddress))
  const to = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))

  await addressMapper.addContractMappingAsync(from, to)

  const result = await addressMapper.getContractMappingAsync(from)

  t.assert(from.equals(result.from), 'Mapping "from" correctly returned')
  t.assert(to.equals(result.to), 'Mapping "to" correctly returned')

  client.disconnect()
}

async function testAddIdentity(t: test.Test, createClient: () => Client) {
  const { client, addressMapper, pubKey } = await getClientAndContract(createClient)

  const ethAddress = '0x80a4B6Da5143a59C538FBBb794Be260382B38F58'
  const from = new Address('eth', LocalAddress.fromHexString(ethAddress))
  const to = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))

  const web3 = getWeb3Connection()
  const web3Signer = new Web3Signer(web3, ethAddress)

  await addressMapper.addIdentityMappingAsync(from, to, web3Signer)

  const result = await addressMapper.getContractMappingAsync(from)

  t.assert(from.equals(result.from), 'Identity "from" correctly returned')
  t.assert(to.equals(result.to), 'Identity "to" correctly returned')

  client.disconnect()
}

test('Contract', async t => {
  try {
    t.comment('Calls via HTTP')
    await testAddMapping(t, createTestHttpClient)
    await testAddIdentity(t, createTestHttpClient)
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
