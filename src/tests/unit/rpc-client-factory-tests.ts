import test from 'tape'

import { createJSONRPCClient } from '../../index'
import { HTTPRPCClient } from '../../internal/http-rpc-client'
import { WSRPCClient } from '../../internal/ws-rpc-client'
import { DualRPCClient } from '../../internal/dual-rpc-client'
import { RPCClientEvent } from '../../internal/json-rpc-client'

test('createJSONRPCClient should create HTTPRPCClient for http/s urls', t => {
  t.plan(2)
  try {
    const autoConnect = false
    let client = createJSONRPCClient({ protocols: [{ url: 'http://localhost' }], autoConnect })
    t.ok(client instanceof HTTPRPCClient, 'HTTPRPCClient created')

    client = createJSONRPCClient({ protocols: [{ url: 'https://localhost' }], autoConnect })
    t.ok(client instanceof HTTPRPCClient, 'HTTPRPCClient created')
  } catch (err) {
    t.fail(err)
  }
  t.end()
})

test('createJSONRPCClient should create WSRPCClient for ws/s url', t => {
  t.plan(2)
  try {
    const autoConnect = false
    let client = createJSONRPCClient({ protocols: [{ url: 'ws://localhost' }], autoConnect })
    t.ok(client instanceof WSRPCClient, 'WSRPCClient created')

    client = createJSONRPCClient({ protocols: [{ url: 'wss://localhost' }], autoConnect })
    t.ok(client instanceof WSRPCClient, 'WSRPCClient created')
  } catch (err) {
    t.fail(err)
  }
  t.end()
})

test('createJSONRPCClient should create DualRPCClient for http/s & ws/s urls', t => {
  t.plan(2)
  try {
    const autoConnect = false
    let client = createJSONRPCClient({
      protocols: [{ url: 'http://localhost' }, { url: 'ws://localhost' }],
      autoConnect
    })
    t.ok(client instanceof DualRPCClient, 'DualRPCClient created')

    client = createJSONRPCClient({
      protocols: [{ url: 'https://localhost' }, { url: 'wss://localhost' }],
      autoConnect
    })
    t.ok(client instanceof DualRPCClient, 'DualRPCClient created')
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
