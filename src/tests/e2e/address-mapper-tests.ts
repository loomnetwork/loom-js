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
import { EthersSigner, getJsonRPCSignerAsync } from '../../solidity-helpers'

async function getClientAndContract(
  createClient: () => Client,
  privateKey: string
): Promise<{
  client: Client
  addressMapper: Contracts.AddressMapper
  pubKey: Uint8Array
}> {
  const privKey = CryptoUtils.B64ToUint8Array(privateKey)
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const addressMapper = await Contracts.AddressMapper.createAsync(
    client,
    new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
  )

  return { client, addressMapper, pubKey }
}

test('Should add identity to mapping', async t => {
  const { client, addressMapper, pubKey } = await getClientAndContract(
    createTestHttpClient,
    'RkNvOsko0nQFrJnXXVbmjGyaVmjQyr+ecJG8qGiF1LisazmV44qDcpsVsYvQZ9jxx7mIWJuZumIzYyLL6FOb4A=='
  )

  try {
    const ethAddress = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const from = new Address('eth', LocalAddress.fromHexString(ethAddress))
    const to = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))

    const ethers = await getJsonRPCSignerAsync('http://localhost:8545', 1)
    const ethersSigner = new EthersSigner(ethers)

    await addressMapper.addIdentityMappingAsync(from, to, ethersSigner)

    const result = await addressMapper.getMappingAsync(from)

    t.assert(from.equals(result.from), 'Identity "from" correctly returned')
    t.assert(to.equals(result.to), 'Identity "to" correctly returned')
  } catch (err) {
    t.error(err)
  }

  client.disconnect()
  t.end()
})

test('Should has mapping identity added correctly', async t => {
  const { client, addressMapper, pubKey } = await getClientAndContract(
    createTestHttpClient,
    '1UgjYgUMZUhGzCfoRxEYFIOJPZQ3y4JjiJ0LdWdvrQO3RySLGno9bhlSWdtqaImycU2wcslcF/7K6GAHGMxe+A=='
  )

  try {
    const ethAddress = '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b'
    const from = new Address('eth', LocalAddress.fromHexString(ethAddress))
    const to = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))

    const ethers = await getJsonRPCSignerAsync('http://localhost:8545', 2)
    const ethersSigner = new EthersSigner(ethers)

    await addressMapper.addIdentityMappingAsync(from, to, ethersSigner)

    const result = await addressMapper.hasMappingAsync(from)

    t.assert(result, 'Mapping has added with success')
  } catch (err) {
    t.error(err)
  }

  client.disconnect()
  t.end()
})

// TODO: Add Binance test
test.skip('Should add Binance identity to mapping', async t => {})
