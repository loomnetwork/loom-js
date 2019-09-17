import test from 'tape'

import {
  NonceTxMiddleware,
  SignedTxMiddleware,
  CachedNonceTxMiddleware,
  CryptoUtils,
  Client,
  ITxMiddlewareHandler,
  SpeculativeNonceTxMiddleware
} from '../../index'
import { createTestWSClient, createTestHttpClient } from '../helpers'
import { CallTx, VMType, MessageTx, Transaction, NonceTx } from '../../proto/loom_pb'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { bufferToProtobufBytes } from '../../crypto-utils'
import { Address, LocalAddress } from '../../address'
import { sleep } from '../../helpers'
import { SimpleStore3 } from '../contracts_bytecode'

async function deploySimpleStoreContract(): Promise<Address> {
  let privateKey = CryptoUtils.generatePrivateKey()
  let client = createTestWSClient()
  let contractAddress: Address
  try {
    client.on('error', err => console.error(err))

    // Only used for deploy the contract
    const loomProvider = new LoomProvider(client, privateKey)

    // Deploy
    const result = await deployContract(loomProvider, SimpleStore3)
    contractAddress = new Address('default', LocalAddress.fromHexString(result.contractAddress))
  } catch (err) {
    throw err
  } finally {
    client.disconnect()
  }
  return contractAddress
}

async function callTransactionAsync(client: Client, from: Address, to: Address, data: Uint8Array) {
  const callTx = new CallTx()
  callTx.setVmType(VMType.EVM)
  callTx.setInput(bufferToProtobufBytes(data))

  const msgTx = new MessageTx()
  msgTx.setFrom(from.MarshalPB())
  msgTx.setTo(to.MarshalPB())
  msgTx.setData(callTx.serializeBinary())

  const tx = new Transaction()
  tx.setId(2)
  tx.setData(msgTx.serializeBinary())

  return client.commitTxAsync<Transaction>(tx)
}

// Middleware that creates a NonceTx with the same nonce every time.
class DuplicateNonceTxMiddleware implements ITxMiddlewareHandler {
  private _mw: NonceTxMiddleware

  nextNonce: number = 0

  constructor(publicKey: Uint8Array, client: Client) {
    this._mw = new NonceTxMiddleware(publicKey, client)
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    if (this.nextNonce > 0) {
      console.log('Sending tx with nonce ' + this.nextNonce)
      const tx = new NonceTx()
      tx.setInner(txData as Uint8Array)
      tx.setSequence(this.nextNonce)
      return tx.serializeBinary()
    } else {
      console.log('Sending tx with nonce 1')
      this.nextNonce = 1
      return this._mw.Handle(txData)
    }
  }
}

