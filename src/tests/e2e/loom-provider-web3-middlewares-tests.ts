import test from 'tape'

import { LocalAddress, CryptoUtils, Client } from '../../index'
import { createTestClient, waitForMillisecondsAsync } from '../helpers'

import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { SignedTxMiddleware } from '../../middleware'
import { ITxMiddlewareHandler, ITxResults } from '../../client'
import { NonceTx } from '../../proto/loom_pb'

// import Web3 from 'web3'
const Web3 = require('web3')

/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.22;
 *
 * contract SimpleStore {
 *   uint value;
 *   constructor() public {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint indexed _value);
 *
 *   function set(uint _value) public {
 *     value = _value;
 *     emit NewValueSet(value);
 *   }
 *
 *   function get() public view returns (uint) {
 *     return value;
 *   }
 * }
 *
 *
 */

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
    privateKey: Uint8Array
  ): ITxMiddlewareHandler[] {
    return [new SuperSimpleMiddlware(), new SignedTxMiddleware(privateKey)]
  }

  // Passing custom middleware on third parameter
  // Or let it null to using the default middleware set
  const loomProvider = new LoomProvider(client, privKey, setupMiddlewareFn)

  const web3 = new Web3(loomProvider)

  client.on('error', console.log)

  const contractData =
    '0x608060405234801561001057600080fd5b50600a60008190555061010e806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60d9565b6040518082815260200191505060405180910390f35b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820b76f6c855a1f95260fc70490b16774074225da52ea165a58e95eb7a72a59d1700029'

  const ABI = [
    {
      constant: false,
      inputs: [{ name: '_value', type: 'uint256' }],
      name: 'set',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'get',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: '_value', type: 'uint256' }],
      name: 'NewValueSet',
      type: 'event'
    }
  ]

  const result = await deployContract(loomProvider, contractData)

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
    t.equal(tx.status, '0x1', 'SimpleStore.set should return correct status')

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
