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
  userdeployerwhitelist: Contracts.UserDeployerWhitelist
  pubKey: Uint8Array
  deployerAddress: Address
}> {
  const privKey = B64ToUint8Array(
    'Hz9P3aHH62mO75A6uMVW3mn0U1KkZSq3t03jfOZfyZxjyJoJctNDY6awaVqOpjCGTjHZZxkc23Z3l39EjLOIFQ=='
  )
  const pubKey = CryptoUtils.publicKeyFromPrivateKey(privKey)
  const client = createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, privKey)

  const userdeployerwhitelist = await Contracts.UserDeployerWhitelist.createAsync(
    client,
    new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
  )

  const privKeyDeployer = B64ToUint8Array(
    'ZGTsP8LUJkEWiqEZq3hqOKfCHCeV+CbYgbZK2/y53aDAaCJPBla4uLTsEtzm/Dczk8Ml8TL5+rAwKNfbuRZihg=='
  )
  const pubKeyDeployer = CryptoUtils.publicKeyFromPrivateKey(privKey)

  const deployerAddress = new Address(client.chainId, LocalAddress.fromPublicKey(pubKeyDeployer))

  return { client, userdeployerwhitelist, pubKey, deployerAddress }
}


async function addUserDeployer(t: test.Test, createClient: () => Client) {
  const { client, userdeployerwhitelist, pubKey, deployerAddress } = await getClientAndContract(createClient)
  await userdeployerwhitelist.addDeployerAsync(deployerAddress, 0)
  client.disconnect()
}

async function getUserDeployer(t: test.Test, createClient: () => Client) {
  const { client, userdeployerwhitelist, pubKey } = await getClientAndContract(createClient)
  await userdeployerwhitelist.getDeployersAsync(new Address(client.chainId, LocalAddress.fromPublicKey(pubKey)))

  client.disconnect()
}

async function getTierInfo(t: test.Test, createClient: () => Client) {
  const { client, userdeployerwhitelist, pubKey } = await getClientAndContract(createClient)

  await userdeployerwhitelist.getTierInfoAsync(0)

  client.disconnect()
}

test('user-deployer-whitelist', async t => {
  try {

    await addUserDeployer(t, createTestHttpClient)
    await waitForMillisecondsAsync(1000)
    await getUserDeployer(t, createTestHttpClient)
    await waitForMillisecondsAsync(1000)
    await getTierInfo(t, createTestHttpClient)
    await waitForMillisecondsAsync(1000)
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
