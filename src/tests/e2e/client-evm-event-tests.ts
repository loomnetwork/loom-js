import test from 'tape'

import { NonceTxMiddleware, SignedTxMiddleware, CryptoUtils } from '../../index'
import { createTestClient } from '../helpers'
import { CallTx, VMType, MessageTx, Transaction } from '../../proto/loom_pb'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { bufferToProtobufBytes } from '../../crypto-utils'
import { Address, LocalAddress } from '../../address'
import { SimpleStore } from '../contracts_bytecode'

test('Client EVM Event test', async t => {
  let client

  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    client = createTestClient()

    client.on('error', err => t.error(err))

    // Only used for deploy the contract
    const loomProvider = new LoomProvider(client, privateKey)

    // Deploy
    const result = await deployContract(loomProvider, SimpleStore)

    // Middleware used for client
    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    // Filter by topics
    const filter = {
      topics: [
        '0xb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b',
        [
          '0x0000000000000000000000000000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000000000000000000000000000002',
          '0x0000000000000000000000000000000000000000000000000000000000000003',
          '0x0000000000000000000000000000000000000000000000000000000000000004',
          '0x0000000000000000000000000000000000000000000000000000000000000005'
        ]
      ],
      address: result.contractAddress
    }

    const filterCreated = await client.evmSubscribeAsync('logs', filter)

    console.log('Filter created', filterCreated)

    const caller = new Address('default', LocalAddress.fromPublicKey(publicKey))
    const address = new Address('default', LocalAddress.fromHexString(result.contractAddress))
    const data = Buffer.from(
      '60fe47b10000000000000000000000000000000000000000000000000000000000000005',
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

    // @ts-ignore
    await client.commitTxAsync<Transaction>(tx)

    console.log('Disconnected')
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})
