import test from 'tape'

import { MapEntry } from './tests_pb'
import { Client, ITxMiddlewareHandler, isInvalidTxNonceError } from '../client'
import { Contract } from '../contract'
import { Address, LocalAddress } from '../address'
import { generatePrivateKey, publicKeyFromPrivateKey } from '../crypto-utils'
import { NonceTxMiddleware, SignedTxMiddleware } from '../middleware'
import { NonceTx } from '../proto/loom_pb'
import { createTestClient } from './helpers'

// Tx middleware that will generate a tx with an invalid nonce the first X times it's used.
class InvalidNonceTxMiddleware implements ITxMiddlewareHandler {
  private _mw: NonceTxMiddleware

  failureCount: number = 0
  currentAttempt: number = 0

  constructor(publicKey: Uint8Array, client: Client) {
    this._mw = new NonceTxMiddleware(publicKey, client)
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    if (this.currentAttempt++ < this.failureCount) {
      const tx = new NonceTx()
      tx.setInner(txData as Uint8Array)
      tx.setSequence(0)
      return tx.serializeBinary()
    } else {
      return this._mw.Handle(txData)
    }
  }
}

test('Client nonce retry strategy', async t => {
  try {
    const privKey = generatePrivateKey()
    const pubKey = publicKeyFromPrivateKey(privKey)
    const client = createTestClient()

    const nonceMiddlware = new InvalidNonceTxMiddleware(pubKey, client)
    client.txMiddleware = [nonceMiddlware, new SignedTxMiddleware(privKey)]

    const contractAddr = await client.getContractAddressAsync('BluePrint')
    if (!contractAddr) {
      throw new Error('Failed to resolve contract address')
    }
    const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))
    const contract = new Contract({ contractAddr, callerAddr, client })

    const msgKey = '123'
    const msgValue = '456'
    const msg = new MapEntry()
    msg.setKey(msgKey)
    msg.setValue(msgValue)

    nonceMiddlware.failureCount = 1
    nonceMiddlware.currentAttempt = 0
    client.nonceRetryStrategy.retries = 0

    try {
      await contract.callAsync<void>('SetMsg', msg)
    } catch (err) {
      if (!isInvalidTxNonceError(err)) {
        throw err
      }
    }
    t.isEqual(
      nonceMiddlware.currentAttempt,
      1,
      'Tx should be sent only once when nonceRetryStrategy.retries == 0'
    )

    nonceMiddlware.failureCount = 1
    nonceMiddlware.currentAttempt = 0
    client.nonceRetryStrategy.retries = 1

    await contract.callAsync<void>('SetMsg', msg)
    t.isEqual(
      nonceMiddlware.currentAttempt,
      2,
      'Tx should be sent twice when nonceRetryStrategy.retries == 1'
    )

    nonceMiddlware.failureCount = 2
    nonceMiddlware.currentAttempt = 0
    client.nonceRetryStrategy.retries = 1

    let failed = false
    try {
      await contract.callAsync<void>('SetMsg', msg)
    } catch (err) {
      failed = true
      if (!isInvalidTxNonceError(err)) {
        throw err
      }
    }

    t.isEqual(
      nonceMiddlware.currentAttempt,
      2,
      'Tx should be sent twice when nonceRetryStrategy.retries == 1'
    )
    t.ok(
      failed,
      'Nonce error should be thrown after two failed attempts when nonceRetryStrategy.retries == 1'
    )

    nonceMiddlware.failureCount = 2
    nonceMiddlware.currentAttempt = 0
    client.nonceRetryStrategy.retries = 2

    await contract.callAsync<void>('SetMsg', msg)
    t.isEqual(
      nonceMiddlware.currentAttempt,
      3,
      'Tx should be sent 3 times when nonceRetryStrategy.retries == 2'
    )

    client.disconnect()
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
