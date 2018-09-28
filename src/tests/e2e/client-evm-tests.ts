import test from 'tape'

import { NonceTxMiddleware, SignedTxMiddleware, CryptoUtils } from '../../index'
import { createTestClient, waitForMillisecondsAsync } from '../helpers'
import { EthBlockHashList, EthBlockInfo } from '../../proto/evm_pb'
import { bytesToHexAddr } from '../../crypto-utils'

test('Client EVM test (newBlockEvmFilterAsync)', async t => {
  let client

  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    client = createTestClient()

    client.on('error', err => t.error(err))

    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    // calls newblockevmfilter
    const filterId = await client.newBlockEvmFilterAsync()

    await waitForMillisecondsAsync(1000)

    if (!filterId) {
      t.fail('Filter Id cannot be null')
    }

    // calls getevmfilterchanges
    const hash = await client.getEvmFilterChangesAsync(filterId as string)

    await waitForMillisecondsAsync(1000)

    if (!hash) {
      t.fail('Block cannot be null')
    }

    const blockList = (hash as EthBlockHashList).getEthBlockHashList()

    // calls getevmblockbyhash
    const block: EthBlockInfo = (await client.getEvmBlockByHashAsync(
      bytesToHexAddr(blockList[0] as Uint8Array)
    )) as EthBlockInfo

    await waitForMillisecondsAsync(1000)

    if (!block) {
      t.fail('Block cannot be null')
    }

    t.assert(block.getHash(), 'Block should have a hash')
  } catch (err) {
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
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    client = createTestClient()

    client.on('error', err => t.error(err))

    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    // calls newblockevmfilter
    const filterId = await client.newPendingTransactionEvmFilterAsync()

    if (!filterId) {
      t.fail('Filter Id cannot be null')
    }

    await waitForMillisecondsAsync(1000)

    // calls getevmfilterchanges
    const hash = await client.getEvmFilterChangesAsync(filterId as string)

    if (!hash) {
      t.fail('Transaction cannot be null')
    }
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})
