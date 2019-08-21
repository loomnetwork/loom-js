import { Client, createJSONRPCClient } from '../index'

export function getTestUrls() {
  return {
    wsWriteUrl: process.env.TEST_LOOM_DAPP_WS_WRITE_URL || 'ws://127.0.0.1:46658/websocket',
    wsReadUrl: process.env.TEST_LOOM_DAPP_WS_READ_URL || 'ws://127.0.0.1:46658/eth',
    httpWriteUrl: process.env.TEST_LOOM_DAPP_HTTP_WRITE_URL || 'http://127.0.0.1:46658/rpc',
    httpReadUrl: process.env.TEST_LOOM_DAPP_HTTP_READ_URL || 'http://127.0.0.1:46658/eth'
  }
}

/**
 * Creates a client for tests, the default read/write URLs can be overridden by setting the env vars
 * TEST_LOOM_DAPP_WRITE_URL and TEST_LOOM_DAPP_READ_URL. These env vars can be set by modifying
 * the .env.test (see .env.test.example for default values).
 */
export function createTestClient(): Client {
  return new Client('default', getTestUrls().wsWriteUrl, getTestUrls().wsReadUrl)
}

export function createLegacyTestClient(): Client {
  return new Client(
    'default',
    getTestUrls().wsWriteUrl,
    getTestUrls().wsReadUrl.replace(/eth$/, 'queryws')
  )
}

export function createTestHttpClient(): Client {
  const writer = createJSONRPCClient({ protocols: [{ url: getTestUrls().httpWriteUrl }] })
  const reader = createJSONRPCClient({ protocols: [{ url: getTestUrls().httpReadUrl }] })
  return new Client('default', writer, reader)
}

export function createTestWSClient(): Client {
  const writer = createJSONRPCClient({ protocols: [{ url: getTestUrls().wsWriteUrl }] })
  const reader = createJSONRPCClient({ protocols: [{ url: getTestUrls().wsReadUrl }] })
  return new Client('default', writer, reader)
}

export function createTestHttpWSClient(): Client {
  const writer = createJSONRPCClient({ protocols: [{ url: getTestUrls().httpWriteUrl }] })
  const reader = createJSONRPCClient({
    protocols: [{ url: getTestUrls().httpReadUrl }, { url: getTestUrls().wsReadUrl }]
  })
  return new Client('default', writer, reader)
}

export function waitForMillisecondsAsync(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}

export async function execAndWaitForMillisecondsAsync(fn: Promise<any>, ms: number = 2000) {
  const ret = await fn
  await waitForMillisecondsAsync(ms)
  return ret
}
