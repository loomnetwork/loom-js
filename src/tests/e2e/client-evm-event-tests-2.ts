import test from 'tape'

import { CryptoUtils, Client } from '../../index'
import { createTestClient, waitForMillisecondsAsync } from '../helpers'
import { CallTx, VMType, MessageTx, Transaction } from '../../proto/loom_pb'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { bufferToProtobufBytes } from '../../crypto-utils'
import { Address, LocalAddress } from '../../address'
import { createDefaultTxMiddleware } from '../../helpers'

const SimpleStore = require('./truffle-artifacts/SimpleStore2.json')

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

test('Client EVM Event test (two filters)', async t => {
  let client

  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    client = createTestClient()

    client.on('error', err => t.error(err))

    // Only used for deploy the contract
    const loomProvider = new LoomProvider(client, privateKey)

    // Deploy
    const result = await deployContract(loomProvider, SimpleStore.bytecode)

    // Middleware used for client
    client.txMiddleware = createDefaultTxMiddleware(client, privateKey)

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
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})
