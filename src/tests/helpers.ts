import { Client } from '../client'

export function getTestUrls() {
  return {
    writeUrl: process.env.TEST_LOOM_DAPP_WRITE_URL || 'ws://127.0.0.1:46657/websocket',
    readUrl: process.env.TEST_LOOM_DAPP_READ_URL || 'ws://127.0.0.1:9999/queryws'
  }
}

/**
 * Creates a client for tests, the default read/write URLs can be overriden by setting the env vars
 * TEST_LOOM_DAPP_WRITE_URL and TEST_LOOM_DAPP_READ_URL. These env vars can be set by modifying
 * the .env.test (see .env.test.example for default values).
 */
export function createTestClient(): Client {
  return new Client('default', getTestUrls().writeUrl, getTestUrls().readUrl)
}
