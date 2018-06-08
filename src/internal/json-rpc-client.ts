import EventEmitter from 'events'

export interface IJSONRPCError {
  code: number
  message: string
  data: any
}

export interface IJSONRPCRequest {
  jsonrpc: '2.0'
  method: string
  params?: any
  id?: string
}

export interface IJSONRPCResultResponse<T> {
  jsonrpc: '2.0'
  result: T
  id: string
}

export interface IJSONRPCErrorResponse {
  jsonrpc: '2.0'
  error: IJSONRPCError
  id: string
}

export interface IJSONRPCResponse<T> extends IJSONRPCResultResponse<T>, IJSONRPCErrorResponse {}

export enum JSONRPCProtocol {
  HTTP = 0,
  WS = 1
}

export enum RPCClientEvent {
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
 * Sends JSON-RPC messages.
 */
export interface IJSONRPCClient extends EventEmitter {
  url: string
  requestTimeout: number
  isSubscribed: boolean

  disconnect(): void
  ensureConnectionAsync(): Promise<void>
  sendAsync<T>(method: string, params: object | any[]): Promise<T>
}
