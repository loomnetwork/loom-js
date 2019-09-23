import test from 'tape'

import { LocalAddress, CryptoUtils, Client } from '../../index'
import { createTestClient, waitForMillisecondsAsync } from '../helpers'

import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { SignedTxMiddleware } from '../../middleware'
import { ITxMiddlewareHandler } from '../../client'
import { NonceTx } from '../../proto/loom_pb'

const SimpleStore = require('./artifacts/SimpleStore.json')

// import Web3 from 'web3'
const Web3 = require('web3')

/**
 * Super simple custom middleware for more about middlewares see "loom-js/src/middleware"
 */
class SuperSimpleMiddlware implements ITxMiddlewareHandler {
  private _nonceCount: number = 0

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    this._nonceCount++
    const tx = new NonceTx()
    tx.setInner(txData as Uint8Array)
    tx.setSequence(this._nonceCount)
    return tx.serializeBinary()
  }
}

test('LoomProvider + Web3 + Middleware', async t => {
  t.plan(2)

  const privKey = CryptoUtils.generatePrivateKey()
  const client = createTestClient()
  const from = LocalAddress.fromPublicKey(CryptoUtils.publicKeyFromPrivateKey(privKey)).toString()

  // Using a super simple custom middleware
  // Here you can pass your custom middleware or using a different middleware
  // Middlewares available on path "loom-js/src/middleware"
  const setupMiddlewareFn = function(
    client: Client, // Unused
    privateKey: Uint8Array | null
  ): ITxMiddlewareHandler[] {
    return [new SuperSimpleMiddlware(), new SignedTxMiddleware(privateKey!)]
  }

  // Passing custom middleware on third parameter
  // Or let it null to using the default middleware set
  const loomProvider = new LoomProvider(client, privKey, setupMiddlewareFn)

  const web3 = new Web3(loomProvider)

  client.on('error', console.log)

  const ABI = SimpleStore.abi

  const result = await deployContract(loomProvider, SimpleStore.bytecode)

  const contract = new web3.eth.Contract(ABI, result.contractAddress, { from })

  try {
    const newValue = 1

    contract.events.NewValueSet({ filter: { _value: [4, 5] } }, (err: Error, event: any) => {
      console.log(err, event)
      if (err) t.error(err)
      else {
        t.fail('should not been dispatched')
      }
    })

    const tx = await contract.methods.set(newValue).send()
    t.equal(tx.status, true, 'SimpleStore.set should return correct status')

    const resultOfGet = await contract.methods.get().call()
    t.equal(+resultOfGet, newValue, `SimpleStore.get should return correct value`)

    await waitForMillisecondsAsync(1000)
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }
})
