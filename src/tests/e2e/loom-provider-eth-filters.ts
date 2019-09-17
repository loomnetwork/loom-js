import test from 'tape'

import { CryptoUtils } from '../../index'
import { createTestClient, execAndWaitForMillisecondsAsync } from '../helpers'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { SimpleStore } from '../contracts_bytecode'

test('LoomProvider + Filters', async t => {
  let client

  try {
    const privKey = CryptoUtils.generatePrivateKey()
    client = createTestClient()
    client.on('error', msg => console.error('Error on client:', msg))
    const loomProvider = new LoomProvider(client, privKey)

    await deployContract(loomProvider, SimpleStore)

    // Transaction receipt in order to obtain the topic of the event NewValueSet
    const ethNewFilterResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id: 10,
        method: 'eth_newFilter',
        params: [{ toBlock: 'latest' }]
      })
    )

    t.assert(/0x.+/.test(ethNewFilterResult.result), 'New id should be created for new filter')

    const ethNewBlockFilter = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id: 11,
        method: 'eth_newBlockFilter'
      })
    )

    t.assert(
      /0x.+/.test(ethNewBlockFilter.result),
      'New id should be created for new block filter'
    )

    const ethGetFilterChanges = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id: 12,
        method: 'eth_getFilterChanges',
        params: [ethNewBlockFilter.result]
      })
    )

    t.assert(
      ethGetFilterChanges.result.length > 0,
      'Get filter changes should return array with new blocks'
    )

    const ethUninstallFilterResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id: 13,
        method: 'eth_uninstallFilter',
        params: [ethNewBlockFilter.result]
      })
    )

    t.deepEqual(ethUninstallFilterResult.result, true, 'Should uninstall filter and return true')
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})
