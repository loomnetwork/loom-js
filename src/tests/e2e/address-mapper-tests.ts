import test from 'tape'

import {
  Address,
  LocalAddress,
  Client,
  CryptoUtils,
  createDefaultTxMiddleware,
  Contracts
} from '../../index'
import { createTestHttpClient } from '../helpers'
import { EthersSigner, getJsonRPCSignerAsync } from '../../sign-helpers'
import { ethers, Signer } from 'ethers'

async function getClientAndContract(
  createClient: () => Client
): Promise<{
  client: Client
  addressMapper: Contracts.AddressMapper
  pubKey: Uint8Array
}> {
  const privKey = CryptoUtils.B64ToUint8Array(
    'RkNvOsko0nQFrJnXXVbmjGyaVmjQyr+ecJG8qGiF1LisazmV44qDcpsVsYvQZ9jxx7mIWJuZumIzYyLL6FOb4A=='
  )
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const addressMapper = await Contracts.AddressMapper.createAsync(
    client,
    new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
  )

  return { client, addressMapper, pubKey }
}

async function testAddIdentity(t: test.Test, createClient: () => Client) {
  const { client, addressMapper, pubKey } = await getClientAndContract(createClient)

  const ethAddress = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
  const from = new Address('eth', LocalAddress.fromHexString(ethAddress))
  const to = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))

  const ethers = await getJsonRPCSignerAsync('http://localhost:8545', 1)
  const ethersSigner = new EthersSigner(ethers)

  await addressMapper.addIdentityMappingAsync(from, to, ethersSigner)

  const result = await addressMapper.getMappingAsync(from)

  t.assert(from.equals(result.from), 'Identity "from" correctly returned')
  t.assert(to.equals(result.to), 'Identity "to" correctly returned')

  client.disconnect()
}

test('Address Mapper', async t => {
  try {
    await testAddIdentity(t, createTestHttpClient)
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
