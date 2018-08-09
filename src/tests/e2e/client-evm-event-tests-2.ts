import test from 'tape'

import { NonceTxMiddleware, SignedTxMiddleware, CryptoUtils, Client } from '../../index'
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

const callTransactionAsync = async (
  client: Client,
  from: Address,
  to: Address,
  data: Uint8Array
) => {
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

  await client.commitTxAsync<Transaction>(tx)
}

test('Client EVM Event test', async t => {
  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const client = createTestClient()

    // Only used for deploy the contract
    const loomProvider = new LoomProvider(client, privateKey)

    // Contract bytecode to deploy
    const contractData =
      '608060405234801561001057600080fd5b50600a60005561015c806100256000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166360fe47b1811461005b5780636d4ce63c14610075578063cf7189211461009c575b600080fd5b34801561006757600080fd5b506100736004356100b4565b005b34801561008157600080fd5b5061008a6100ef565b60408051918252519081900360200190f35b3480156100a857600080fd5b506100736004356100f5565b60008190556040805182815290517fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b9181900360200190a150565b60005490565b60008190556040805182815290517fc151b22f26f815d64ae384647d49bc5655149c4b273318d8c3846086dae3835e9181900360200190a1505600a165627a7a723058206e4e5f5b6acc54b18ad15cb2110379c386cd8327527ca2d203a563300b37e3890029'

    // Deploy
    const result = await deployContract(loomProvider, contractData)

    // Middleware used for client
    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    // Filter by topics

    // NewValueSet
    const filter1 = {
      topics: ['0xb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b'],
      address: result.contractAddress
    }

    // NewValueSetAgain
    const filter2 = {
      topics: ['0xc151b22f26f815d64ae384647d49bc5655149c4b273318d8c3846086dae3835e'],
      address: result.contractAddress
    }

    const filterCreated1 = await client.evmSubscribeAsync('logs', filter1)
    const filterCreated2 = await client.evmSubscribeAsync('logs', filter2)

    console.log('Filter 1 created', filterCreated1)
    console.log('Filter 2 created', filterCreated2)

    const caller = new Address('default', LocalAddress.fromPublicKey(publicKey))
    const address = new Address('default', LocalAddress.fromHexString(result.contractAddress))

    const functionSet = Buffer.from(
      '60fe47b1000000000000000000000000000000000000000000000000000000000000000f',
      'hex'
    )

    const functionSetAgain = Buffer.from(
      'cf718921000000000000000000000000000000000000000000000000000000000000000a',
      'hex'
    )

    await callTransactionAsync(client, caller, address, functionSet)
    await callTransactionAsync(client, caller, address, functionSetAgain)

    waitForMillisecondsAsync(2000)

    client.disconnect()
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  t.end()
})
