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

const toEthCoinE18 = (amount: number): BN => {
  return new BN(10).pow(new BN(18)).mul(new BN(amount))
}

async function getClientAndContract(
  createClient: () => Client
): Promise<{
  acct1Client: Client
  acct2Client: Client
  acct1EthCoin: Contracts.EthCoin
  acct2EthCoin: Contracts.EthCoin
  acct1PubKey: Uint8Array
  acct2PubKey: Uint8Array
}> {
  const acct1PrivKey = B64ToUint8Array(
    'Hz9P3aHH62mO75A6uMVW3mn0U1KkZSq3t03jfOZfyZxjyJoJctNDY6awaVqOpjCGTjHZZxkc23Z3l39EjLOIFQ=='
  )

  const acct2PrivKey = B64ToUint8Array(
    '3bpboaOX/8R2XPS6q6SmhGq+RBvs+3DDkWXayy58lIC+9k1Sj1K0BEQb82OcLZ8Ivkh9EL5/hWgXLKu3vNLc/g=='
  )

  const acct1PubKey = CryptoUtils.publicKeyFromPrivateKey(acct1PrivKey)
  const acct2PubKey = CryptoUtils.publicKeyFromPrivateKey(acct2PrivKey)
  const acct1Client = createClient()
  const acct2Client = createClient()

  acct1Client.txMiddleware = createDefaultTxMiddleware(acct1Client, acct1PrivKey)
  acct2Client.txMiddleware = createDefaultTxMiddleware(acct2Client, acct2PrivKey)

  const acct1EthCoin = await Contracts.EthCoin.createAsync(
    acct1Client,
    new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  )

  const acct2EthCoin = await Contracts.EthCoin.createAsync(
    acct2Client,
    new Address(acct2Client.chainId, LocalAddress.fromPublicKey(acct2PubKey))
  )

  return { acct1Client, acct1EthCoin, acct1PubKey, acct2Client, acct2EthCoin, acct2PubKey }
}

test('Should get total supply', async (t: test.Test) => {
  const { acct1Client, acct1EthCoin } = await getClientAndContract(createTestHttpClient)
  const totalSupply = await acct1EthCoin.getTotalSupplyAsync()

  t.assert(totalSupply.eq(toEthCoinE18(100)), 'Total Supply should be 100e18')

  acct1Client.disconnect()
  t.end()
})

test('Should get balanceOf', async (t: test.Test) => {
  const {
    acct1Client,
    acct1EthCoin,
    acct1PubKey,
    acct2Client,
    acct2EthCoin,
    acct2PubKey
  } = await getClientAndContract(createTestHttpClient)

  const acct1Owner = new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  const acct1Balance = await acct1EthCoin.getBalanceOfAsync(acct1Owner)

  t.assert(acct1Balance.eq(toEthCoinE18(100)), 'Acct 1 balance should be 100e18')

  const acct2Owner = new Address(acct2Client.chainId, LocalAddress.fromPublicKey(acct2PubKey))
  const acct2Balance = await acct2EthCoin.getBalanceOfAsync(acct2Owner)

  t.assert(acct2Balance.eq(toEthCoinE18(0)), 'Acct 2 balance should be 0')

  acct1Client.disconnect()
  acct2Client.disconnect()
  t.end()
})

test('Should get correct balanceOf after transfer', async (t: test.Test) => {
  const {
    acct1Client,
    acct1EthCoin,
    acct1PubKey,
    acct2Client,
    acct2EthCoin,
    acct2PubKey
  } = await getClientAndContract(createTestHttpClient)

  const from = new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  const to = new Address(acct2Client.chainId, LocalAddress.fromPublicKey(acct2PubKey))

  await acct1EthCoin.transferAsync(to, toEthCoinE18(10))

  const acct1Balance = await acct1EthCoin.getBalanceOfAsync(from)
  t.assert(acct1Balance.eq(toEthCoinE18(90)), 'Acct 1 Balance after transfer should be 90e18')

  const acct2Balance = await acct2EthCoin.getBalanceOfAsync(to)
  t.assert(acct2Balance.eq(toEthCoinE18(10)), 'Acct 2 Balance after transfer should be 10e18')

  acct1Client.disconnect()
  acct2Client.disconnect()
  t.end()
})

test('Should correctly approve transfer', async (t: test.Test) => {
  const {
    acct1Client,
    acct1EthCoin,
    acct2Client,
    acct1PubKey,
    acct2PubKey
  } = await getClientAndContract(createTestHttpClient)

  const owner = new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))
  const spender = new Address(acct2Client.chainId, LocalAddress.fromPublicKey(acct2PubKey))

  await acct1EthCoin.approveAsync(spender, toEthCoinE18(1))
  const bn = await acct1EthCoin.getAllowanceAsync(owner, spender)

  t.isEqual(bn.toString(), toEthCoinE18(1).toString(), 'Approved the allowance correctly')

  acct1Client.disconnect()
  acct2Client.disconnect()
  t.end()
})

test('Should correctly approve transfer', async (t: test.Test) => {
  const {
    acct1Client,
    acct1EthCoin,
    acct1PubKey,
    acct2Client,
    acct2EthCoin,
    acct2PubKey
  } = await getClientAndContract(createTestHttpClient)

  const spender = new Address(acct2Client.chainId, LocalAddress.fromPublicKey(acct2PubKey))
  const owner = new Address(acct1Client.chainId, LocalAddress.fromPublicKey(acct1PubKey))

  await acct2EthCoin.transferFromAsync(owner, spender, toEthCoinE18(1))

  const acct1Balance = await acct1EthCoin.getBalanceOfAsync(owner)
  t.assert(acct1Balance.eq(toEthCoinE18(89)), 'Acct 1 Balance after transfer should be 89e18')

  const acct2Balance = await acct2EthCoin.getBalanceOfAsync(spender)
  t.assert(acct2Balance.eq(toEthCoinE18(11)), 'Acct 2 Balance after transfer should be 11e18')

  acct1Client.disconnect()
  acct2Client.disconnect()
  t.end()
})
