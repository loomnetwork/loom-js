import test from 'tape'

import { WSRPCClient } from '../../internal/ws-rpc-client'
import { RPCClientEvent } from '../../internal/json-rpc-client'
import { getTestUrls } from '../helpers'
import { DualRPCClient } from '../../internal/dual-rpc-client'

function closeSocket(client: WSRPCClient) {
  ;(client as any)._client.close(3000)
}

function ensureSubscriptionAsync(client: WSRPCClient): Promise<void> {
  if (client.isSubscribed) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Timeout waiting for subscription')),
      client.requestTimeout
    )
    client.once(RPCClientEvent.Subscribed, (url: string, isSubscribed: boolean) => {
      clearTimeout(timeout)
      if (isSubscribed) {
        resolve()
      } else {
        reject(new Error('Subscription inactive'))
      }
    })
  })
}

function ensureUnsubscriptionAsync(client: WSRPCClient): Promise<void> {
  if (!client.isSubscribed) {
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Timeout waiting for unsubscription')),
      client.requestTimeout
    )
    client.once(RPCClientEvent.Subscribed, (url: string, isSubscribed: boolean) => {
      clearTimeout(timeout)
      if (!isSubscribed) {
        resolve()
      } else {
        reject(new Error('Subscription active'))
      }
    })
  })
}

async function testClientOnlyMaintainsEventSubscriptionWhenListenersExist(
  t: test.Test,
  client: WSRPCClient
) {
  client.on(RPCClientEvent.Error, (url: string, err: any) => {
    t.error(err)
  })
  await client.ensureConnectionAsync()
  const listener = () => {}
  client.on(RPCClientEvent.Message, listener)
  await ensureSubscriptionAsync(client)
  t.ok(client.isSubscribed, 'Should auto-subscribe to DAppChain events')
  client.removeListener(RPCClientEvent.Message, listener)
  await ensureUnsubscriptionAsync(client)
  t.ok(!client.isSubscribed, 'Should auto-unsubscribe from DAppChain events')
}

async function testClientReestablishedEventSubscriptionAfterReconnect(
  t: test.Test,
  client: WSRPCClient
) {
  client.on(RPCClientEvent.Error, (url: string, err: any) => {
    t.error(err)
  })
  await client.ensureConnectionAsync()
  const listener = () => {}
  client.on(RPCClientEvent.Message, listener)
  await ensureSubscriptionAsync(client)
  closeSocket(client)
  await ensureUnsubscriptionAsync(client)
  await client.ensureConnectionAsync()
  await ensureSubscriptionAsync(client)
  t.ok(client.isSubscribed, 'Should auto-subscribe to DAppChain events after reconnect')
}

test('WSRPCClient', async t => {
  let client: WSRPCClient | null = null

  try {
    client = new WSRPCClient(getTestUrls().wsReadUrl, { requestTimeout: 1000 })
    await testClientOnlyMaintainsEventSubscriptionWhenListenersExist(t, client)
    client.disconnect()

    client = new WSRPCClient(getTestUrls().wsReadUrl, {
      requestTimeout: 2000,
      reconnectInterval: 100
    })
    await testClientReestablishedEventSubscriptionAfterReconnect(t, client)
  } catch (err) {
    t.fail(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})

test('DualRPCClient', async t => {
  let client: DualRPCClient | null = null

  try {
    client = new DualRPCClient({
      httpUrl: getTestUrls().httpReadUrl,
      wsUrl: getTestUrls().wsReadUrl,
      requestTimeout: 1000
    })
    await testClientOnlyMaintainsEventSubscriptionWhenListenersExist(t, client!)
    client.disconnect()

    client = new DualRPCClient({
      httpUrl: getTestUrls().httpReadUrl,
      wsUrl: getTestUrls().wsReadUrl,
      requestTimeout: 2000,
      reconnectInterval: 100
    })

    await testClientReestablishedEventSubscriptionAfterReconnect(t, client!)
  } catch (err) {
    t.fail(err)
  }

  if (client) {
    client.disconnect()
  }

  t.end()
})
