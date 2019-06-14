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

const toCoinE18 = (amount: number): BN => {
  return new BN(10).pow(new BN(18)).mul(new BN(amount))
}

async function getClientAndContractCoin(
  createClient: () => Client
): Promise<{
  acct1Client: Client
  acct1Coin: Contracts.Coin
  acct1PubKey: Uint8Array
}> {
  const acct1PrivKey = B64ToUint8Array(
    'Hz9P3aHH62mO75A6uMVW3mn0U1KkZSq3t03jfOZfyZxjyJoJctNDY6awaVqOpjCGTjHZZxkc23Z3l39EjLOIFQ=='
  )

  const acct1PubKey = CryptoUtils.publicKeyFromPrivateKey(acct1PrivKey)
  const acct1Client = createClient()

  acct1Client.txMiddleware = createDefaultTxMiddleware(acct1Client, acct1PrivKey)

  const acct1Coin = await Contracts.Coin.createAsync(
    acct1Client,
    new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  )

  return { acct1Client, acct1Coin, acct1PubKey, }
}

async function testBalanceOf(t: test.Test, createClient: () => Client) {
  const { acct1Client, acct1Coin, acct1PubKey, } = await getClientAndContractCoin(createClient)

  const acct1Owner = new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  const acct1Balance = await acct1Coin.getBalanceOfAsync(acct1Owner)
  t.assert(acct1Balance.eq(toCoinE18(10000)), 'Acct 1 balance should be 10000e18')
  acct1Client.disconnect()

}

async function testApprove(t: test.Test, createClient: () => Client) {
  const { acct1Client, acct1Coin, acct1PubKey } = await getClientAndContractCoin(createClient)

  const contractAddr = await acct1Client.getContractAddressAsync('user-deployer-whitelist')
  console.log("Contract Address", contractAddr)
  await acct1Coin.approveAsync(contractAddr!, toCoinE18(10000))

  acct1Client.disconnect()
}


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
    await testBalanceOf(t, createTestHttpClient)
    await waitForMillisecondsAsync(1000)
    await testApprove(t, createTestHttpClient)
    await waitForMillisecondsAsync(1000)
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
