import test from 'tape'

import { CryptoUtils } from '../../index'
import { execAndWaitForMillisecondsAsync, createTestClient } from '../helpers'
import { EthBlockHashList, EthBlockInfo } from '../../proto/evm_pb'
import { bytesToHexAddr } from '../../crypto-utils'
import { createDefaultTxMiddleware } from '../../helpers'

test('Client EVM test (newBlockEvmFilterAsync)', async t => {
  let client

  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    client = createTestClient()

    client.on('error', err => t.error(err))

    client.txMiddleware = createDefaultTxMiddleware(client, privateKey)

    // calls newblockevmfilter
    const filterId = await execAndWaitForMillisecondsAsync(client.newBlockEvmFilterAsync())

    if (!filterId) {
      t.fail('Filter Id cannot be null')
    }
    // calls getevmfilterchanges
    const hash = await execAndWaitForMillisecondsAsync(
      client.getEvmFilterChangesAsync(filterId as string)
    )

    if (!hash) {
      t.fail('Block cannot be null')
    }

    const blockList = (hash as EthBlockHashList).getEthBlockHashList()

    // calls getevmblockbyhash
    const block: EthBlockInfo = (await execAndWaitForMillisecondsAsync(
      client.getEvmBlockByHashAsync(bytesToHexAddr(blockList[0] as Uint8Array))
    )) as EthBlockInfo

    if (!block) {
      t.fail('Block cannot be null')
    }

    t.assert(block.getHash(), 'Block should have a hash')
  } catch (err: any) {
    console.error(err)
    t.fail(err.message)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('Client EVM test (newPendingTransactionEvmFilterAsync)', async t => {
  let client
  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    client = createTestClient()

    client.on('error', err => t.error(err, "Client error"))

    client.txMiddleware = createDefaultTxMiddleware(client, privateKey)

    // calls newblockevmfilter
    const filterId = await execAndWaitForMillisecondsAsync(
      client.newPendingTransactionEvmFilterAsync()
    )
    t.ok(filterId, 'Filter Id cannot be null')

    // calls getevmfilterchanges
    const hash = await client.getEvmFilterChangesAsync(filterId as string)
    t.ok(hash, 'Transaction cannot be null')

  } catch (err) {
    t.error(err)

  } finally {
    if (client) {
      client.disconnect()
    }
    t.end()
  }
})
