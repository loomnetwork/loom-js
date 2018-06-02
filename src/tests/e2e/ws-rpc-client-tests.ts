import test from 'tape'

import { WSRPCClient, WSRPCClientEvent } from '../../internal/ws-rpc-client'
import { getTestUrls } from '../helpers'

function closeSocket(client: WSRPCClient) {
  ;(client as any)._client.close(1001)
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
    client.once(WSRPCClientEvent.Subscribed, (isSubscribed: boolean) => {
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
    client.once(WSRPCClientEvent.Subscribed, (isSubscribed: boolean) => {
      clearTimeout(timeout)
      if (!isSubscribed) {
        resolve()
      } else {
        reject(new Error('Subscription active'))
      }
    })
  })
}

test('WSRPCClient should maintain event sub while there are WSRPCClientEvent.Message listeners', async t => {
  let client: WSRPCClient | null = null
  try {
    client = new WSRPCClient(getTestUrls().readUrl, { requestTimeout: 1000 })

    client.on(WSRPCClientEvent.Error, err => {
      t.error(err)
    })
    await client.ensureConnectionAsync()
    const listener = () => {}
    client.on(WSRPCClientEvent.Message, listener)
    await ensureSubscriptionAsync(client)
    client.removeListener(WSRPCClientEvent.Message, listener)
    await ensureUnsubscriptionAsync(client)
    t.pass('Passed')
  } catch (err) {
    t.fail(err)
  }
  if (client) {
    client.disconnect()
  }
  t.end()
})

test('WSRPCClient should resub to events after reconnect', async t => {
  let client: WSRPCClient | null = null
  try {
    client = new WSRPCClient(getTestUrls().readUrl, {
      requestTimeout: 2000,
      reconnectInterval: 100
    })

    client.on(WSRPCClientEvent.Error, err => {
      t.error(err)
    })
    await client.ensureConnectionAsync()
    const listener = () => {}
    client.on(WSRPCClientEvent.Message, listener)
    await ensureSubscriptionAsync(client)
    closeSocket(client)
    await ensureUnsubscriptionAsync(client)
    await client.ensureConnectionAsync()
    await ensureSubscriptionAsync(client)
    t.pass('Passed')
  } catch (err) {
    t.fail(err)
  }
  if (client) {
    client.disconnect()
  }
  t.end()
})
