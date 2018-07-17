import test from 'tape'

import { NonceTxMiddleware, SignedTxMiddleware, CryptoUtils } from '../../index'
import { createTestClient, waitForMillisecondsAsync } from '../helpers'
import { CallTx, VMType, MessageTx, Transaction } from '../../proto/loom_pb'
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

test('Client EVM Event test', async t => {
  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const client = createTestClient()

    // Only used for deploy the contract
    const loomProvider = new LoomProvider(client, privateKey)

    // Contract bytecode to deploy
    const contractData =
      '0x608060405234801561001057600080fd5b50600a60008190555061010e806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60d9565b6040518082815260200191505060405180910390f35b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820b76f6c855a1f95260fc70490b16774074225da52ea165a58e95eb7a72a59d1700029'

    // Deploy
    const result = await deployContract(loomProvider, contractData)

    // Middleware used for client
    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    // Filter by topics
    const filter = {
      topics: [
        '0xb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b',
        '0x0000000000000000000000000000000000000000000000000000000000000001'
      ],
      address: result.contractAddress
    }

    await client.evmSubscribeAsync('logs', filter)

    const caller = new Address('default', LocalAddress.fromPublicKey(publicKey))
    const address = new Address('default', LocalAddress.fromHexString(result.contractAddress))
    const data = Buffer.from(
      '60fe47b10000000000000000000000000000000000000000000000000000000000000001',
      'hex'
    )

    const callTx = new CallTx()
    callTx.setVmType(VMType.EVM)
    callTx.setInput(bufferToProtobufBytes(data))

    const msgTx = new MessageTx()
    msgTx.setFrom(caller.MarshalPB())
    msgTx.setTo(address.MarshalPB())
    msgTx.setData(callTx.serializeBinary())

    const tx = new Transaction()
    tx.setId(2)
    tx.setData(msgTx.serializeBinary())

    const commitResult = await client.commitTxAsync<Transaction>(tx)

    waitForMillisecondsAsync(2000)

    client.disconnect()
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  t.end()
})
