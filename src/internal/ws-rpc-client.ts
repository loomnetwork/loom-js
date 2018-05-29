import { Client as WSClient } from 'rpc-websockets'
import { EventEmitter } from 'events'

export interface IEventData {
  caller: {
    ChainID: string
    Local: string
  }
  address: {
    ChainID: string
    Local: string
  }
  blockHeight: string
  encodedData: string
}

export type WSRPCClientEventListener = (eventArgs: IEventData) => void

/**
 * Sends JSON-RPC messages via web sockets.
 */
export class WSRPCClient {
  private _client: WSClient
  private _openPromise?: Promise<void>
  private _rpcId: number = 0
  private _subscribers: Array<WSRPCClientEventListener> = []

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
    this._onEventMessage = this._onEventMessage.bind(this)
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

  async subscribeAsync(listener: WSRPCClientEventListener): Promise<void> {
    if (this._subscribers.indexOf(listener) !== -1) {
      return
    }
    this._subscribers.push(listener)
    if (this._subscribers.length === 1) {
      // rpc-websockets is just going to throw away the event messages from the DAppChain because
      // they don't conform to it's idea of notifications or events... fortunately few things in
      // javascript are truly private... so we'll just handle those event message ourselves ;)
      ;((this._client as any).socket as EventEmitter).on('message', this._onEventMessage)
    }
    await this.sendAsync('subevents', {})
  }

  async unsubscribeAsync(listener: WSRPCClientEventListener): Promise<void> {
    const idx = this._subscribers.indexOf(listener)
    if (idx !== -1) {
      this._subscribers.splice(idx, 1)
    }
    if (this._subscribers.length === 0) {
      ;((this._client as any).socket as EventEmitter).removeListener(
        'message',
        this._onEventMessage
      )
      await this.sendAsync('unsubevents', {})
    }
  }

  private _onEventMessage(message: string | ArrayBuffer) {
    let msgStr = message instanceof ArrayBuffer ? Buffer.from(message).toString() : message
    const msg = JSON.parse(msgStr)
    if (msg.id === '0') {
      if (msg.error) {
        // TODO: should let end-users decide if this should be logged or not
        console.log(`JSON-RPC Error ${msg.error.code} (${msg.error.message}): ${msg.error.data}`)
      } else {
        this._subscribers.forEach(listener => listener(msg.result))
      }
    }
  }
}
