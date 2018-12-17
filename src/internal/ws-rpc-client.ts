import { Client as WSClient } from 'rpc-websockets'
import { EventEmitter } from 'events'
import debug from 'debug'

import { IJSONRPCError, RPCClientEvent } from './json-rpc-client'

const log = debug('ws-rpc-client')

export interface IEventData {
  caller: {
    chain_id: string
    local: string
  }
  address: {
    chain_id: string
    local: string
  }
  block_height: string
  encoded_body: string
  tx_hash: string
  topics: Array<string>
}

export interface IJSONRPCEvent {
  id: string
  error?: IJSONRPCError
  result?: IEventData
}

/**
 * Sends JSON-RPC messages via web sockets.
 */
export class WSRPCClient extends EventEmitter {
  private _client: WSClient
  private _isSubcribed: boolean = false

  protected _rpcId: number = 0
  protected _getNextRequestId = () => (++this._rpcId).toString()

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
      autoConnect?: boolean
      requestTimeout?: number
      reconnectInterval?: number
      maxReconnects?: number
      generateRequestId?: (method: string, params: object | any[]) => string
    } = {}
  ) {
    super()
    const {
      autoConnect = true,
      requestTimeout = 15000, // 15s
      reconnectInterval,
      maxReconnects = 0, // 0 means there is no limit
      generateRequestId = this._getNextRequestId
    } = opts

    this._client = new WSClient(
      url,
      {
        autoconnect: autoConnect,
        reconnect: true,
        reconnect_interval: reconnectInterval,
        max_reconnects: maxReconnects
      },
      generateRequestId
    )

    this.requestTimeout = requestTimeout

    this.on('newListener', (event: string) => {
      if (event === RPCClientEvent.Message && this.listenerCount(event) === 0) {
        // rpc-websockets is just going to throw away the event messages from the DAppChain because
        // they don't conform to it's idea of notifications or events... fortunately few things in
        // javascript are truly private... so we'll just handle those event message ourselves ;)
        ;((this._client as any).socket as EventEmitter).on('message', this._onEventMessage)
        if (this._client.ready) {
          log('Subscribe for events without topics')
          this._client
            .call('subevents', { topics: null }, this.requestTimeout)
            .then(() => {
              this._isSubcribed = true
              this.emit(RPCClientEvent.Subscribed, this.url, true)
            })
            .catch(err => this.emit(RPCClientEvent.Error, this.url, err))
        }
      }

      if (event === RPCClientEvent.EVMMessage && this.listenerCount(event) === 0) {
        ;((this._client as any).socket as EventEmitter).on('message', this._onEventMessage)
      }
    })

    this.on('removeListener', (event: string) => {
      if (event === RPCClientEvent.Message && this.listenerCount(event) === 0) {
        ;((this._client as any).socket as EventEmitter).removeListener(
          'message',
          this._onEventMessage
        )
        if (this._client.ready) {
          log('Unsubscribed for events')
          this._client
            .call('unsubevents', { topics: null }, this.requestTimeout)
            .then(() => {
              this._isSubcribed = false
              this.emit(RPCClientEvent.Subscribed, this.url, false)
            })
            .catch(err => {
              this.emit(RPCClientEvent.Error, this.url, err)
            })
        }
      }

      if (event === RPCClientEvent.EVMMessage && this.listenerCount(event) === 0) {
        ;((this._client as any).socket as EventEmitter).removeListener(
          'message',
          this._onEventMessage
        )
      }
    })

    this._client.on('open', () => {
      this.emit(RPCClientEvent.Connected, this.url)
      if (this.listenerCount(RPCClientEvent.Message) > 0) {
        log('Subscribe for events without topics')
        this._client
          .call('subevents', { topics: null }, this.requestTimeout)
          .then(() => {
            this._isSubcribed = true
            this.emit(RPCClientEvent.Subscribed, this.url, true)
          })
          .catch(err => this.emit(RPCClientEvent.Error, this.url, err))
      }
    })
    this._client.on('close', () => {
      if (this.listenerCount(RPCClientEvent.Message) > 0) {
        this._isSubcribed = false
        this.emit(RPCClientEvent.Subscribed, this.url, false)
      }
      this.emit(RPCClientEvent.Disconnected, this.url)
    })
    this._client.on('error', err => this.emit(RPCClientEvent.Error, this.url, err))
  }

  /**
   * Gracefully closes the underlying web socket connection.
   */
  disconnect() {
    // if `max_reconnects` is zero the client will attempt to reconnect even if `reconnect` is `false`,
    // this seems like a bug in rpc-websockets, but the workaround is simple enough...
    this._client.max_reconnects = 1
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
    log(`Sending RPC msg to ${this.url}, method ${method}`)
    return this._client.call<T>(method, params, this.requestTimeout)
  }

  private _onEventMessage = (message: string | ArrayBuffer): void => {
    const msgStr = message instanceof ArrayBuffer ? Buffer.from(message).toString() : message
    const msg = JSON.parse(msgStr)

    // Events from native loomchain have the id equals 0
    if (msg.id === '0') {
      log('Loom Event arrived', msg)
      this.emit(RPCClientEvent.Message, this.url, msg)
    }

    // Events from EVM have the id from the evmsubscribe command
    if (/^0x.+$/.test(msg.id)) {
      log('EVM Event arrived', msg)
      this.emit(RPCClientEvent.EVMMessage, this.url, msg)
    }
  }
}
