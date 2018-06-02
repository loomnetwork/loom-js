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

export interface IJSONRPCError {
  code: number
  message: string
  data: any
}

export interface IJSONRPCEvent {
  error?: IJSONRPCError
  result?: IEventData
}

export type WSRPCClientEventListener = (event: IJSONRPCEvent) => void

export enum WSRPCClientEvent {
  /** Emitted when a connection is established with the server. */
  Connected = 'connected',
  /** Emitted when the connection to the server is closed down. */
  Disconnected = 'disconnected',
  /** Emitted when an error is encountered that can't be propagated in a more sensible fashion. */
  Error = 'error',
  /** Emitted when an event message (not a response message) is received from the server. */
  Message = 'message',
  /**
   * Emitted when chain events subscription status changes.
   * Listener will receive a single boolean value, `true` indicates that the event subscription is
   * active, `false` indicates that it's inactive.
   */
  Subscribed = 'subscribed'
}

/**
 * Sends JSON-RPC messages via web sockets.
 */
export class WSRPCClient extends EventEmitter {
  private _client: WSClient
  private _rpcId: number = 0
  private _isSubcribed: boolean = false

  private _getNextRequestId = () => (++this._rpcId).toString()

  requestTimeout: number

  get isSubscribed(): boolean {
    return this._isSubcribed
  }

  /**
   *
   * @param url
   * @param opts Options object
   * @param opts.requestTimeout Number of milliseconds to wait for a network operation to complete.
   * @param opts.reconnectInterval Number of milliseconds to wait before attempting to reconnect
   *                               (in case the connection drops out).
   * @param opts.maxReconnects Maximum number of times to reconnect, defaults to infinity.
   */
  constructor(
    public url: string,
    opts: {
      requestTimeout?: number
      reconnectInterval?: number
      maxReconnects?: number
      generateRequestId?: (method: string, params: object | any[]) => string
    } = {}
  ) {
    super()
    const {
      requestTimeout = 15000, // 15s
      reconnectInterval,
      maxReconnects = 0, // 0 means there is no limit
      generateRequestId = this._getNextRequestId
    } = opts

    this._client = new WSClient(
      url,
      {
        autoconnect: true,
        reconnect: true,
        reconnect_interval: reconnectInterval,
        max_reconnects: maxReconnects
      },
      generateRequestId
    )

    this.requestTimeout = requestTimeout

    this.on('newListener', (event: string) => {
      if (event === WSRPCClientEvent.Message && this.listenerCount(event) === 0) {
        // rpc-websockets is just going to throw away the event messages from the DAppChain because
        // they don't conform to it's idea of notifications or events... fortunately few things in
        // javascript are truly private... so we'll just handle those event message ourselves ;)
        ;((this._client as any).socket as EventEmitter).on('message', this._onEventMessage)
        if (this._client.ready) {
          this._client
            .call('subevents', {}, this.requestTimeout)
            .then(() => {
              this._isSubcribed = true
              this.emit(WSRPCClientEvent.Subscribed, true)
            })
            .catch(err => this.emit(WSRPCClientEvent.Error, err))
        }
      }
    })

    this.on('removeListener', (event: string) => {
      if (event === WSRPCClientEvent.Message && this.listenerCount(event) === 0) {
        ;((this._client as any).socket as EventEmitter).removeListener(
          'message',
          this._onEventMessage
        )
        if (this._client.ready) {
          this._client
            .call('unsubevents', {}, this.requestTimeout)
            .then(() => {
              this._isSubcribed = false
              this.emit(WSRPCClientEvent.Subscribed, false)
            })
            .catch(err => this.emit(WSRPCClientEvent.Error, err))
        }
      }
    })

    this._client.on('open', () => {
      this.emit(WSRPCClientEvent.Connected)
      if (this.listenerCount(WSRPCClientEvent.Message) > 0) {
        this._client
          .call('subevents', {}, this.requestTimeout)
          .then(() => {
            this._isSubcribed = true
            this.emit(WSRPCClientEvent.Subscribed, true)
          })
          .catch(err => this.emit(WSRPCClientEvent.Error, err))
      }
    })
    this._client.on('close', () => {
      if (this.listenerCount(WSRPCClientEvent.Message) > 0) {
        this._isSubcribed = false
        this.emit(WSRPCClientEvent.Subscribed, false)
      }
      this.emit(WSRPCClientEvent.Disconnected)
    })
    this._client.on('error', err => this.emit(WSRPCClientEvent.Error, err))
  }

  /**
   * Gracefully closes the underlying web socket connection.
   */
  disconnect() {
    this._client.reconnect = false
    this._client.close(0)
  }

  /**
   * Waits for a connection to be established to the server (if it isn't already).
   * @returns A promise that will be resolved when a connection is established.
   */
  ensureConnectionAsync(): Promise<void> {
    if (this._client.ready) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('[WSRPCClient] Timeout while waiting for connection')),
        this.requestTimeout
      )
      this._client.once('open', () => {
        clearTimeout(timeout)
        resolve()
      })
    })
  }

  /**
   * Sends a JSON-RPC message.
   * @param method RPC method name.
   * @param params Parameter object or array.
   * @returns A promise that will be resolved with the value of the result field (if any) in the
   *          JSON-RPC response message.
   */
  async sendAsync<T>(method: string, params: object | any[]): Promise<T> {
    await this.ensureConnectionAsync()
    console.log(`Sending RPC msg to ${this.url}, method ${method}`)
    return this._client.call<T>(method, params, this.requestTimeout)
  }

  private _onEventMessage = (message: string | ArrayBuffer): void => {
    const msgStr = message instanceof ArrayBuffer ? Buffer.from(message).toString() : message
    const msg = JSON.parse(msgStr)
    if (msg.id === '0') {
      this.emit(WSRPCClientEvent.Message, msg)
    }
  }
}
