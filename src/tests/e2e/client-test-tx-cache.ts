import test from 'tape'

import {
  NonceTxMiddleware,
  SignedTxMiddleware,
  CryptoUtils,
  Client,
  ITxMiddlewareHandler
} from '../../index'
import { createTestWSClient, createTestHttpClient } from '../helpers'
import { CallTx, VMType, MessageTx, Transaction, NonceTx } from '../../proto/loom_pb'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { bufferToProtobufBytes } from '../../crypto-utils'
import { Address, LocalAddress } from '../../address'
import { CachedNonceTxMiddleware } from '../../middleware'

/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.22;
 *
 * contract SimpleStore {
 *   uint value;
 *
 *   constructor() public {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint indexed _value);
 *   event NewValueSetAgain(uint indexed _value);
 *
 *   function set(uint _value) public {
 *     value = _value;
 *
 *     require(_value != 100, "Magic value");
 *
 *     emit NewValueSet(value);
 *   }
 *
 *   function setAgain(uint _value) public {
 *     value = _value;
 *     emit NewValueSetAgain(value);
 *   }
 *
 *   function get() public view returns (uint) {
 *     return value;
 *   }
 * }
 *
 */

async function deploySimpleStoreContract(): Promise<Address> {
  let privateKey = CryptoUtils.generatePrivateKey()
  let client = createTestWSClient()
  let contractAddress: Address
  try {
    client.on('error', err => console.error(err))

    // Only used for deploy the contract
    const loomProvider = new LoomProvider(client, privateKey)

    // Contract bytecode to deploy
    const contractData =
      '608060405234801561001057600080fd5b50600a600081905550610201806100286000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b11461005c5780636d4ce63c14610089578063cf718921146100b4575b600080fd5b34801561006857600080fd5b50610087600480360381019080803590602001909291905050506100e1565b005b34801561009557600080fd5b5061009e610193565b6040518082815260200191505060405180910390f35b3480156100c057600080fd5b506100df6004803603810190808035906020019092919050505061019c565b005b8060008190555060648114151515610161576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600b8152602001807f4d616769632076616c756500000000000000000000000000000000000000000081525060200191505060405180910390fd5b6000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b60008054905090565b806000819055506000547fc151b22f26f815d64ae384647d49bc5655149c4b273318d8c3846086dae3835e60405160405180910390a2505600a165627a7a723058204c7af9b8100ac44b72d5498cd5d9034844c7b2249060740bafbe2876fbbcb6d40029'

    // Deploy
    const result = await deployContract(loomProvider, contractData)
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

test.only('Test CachedNonceTxMiddleware', async t => {
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
      await callTransactionAsync(client, caller, address, functionSetErr)
    } catch (err) {
      cacheErrCount++
    }

    try {
      await callTransactionAsync(client, caller, address, functionSetOk)
    } catch (err) {
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