// TODO: This test should be fixed to use Web3 to call the EVM contract
// This test relies on a broken node that allows txs to be resent with the same nonce, it'll have
// to be disabled for newer loom builds.
test('Client tx already in cache error (Websocket)', async t => {
  const address = await deploySimpleStoreContract()

  let client = createTestWSClient()
  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

    // Middleware used for client
    client.txMiddleware = client.txMiddleware = [
      new DuplicateNonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    const caller = new Address('default', LocalAddress.fromPublicKey(publicKey))

    const functionSet = Buffer.from(
      '60fe47b1000000000000000000000000000000000000000000000000000000000000000f',
      'hex'
    )

    let cacheErrCount = 0
    try {
      await Promise.all([
        callTransactionAsync(client, caller, address, functionSet),
        callTransactionAsync(client, caller, address, functionSet)
      ])
    } catch (err) {
      cacheErrCount++
    }
    t.equal(cacheErrCount, 1, 'expect to receive cache error')
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('Client tx already in cache error (HTTP)', async t => {
  const address = await deploySimpleStoreContract()

  let client = createTestHttpClient()
  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

    // Middleware used for client
    client.txMiddleware = [
      new DuplicateNonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    const caller = new Address('default', LocalAddress.fromPublicKey(publicKey))

    const functionSet = Buffer.from(
      '60fe47b1000000000000000000000000000000000000000000000000000000000000000f',
      'hex'
    )

    let cacheErrCount = 0
    try {
      await Promise.all([
        callTransactionAsync(client, caller, address, functionSet),
        callTransactionAsync(client, caller, address, functionSet)
      ])
    } catch (err) {
      cacheErrCount++
    }
    t.equal(cacheErrCount, 1, 'expect to receive cache error')
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('Test CachedNonceTxMiddleware - failed tx', async t => {
  const address = await deploySimpleStoreContract()

  let client = createTestHttpClient()

  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

    // Middleware used for client
    client.txMiddleware = [
      new CachedNonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    const caller = new Address('default', LocalAddress.fromPublicKey(publicKey))

    // Reverts when value is 100 (64 hex)
    const functionSetErr = Buffer.from(
      '60fe47b10000000000000000000000000000000000000000000000000000000000000064',
      'hex'
    )

    const functionSetOk = Buffer.from(
      '60fe47b1000000000000000000000000000000000000000000000000000000000000000f',
      'hex'
    )

    let cacheErrCount = 0
    try {
      // Should revert because the value is 100
      await callTransactionAsync(client, caller, address, functionSetErr)
    } catch (err) {
      cacheErrCount++
    }

    try {
      // Should not fail
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    t.equal(cacheErrCount, 1, 'expect to receive only one cache error')
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('Test CachedNonceTxMiddleware - duplicate tx', async t => {
  const address = await deploySimpleStoreContract()

  const client = createTestHttpClient()
  const client2 = createTestHttpClient()

  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

    client.txMiddleware = [
      new CachedNonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    client2.txMiddleware = [
      new NonceTxMiddleware(publicKey, client2),
      new SignedTxMiddleware(privateKey)
    ]

    const caller = new Address('default', LocalAddress.fromPublicKey(publicKey))

    const functionSetOk = Buffer.from(
      '60fe47b1000000000000000000000000000000000000000000000000000000000000000f',
      'hex'
    )

    let cacheErrCount = 0

    try {
      // Should not fail
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    try {
      // Should not fail, and should force the nonce to be incremented on the node
      await callTransactionAsync(client2, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    try {
      // Should fail because cached nonce doesn't match the one on the node anymore
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    try {
      // Should not fail because the cached nonce should've been reset, and a fresh nonce should
      // be used for this call
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    try {
      // Should not fail because the cached nonce should still be good
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    t.equal(cacheErrCount, 1, 'expect to receive only one cache error')
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  if (client) {
    client.disconnect()
  }

  if (client2) {
    client2.disconnect()
  }

  t.end()
})

// Tests that SpeculativeNonceTxMiddleware can recover after a tx fails due to a contract error.
test('Test SpeculativeNonceTxMiddleware - failed tx', async t => {
  const address = await deploySimpleStoreContract()

  let client = createTestHttpClient()

  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

    // Middleware used for client
    client.txMiddleware = [
      new SpeculativeNonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    const caller = new Address('default', LocalAddress.fromPublicKey(publicKey))

    // Reverts when value is 100 (64 hex)
    const functionSetErr = Buffer.from(
      '60fe47b10000000000000000000000000000000000000000000000000000000000000064',
      'hex'
    )

    const functionSetOk = Buffer.from(
      '60fe47b1000000000000000000000000000000000000000000000000000000000000000f',
      'hex'
    )

    let cacheErrCount = 0

    try {
      // Should not fail
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    try {
      // Should revert because the value is 100
      await callTransactionAsync(client, caller, address, functionSetErr)
    } catch (err) {
      cacheErrCount++
    }

    try {
      // Should not fail
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    t.equal(cacheErrCount, 1, 'expect to receive only one cache error')
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

// Tests that SpeculativeNonceTxMiddleware can recover when txs are sent by the same caller using
// multiple clients.
test('Test SpeculativeNonceTxMiddleware - duplicate tx', async t => {
  const address = await deploySimpleStoreContract()

  const client = createTestHttpClient()
  const client2 = createTestHttpClient()

  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

    client.txMiddleware = [
      new SpeculativeNonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    client2.txMiddleware = [
      new NonceTxMiddleware(publicKey, client2),
      new SignedTxMiddleware(privateKey)
    ]

    const caller = new Address('default', LocalAddress.fromPublicKey(publicKey))

    const functionSetOk = Buffer.from(
      '60fe47b1000000000000000000000000000000000000000000000000000000000000000f',
      'hex'
    )

    let cacheErrCount = 0

    try {
      // Should not fail
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    try {
      // Should not fail, and should force the nonce to be incremented on the node
      await callTransactionAsync(client2, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    try {
      // Should fail because cached nonce doesn't match the one on the node anymore
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    try {
      // Should not fail because the cached nonce should've been reset, and a fresh nonce should
      // be used for this call
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    try {
      // Should not fail because the cached nonce should still be good
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
      console.error(err)
      cacheErrCount++
    }

    t.equal(cacheErrCount, 1, 'expect to receive only one cache error')
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  if (client) {
    client.disconnect()
  }

  if (client2) {
    client2.disconnect()
  }

  t.end()
})

// Tests that SpeculativeNonceTxMiddleware correctly allocates sequential nonces to a batch of txs.
test('Test SpeculativeNonceTxMiddleware - rapid txs', async t => {
  const address = await deploySimpleStoreContract()
  const client = createTestHttpClient()

  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const caller = new Address('default', LocalAddress.fromPublicKey(publicKey))

    client.txMiddleware = [
      new SpeculativeNonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    const functionSetOk = Buffer.from(
      '60fe47b1000000000000000000000000000000000000000000000000000000000000000f',
      'hex'
    )

    let errCount = 0
    const promises: Promise<any>[] = []

    for (let i = 0; i < 4; i++) {
      const p = callTransactionAsync(client, caller, address, functionSetOk)
      p.catch(err => {
        console.error(`Error sending tx ${i + 1}: ${err}`)
        errCount++
      })
      promises.push(p)
      // Even though we don't want to wait for tx result before sending the next one there still
      // needs to be slight delay to force the txs to be sent in the right order.
      await sleep(100)
    }

    await Promise.all(promises)

    t.equal(errCount, 0, 'expect to receive no errors')
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})
