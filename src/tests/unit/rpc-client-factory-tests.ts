import test from 'tape'

import { createJSONRPCClient } from '../../index'
import { HTTPRPCClient } from '../../internal/http-rpc-client'
import { WSRPCClient } from '../../internal/ws-rpc-client'
import { DualRPCClient } from '../../internal/dual-rpc-client'
import { RPCClientEvent } from '../../internal/json-rpc-client'

test('RPC Client Factory', t => {
  try {
    const autoConnect = false

    let client = createJSONRPCClient({ protocols: [{ url: 'http://localhost' }], autoConnect })
    t.ok(client instanceof HTTPRPCClient, 'Should create HTTPRPCClient for http url')

    client = createJSONRPCClient({ protocols: [{ url: 'https://localhost' }], autoConnect })
    t.ok(client instanceof HTTPRPCClient, 'Should create HTTPRPCClient for https url')

    client = createJSONRPCClient({ protocols: [{ url: 'ws://localhost' }], autoConnect })
    t.ok(client instanceof WSRPCClient, 'Should create WSRPCClient for ws url')

    client = createJSONRPCClient({ protocols: [{ url: 'wss://localhost' }], autoConnect })
    t.ok(client instanceof WSRPCClient, 'Should create WSRPCClient for wss url')

    client = createJSONRPCClient({
      protocols: [{ url: 'http://localhost' }, { url: 'ws://localhost' }],
      autoConnect
    })
    t.ok(client instanceof DualRPCClient, 'Should create DualRPCClient for http + ws urls')

    client = createJSONRPCClient({
      protocols: [{ url: 'https://localhost' }, { url: 'wss://localhost' }],
      autoConnect
    })
    t.ok(client instanceof DualRPCClient, 'Should create DualRPCClient for https + wss urls')

    client = createJSONRPCClient({
      protocols: [{ url: 'http://localhost' }, { url: 'wss://localhost' }],
      autoConnect
    })
    t.ok(client instanceof DualRPCClient, 'Should create DualRPCClient for http + wss urls')

    client = createJSONRPCClient({
      protocols: [{ url: 'https://localhost' }, { url: 'ws://localhost' }],
      autoConnect
    })
    t.ok(client instanceof DualRPCClient, 'Should create DualRPCClient for https + ws urls')
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
