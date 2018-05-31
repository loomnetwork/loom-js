import { Client } from '../client'

/**
 * Creates a client for tests, the default read/write URLs can be overriden by setting the env vars
 * TEST_LOOM_DAPP_WRITE_URL and TEST_LOOM_DAPP_READ_URL.
 */
export function createTestClient(): Client {
  return new Client(
    'default',
    process.env.TEST_LOOM_DAPP_WRITE_URL || 'ws://127.0.0.1:46657/websocket',
    process.env.TEST_LOOM_DAPP_READ_URL || 'ws://127.0.0.1:9999/queryws'
  )
}
