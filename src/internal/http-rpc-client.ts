import axios from 'axios'
import EventEmitter from 'events'
import debug from 'debug'

import {
  IJSONRPCRequest,
  IJSONRPCResponse,
  IJSONRPCClient
} from './json-rpc-client'

const log = debug('http-rpc-client')

/**
 * Sends JSON-RPC messages via HTTP.
 * Doesn't support listening to DAppChain events at the moment.
 */
export class HTTPRPCClient extends EventEmitter implements IJSONRPCClient {
  private _rpcId: number = 0
  private _getNextRequestId = () => (++this._rpcId).toString()

  requestTimeout: number

  get isSubscribed(): boolean {
    return false
  }

  /**
   *
   * @param url
   * @param opts Options object
   * @param opts.requestTimeout Number of milliseconds to wait for a network operation to complete.
   */
  constructor(
    public url: string,
    opts: {
      requestTimeout?: number
      generateRequestId?: (method: string, params: object | any[]) => string
    } = {}
  ) {
    super()
    const {
      requestTimeout = 15000, // 15s
      generateRequestId = this._getNextRequestId
    } = opts

    this.requestTimeout = requestTimeout
  }

  disconnect() {
    // no persistent connection, so do nothing
  }

  ensureConnectionAsync(): Promise<void> {
    // no persistent connection, so do nothing
    return Promise.resolve()
  }

  /**
   * Sends a JSON-RPC message.
   * @param method RPC method name.
   * @param params Parameter object or array.
   * @returns A promise that will be resolved with the value of the result field (if any) in the
   *          JSON-RPC response message.
   */
  async sendAsync<T>(method: string, params: object | any[]): Promise<T> {
    log(`Sending RPC msg to ${this.url}, method ${method}`)
    const req: IJSONRPCRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id: this._getNextRequestId()
    }
    const resp = await axios.post<IJSONRPCResponse<T>>(this.url, req, {
      timeout: this.requestTimeout
    })
    if (resp.data.error) {
      const { code, message, data } = resp.data.error
      throw new Error(`JSON-RPC Error ${code} (${message}): ${data}`)
    }
    return resp.data.result
  }
}
