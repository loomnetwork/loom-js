import { JSONRPCProtocol, IJSONRPCClient } from './internal/json-rpc-client'
import { WSRPCClient } from './internal/ws-rpc-client'
import { HTTPRPCClient } from './internal/http-rpc-client'
import { DualRPCClient } from './internal/dual-rpc-client'

export interface IJSONRPCProtocolOptions {
  url: string
  reconnectInterval?: number
  maxReconnects?: number
}

/**
 * Creates an RPC client for communicating with a Loom DAppChain based on the specified options.
 * @param opts Options object
 * @param opts.protocols
 * @param opts.autoConnect If `true` the client will automatically connect after being created,
 *                         defaults to `true` and shouldn't be changed.
 * @param opts.requestTimeout Maximum number of milliseconds the client should wait for a request
 *                            to receive a response.
 * @param opts.generateRequestId Can be set to override the default JSON-RPC message ID generator.
 */
export function createJSONRPCClient(opts: {
  protocols: IJSONRPCProtocolOptions[]
  autoConnect?: boolean
  requestTimeout?: number
  generateRequestId?: (method: string, params: object | any[]) => string
}): IJSONRPCClient {
  const { protocols, autoConnect = true, requestTimeout, generateRequestId } = opts
  if (protocols.length === 1) {
    const { url, ...otherOpts } = protocols[0]
    const protocol = selectProtocol(url)
    if (protocol === JSONRPCProtocol.HTTP) {
      return new HTTPRPCClient(url, { requestTimeout, generateRequestId })
    } else if (protocol === JSONRPCProtocol.WS) {
      return new WSRPCClient(url, { autoConnect, requestTimeout, generateRequestId, ...otherOpts })
    }
  } else if (protocols.length === 2) {
    const p1 = selectProtocol(protocols[0].url)
    const p2 = selectProtocol(protocols[1].url)
    if (p1 === JSONRPCProtocol.HTTP && p2 === JSONRPCProtocol.WS) {
      const { reconnectInterval, maxReconnects } = protocols[1]
      return new DualRPCClient(protocols[0].url, protocols[1].url, {
        autoConnect,
        protocol: p1,
        requestTimeout,
        generateRequestId,
        reconnectInterval,
        maxReconnects
      })
    } else if (p2 === JSONRPCProtocol.HTTP && p1 === JSONRPCProtocol.WS) {
      const { reconnectInterval, maxReconnects } = protocols[0]
      return new DualRPCClient(protocols[1].url, protocols[0].url, {
        autoConnect,
        protocol: p1,
        requestTimeout,
        generateRequestId,
        reconnectInterval,
        maxReconnects
      })
    }
  }
  throw new Error('Failed to create JSON-RPC client: invalid protocol configuration')
}

function selectProtocol(url: string): JSONRPCProtocol {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return JSONRPCProtocol.HTTP
  } else if (url.startsWith('ws://') || url.startsWith('wss://')) {
    return JSONRPCProtocol.WS
  } else {
    throw new Error('Invalid URL')
  }
}
