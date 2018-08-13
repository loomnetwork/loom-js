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
import { createTestHttpClient } from '../helpers'
import { B64ToUint8Array } from '../../crypto-utils'

const toCoinE18 = (amount: number): BN => {
  return new BN(10).pow(new BN(18)).mul(new BN(amount))
}

async function getClientAndContract(
  createClient: () => Client
): Promise<{
  acct1Client: Client
  acct2Client: Client
  acct1Coin: Contracts.Coin
  acct2Coin: Contracts.Coin
  acct1PubKey: Uint8Array
  acct2PubKey: Uint8Array
}> {
  const acct1PrivKey = B64ToUint8Array(
    'eYm0FWyQ+gqg9CcKbDn709nBOjnLdZa+BgeQ2nq2Ixtb3qAE7OiBPCPtJuP4C9gUXolFy1Py+GGX5IrehM+Zvg=='
  )

  const acct2PrivKey = B64ToUint8Array(
    'v860Q/w6SAdLqpwhQTgTrK33ewyiFqnJa6wvt2rXugRRCAjYv5QxNwT4L92uQWeR15BrlHlcn85sxiQUNuBVXg=='
  )

  const acct1PubKey = CryptoUtils.publicKeyFromPrivateKey(acct1PrivKey)
  const acct2PubKey = CryptoUtils.publicKeyFromPrivateKey(acct2PrivKey)
  const acct1Client = createClient()
  const acct2Client = createClient()

  acct1Client.txMiddleware = createDefaultTxMiddleware(acct1Client, acct1PrivKey)
  acct2Client.txMiddleware = createDefaultTxMiddleware(acct2Client, acct2PrivKey)

  const acct1Coin = await Contracts.Coin.createAsync(
    acct1Client,
    new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  )

  const acct2Coin = await Contracts.Coin.createAsync(
    acct2Client,
    new Address(acct2Client.chainId, LocalAddress.fromPublicKey(acct2PubKey))
  )

  return { acct1Client, acct1Coin, acct1PubKey, acct2Client, acct2Coin, acct2PubKey }
}

async function testTotalSupply(t: test.Test, createClient: () => Client) {
  const { acct1Client, acct1Coin } = await getClientAndContract(createClient)
  const totalSupply = await acct1Coin.getTotalSupplyAsync()

  t.assert(totalSupply.eq(toCoinE18(100)), 'Total Supply should be 100e18')

  acct1Client.disconnect()
}

async function testBalanceOf(t: test.Test, createClient: () => Client) {
  const {
    acct1Client,
    acct1Coin,
    acct1PubKey,
    acct2Client,
    acct2Coin,
    acct2PubKey
  } = await getClientAndContract(createClient)

  const acct1Owner = new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  const acct1Balance = await acct1Coin.getBalanceOfAsync(acct1Owner)

  t.assert(acct1Balance.eq(toCoinE18(100)), 'Acct 1 balance should be 100e18')

  const acct2Owner = new Address(acct2Client.chainId, LocalAddress.fromPublicKey(acct2PubKey))
  const acct2Balance = await acct2Coin.getBalanceOfAsync(acct2Owner)

  t.assert(acct2Balance.eq(toCoinE18(0)), 'Acct 2 balance should be 0')

  acct1Client.disconnect()
  acct2Client.disconnect()
}

async function testTransfer(t: test.Test, createClient: () => Client) {
  const {
    acct1Client,
    acct1Coin,
    acct1PubKey,
    acct2Client,
    acct2Coin,
    acct2PubKey
  } = await getClientAndContract(createClient)

  const from = new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  const to = new Address(acct2Client.chainId, LocalAddress.fromPublicKey(acct2PubKey))

  await acct1Coin.transferAsync(to, toCoinE18(10))

  const acct1Balance = await acct1Coin.getBalanceOfAsync(from)
  t.assert(acct1Balance.eq(toCoinE18(90)), 'Acct 1 Balance after transfer should be 90e18')

  const acct2Balance = await acct2Coin.getBalanceOfAsync(to)
  t.assert(acct2Balance.eq(toCoinE18(10)), 'Acct 2 Balance after transfer should be 10e18')

  acct1Client.disconnect()
  acct2Client.disconnect()
}

async function testApprove(t: test.Test, createClient: () => Client) {
  const { acct1Client, acct1Coin, acct2Client, acct2PubKey } = await getClientAndContract(
    createClient
  )

  const spender = new Address(acct2Client.chainId, LocalAddress.fromPublicKey(acct2PubKey))

  await acct1Coin.approveAsync(spender, toCoinE18(1))

  acct1Client.disconnect()
}

async function testAllowance(t: test.Test, createClient: () => Client) {
  const {
    acct1Client,
    acct1Coin,
    acct1PubKey,
    acct2Client,
    acct2PubKey
  } = await getClientAndContract(createClient)

  const spender = new Address(acct2Client.chainId, LocalAddress.fromPublicKey(acct2PubKey))
  const owner = new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))

  const allowance = await acct1Coin.getAllowanceAsync(owner, spender)

  t.assert(allowance.eq(toCoinE18(1)), 'Allowance should be 1')

  acct1Client.disconnect()
  acct2Client.disconnect()
}

async function testTransferFrom(t: test.Test, createClient: () => Client) {
  const {
    acct1Client,
    acct1Coin,
    acct1PubKey,
    acct2Client,
    acct2Coin,
    acct2PubKey
  } = await getClientAndContract(createClient)

  const spender = new Address(acct2Client.chainId, LocalAddress.fromPublicKey(acct2PubKey))
  const owner = new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))

  await acct2Coin.transferFromAsync(owner, spender, toCoinE18(1))

  const acct1Balance = await acct1Coin.getBalanceOfAsync(owner)
  t.assert(acct1Balance.eq(toCoinE18(89)), 'Acct 1 Balance after transfer should be 89e18')

  const acct2Balance = await acct2Coin.getBalanceOfAsync(spender)
  t.assert(acct2Balance.eq(toCoinE18(11)), 'Acct 2 Balance after transfer should be 11e18')

  acct1Client.disconnect()
  acct2Client.disconnect()
}

test('Coin', async t => {
  try {
    await testTotalSupply(t, createTestHttpClient)
    await testBalanceOf(t, createTestHttpClient)
    await testTransfer(t, createTestHttpClient)
    await testApprove(t, createTestHttpClient)
    await testAllowance(t, createTestHttpClient)
    await testTransferFrom(t, createTestHttpClient)
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
