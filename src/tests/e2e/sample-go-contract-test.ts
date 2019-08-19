import test from 'tape'
import {
  Address,
  Contracts,
  CryptoUtils,
  createDefaultTxMiddleware,
  Client,
  LocalAddress
} from '../../index'
import { createTestHttpClient } from '../helpers'
import { B64ToUint8Array } from '../../crypto-utils'
import { LoomProvider } from '../../loom-provider'

async function getClientAndContract(
  createClient: () => Client,
  privKey: Uint8Array
): Promise<{
  client: Client
  sampleGoContract: Contracts.SampleGoContract
}> {
  const acct1PubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const sampleGoContract = await Contracts.SampleGoContract.createAsync(
    client,
    new Address(client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  )
  return { client: client, sampleGoContract: sampleGoContract, }
}

test('SampleGoContract', async t => {
  try {
    const privKey = B64ToUint8Array(
      'Hz9P3aHH62mO75A6uMVW3mn0U1KkZSq3t03jfOZfyZxjyJoJctNDY6awaVqOpjCGTjHZZxkc23Z3l39EjLOIFQ=='
    )

    const {
      client,
      sampleGoContract,
    } = await getClientAndContract(createTestHttpClient, privKey)

    await sampleGoContract.testNestedEvmCallsAsync()

    client.disconnect()
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
