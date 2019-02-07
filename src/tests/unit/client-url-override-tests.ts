import test from 'tape'

import { Client } from '../../index'
import { parseUrl } from '../../helpers'

test('Client URL Override', t => {
  try {
    const hostname = 'plasma.dappchains.com'
    const readOnlyHostname = 'plasma-readonly.dappchains.com'
    // Client assumes that if the reader/writer are strings they must be websocket URIs, so only
    // test those.
    const clients = [
      new Client('default', `ws://${hostname}/websocket`, `ws://${hostname}/queryws`),
      new Client('default', `wss://${hostname}/websocket`, `wss://${hostname}/queryws`)
    ]
    for (let client of clients) {
      client.on('error', (msg: any) => {
        // don't care about connection errors, just want to validate URL override
      })
      const readUrl = parseUrl(client.readUrl)
      const writeUrl = parseUrl(client.writeUrl)
      t.equal(readUrl.hostname, readOnlyHostname, 'Read URL override was applied')
      t.equal(writeUrl.hostname, hostname, 'Write URL was unchanged')
      client.disconnect()
    }
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
