import { Client as WSClient } from 'rpc-websockets'

/**
 * Sends JSON-RPC messages via web sockets.
 */
export class WSRPCClient {
  private _client: WSClient
  private _openPromise?: Promise<void>
  private _rpcId: number = 0

  private _getNextRequestId = () => (++this._rpcId).toString()

  constructor(
    public url: string,
    opts: {
      autoConnect?: boolean
      reconnect?: boolean
      reconnectInterval?: number
      maxReconnects?: number
      generateRequestId?: (method: string, params: object | any[]) => string
    } = {}
  ) {
    this._client = new WSClient(
      url,
      {
        autoconnect: opts.autoConnect,
        reconnect: opts.reconnect,
        reconnect_interval: opts.reconnectInterval,
        max_reconnects: opts.maxReconnects
      },
      opts.generateRequestId || this._getNextRequestId
    )
  }

  /**
   * Gracefully closes the underlying web socket connection.
   */
  disconnect() {
    this._client.close(0)
  }

  private _ensureConnectionAsync(): Promise<void> {
    if (this._client.ready) {
      return Promise.resolve()
    }
    if (!this._openPromise) {
      this._openPromise = new Promise((resolve, reject) => {
        this._client.on('open', () => resolve())
        this._client.on('error', err => {
          console.log(err)
          reject(err)
        })
      })
    }
    return this._openPromise
  }

  /**
   * Sends a JSON-RPC message.
   * @param method RPC method name.
   * @param params Parameter object or array.
   * @returns A promise that will be resolved with the value of the result field (if any) in the
   *          JSON-RPC response message.
   */
  async sendAsync<T>(method: string, params: object | any[]): Promise<T> {
    await this._ensureConnectionAsync()
    console.log(`Sending RPC msg to ${this.url}, method ${method}`)
    return this._client.call<T>(method, params)
  }
}
