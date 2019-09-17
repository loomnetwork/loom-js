import test from 'tape'

import { LocalAddress, CryptoUtils } from '../../index'
import { createTestClient, execAndWaitForMillisecondsAsync } from '../helpers'
import { LoomProvider } from '../../loom-provider'
import { deployContract } from '../evm-helpers'
import { SimpleStore } from '../contracts_bytecode'

test('LoomProvider + Subscribe', async t => {
  let client
  try {
    const privKey = CryptoUtils.generatePrivateKey()
    client = createTestClient()
    client.on('error', msg => console.error('error', msg))
    const fromAddr = LocalAddress.fromPublicKey(
      CryptoUtils.publicKeyFromPrivateKey(privKey)
    ).toString()
    const loomProvider = new LoomProvider(client, privKey)

    const contractDeployResult = await deployContract(loomProvider, SimpleStore)
    const id = 1

    const ethSubscribeNewHardsResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_subscribe',
        params: ['newHeads', {}]
      })
    )

    t.equal(ethSubscribeNewHardsResult.id, id, `Id for eth_subscribe should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethSubscribeNewHardsResult.result),
      'Filter identification should be returned on eth_subscribe'
    )

    const ethUnsubscribeNewHeadsResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_unsubscribe',
        params: [ethSubscribeNewHardsResult.result]
      })
    )

    t.equal(ethUnsubscribeNewHeadsResult.id, id, `Id for eth_unsubscribe should be equal ${id}`)
    t.assert(ethUnsubscribeNewHeadsResult.result, 'Unsubscribed for newHeads')

    const ethSubscribeLogsResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_subscribe',
        params: ['logs', {}]
      })
    )

    t.equal(ethSubscribeLogsResult.id, id, `Id for eth_subscribe should be equal ${id}`)
    t.assert(
      /0x.+/.test(ethSubscribeLogsResult.result),
      'Filter identification should be returned on eth_subscribe'
    )

    const ethUnsubscribeLogsResult = await execAndWaitForMillisecondsAsync(
      loomProvider.sendAsync({
        id,
        method: 'eth_unsubscribe',
        params: [ethSubscribeLogsResult.result]
      })
    )

    t.equal(ethUnsubscribeLogsResult.id, id, `Id for eth_unsubscribe should be equal ${id}`)
    t.assert(ethUnsubscribeLogsResult.result, 'Unsubscribed for Logs')
  } catch (err) {
    console.log(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})
