import { Client, createJSONRPCClient } from '../index'

export function getTestUrls() {
  return {
    wsWriteUrl: process.env.TEST_LOOM_DAPP_WS_WRITE_URL || 'ws://127.0.0.1:46658/websocket',
    wsReadUrl: process.env.TEST_LOOM_DAPP_WS_READ_URL || 'ws://127.0.0.1:46658/queryws',
    httpWriteUrl: process.env.TEST_LOOM_DAPP_HTTP_WRITE_URL || 'http://127.0.0.1:46658/rpc',
    httpReadUrl: process.env.TEST_LOOM_DAPP_HTTP_READ_URL || 'http://127.0.0.1:46658/query'
  }
}

export function getWeb3TestUrls() {
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

/**
 * Creates a client for tests that use the /eth endpoint to query EVM contracts.
 */
export function createWeb3TestClient(): Client {
  return new Client('default', getWeb3TestUrls().wsWriteUrl, getWeb3TestUrls().wsReadUrl)
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

export async function execAndWaitForMillisecondsAsync(promise: Promise<any>, ms: number = 2000) {
  try {
    const ret = await promise
    await waitForMillisecondsAsync(ms)
    return ret
  } catch (e) {
    console.error(e)
    throw e
  }
}

export function rejectOnTimeOut<T>(promise: Promise<T>, ms: number = 10000) {
  const timeout = new Promise<T>((_, reject) => setTimeout(reject, ms))
  return Promise.race([promise, timeout])
}
