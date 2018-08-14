import test from 'tape'
import BN from 'bn.js'
import {
  Address,
  Contracts,
  CryptoUtils,
  createDefaultTxMiddleware,
  Client,
  LocalAddress
} from '../../index'
import { createTestHttpClient, waitForMillisecondsAsync } from '../helpers'
import { B64ToUint8Array } from '../../crypto-utils'

async function getClientAndContract(
  createClient: () => Client
): Promise<{
  client: Client
  dpos: Contracts.DPOS
  pubKey: Uint8Array
}> {
  const privKey = B64ToUint8Array(
    'h/+I7gVOCtsyR5Asc9yS2xDIcYsci/r5LaWHkiyDDrGgtEDArc70E6yIyuCickJ/GYJHFRSup8V8prHk30Z3lw=='
  )
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const dpos = await Contracts.DPOS.createAsync(
    client,
    new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
  )

  return { client, dpos, pubKey }
}

async function registerCandidate(t: test.Test, createClient: () => Client) {
  const { client, dpos, pubKey } = await getClientAndContract(createClient)

  await dpos.registerCandidateAsync(pubKey)

  client.disconnect()
}

async function unregisterCandidate(t: test.Test, createClient: () => Client) {
  const { client, dpos } = await getClientAndContract(createClient)

  await dpos.unregisterCandidateAsync()

  client.disconnect()
}

async function voteRequest(t: test.Test, createClient: () => Client) {
  const { client, dpos, pubKey } = await getClientAndContract(createClient)

  const candidate = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
  await dpos.voteAsync(candidate, 10)

  client.disconnect()
}

async function electionRequest(t: test.Test, createClient: () => Client) {
  const { client, dpos, pubKey } = await getClientAndContract(createClient)

  await dpos.electAsync()

  client.disconnect()
}

async function listCandidates(t: test.Test, createClient: () => Client) {
  const { client, dpos, pubKey } = await getClientAndContract(createClient)

  const candidates = await dpos.getCandidatesAsync()
  t.assert(candidates!.length === 1, 'Should have one candidate')

  client.disconnect()
}

async function listWitness(t: test.Test, createClient: () => Client) {
  const { client, dpos, pubKey } = await getClientAndContract(createClient)

  const witnesses = await dpos.getWitnessesAsync()
  t.assert(witnesses!.length === 1, 'Should have one witness')

  client.disconnect()
}

test('DPOS', async t => {
  try {
    await registerCandidate(t, createTestHttpClient)
    await waitForMillisecondsAsync(1000)
    await waitForMillisecondsAsync(1000)
    await voteRequest(t, createTestHttpClient)
    await waitForMillisecondsAsync(1000)
    await electionRequest(t, createTestHttpClient)
    await waitForMillisecondsAsync(1000)
    await listCandidates(t, createTestHttpClient)
    await waitForMillisecondsAsync(1000)
    await unregisterCandidate(t, createTestHttpClient)
    await waitForMillisecondsAsync(1000)
    await listWitness(t, createTestHttpClient)
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
