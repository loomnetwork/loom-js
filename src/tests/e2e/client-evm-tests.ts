import test from 'tape'

import { NonceTxMiddleware, SignedTxMiddleware, CryptoUtils } from '../../index'
import { createTestClient, waitForMillisecondsAsync } from '../helpers'
import { EthBlockHashList, EthBlockInfo, EthTxHashList } from '../../proto/loom_pb'
import { bufferToProtobufBytes, bytesToHexAddr } from '../../crypto-utils'

test('Client EVM test (newBlockEvmFilterAsync)', async t => {
  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const client = createTestClient()

    client.txMiddleware = [
      new NonceTxMiddleware(publicKey, client),
      new SignedTxMiddleware(privateKey)
    ]

    // calls newblockevmfilter
    const filterId = await client.newBlockEvmFilterAsync()

    if (!filterId) {
      t.fail('Filter Id cannot be null')
    }

    await waitForMillisecondsAsync(1000)

    // calls getevmfilterchanges
    const hash = await client.getEvmFilterChangesAsync(filterId as string)

    if (!hash) {
      t.fail('Block cannot be null')
    }

    const blockList = (hash as EthBlockHashList).getEthBlockHashList()

    // calls getevmblockbyhash
    const block: EthBlockInfo = (await client.getEvmBlockByHashAsync(
      bytesToHexAddr(blockList[0] as Uint8Array)
    )) as EthBlockInfo

    if (!block) {
      t.fail('Block cannot be null')
    }

    t.assert(block.getHash(), 'Block should have a hash')

    client.disconnect()
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }
  t.end()
})

test('Client EVM test (newPendingTransactionEvmFilterAsync)', async t => {
  try {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const client = createTestClient()

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

    client.disconnect()
  } catch (err) {
    console.error(err)
    t.fail(err.message)
  }
  t.end()
})
