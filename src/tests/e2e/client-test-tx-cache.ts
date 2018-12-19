import test from 'tape'

import {
  NonceTxMiddleware,
  SignedTxMiddleware,
  CryptoUtils,
  Client,
  isTxAlreadyInCacheError,
  ITxMiddlewareHandler
} from '../../index'
import { createTestWSClient, waitForMillisecondsAsync, createTestHttpClient } from '../helpers'
import { CallTx, VMType, MessageTx, Transaction, NonceTx } from '../../proto/loom_pb'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { bufferToProtobufBytes } from '../../crypto-utils'
import { Address, LocalAddress } from '../../address'

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
      '608060405234801561001057600080fd5b50600a60005561015c806100256000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166360fe47b1811461005b5780636d4ce63c14610075578063cf7189211461009c575b600080fd5b34801561006757600080fd5b506100736004356100b4565b005b34801561008157600080fd5b5061008a6100ef565b60408051918252519081900360200190f35b3480156100a857600080fd5b506100736004356100f5565b60008190556040805182815290517fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b9181900360200190a150565b60005490565b60008190556040805182815290517fc151b22f26f815d64ae384647d49bc5655149c4b273318d8c3846086dae3835e9181900360200190a1505600a165627a7a723058206e4e5f5b6acc54b18ad15cb2110379c386cd8327527ca2d203a563300b37e3890029'

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
