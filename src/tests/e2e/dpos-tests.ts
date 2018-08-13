import test from 'tape'
import BN from 'bn.js'
import {
  Address,
  Coin,
  DPOS,
  CryptoUtils,
  createDefaultTxMiddleware,
  Client,
  LocalAddress
} from '../../index'
import { createTestHttpClient } from '../helpers'
import { B64ToUint8Array } from '../../crypto-utils'

const toCoinE18 = (amount: number): BN => {
  return new BN(10).pow(new BN(18)).mul(new BN(amount))
}

async function getClientAndContract(
  createClient: () => Client
): Promise<{
  client: Client
  dpos: DPOS
  pubKey: Uint8Array
}> {
  const privKey = CryptoUtils.generatePrivateKey()
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const dpos = await DPOS.createAsync(
    client,
    new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
  )

  return { client, dpos, pubKey }
}

async function testDPOS(t: test.Test, createClient: () => Client) {
  const { client, dpos, pubKey } = await getClientAndContract(createClient)

  client.disconnect()
}

test('DPOS', async t => {
  try {
    await testDPOS(t, createTestHttpClient)
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
