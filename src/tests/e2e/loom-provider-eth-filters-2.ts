import test from 'tape'

import { CryptoUtils } from '../../index'
import { createTestClient, waitForMillisecondsAsync } from '../helpers'
import { LoomProvider } from '../../loom-provider'

test('LoomProvider + Filters 2', async t => {
  try {
    const privKey = CryptoUtils.generatePrivateKey()
    const client = createTestClient()
    client.on('error', msg => console.error('Error on client:', msg))
    const loomProvider = new LoomProvider(client, privKey)

    const ethNewBlockFilter = await loomProvider.sendAsync({
      id: 11,
      method: 'eth_newBlockFilter'
    })

    t.assert(
      /0x.+/.test(ethNewBlockFilter.result),
      'New id should be created for new block filter'
    )

    await waitForMillisecondsAsync(1000)

    const ethGetFilterChanges = await loomProvider.sendAsync({
      id: 12,
      method: 'eth_getFilterChanges',
      params: [ethNewBlockFilter.result]
    })

    t.assert(
      ethGetFilterChanges.result.length > 0,
      'Should return the hash for a new block created'
    )

    console.log('Hash for the latest block is:', ethGetFilterChanges.result)

    const ethGetBlockByHash = await loomProvider.sendAsync({
      id: 13,
      method: 'eth_getBlockByHash',
      params: [ethGetFilterChanges.result[0], true]
    })

    t.assert(ethGetBlockByHash.result, 'Should return the block requested by hash')

    client.disconnect()
  } catch (err) {
    console.log(err)
  }

  t.end()
})
