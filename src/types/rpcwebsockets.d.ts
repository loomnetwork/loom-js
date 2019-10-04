// FIXME: For whatever reason TypeScript is unable to load these typings properly...
declare module 'rpc-websockets' {
  interface IClientOptions {
    autoconnect?: boolean
    reconnect?: boolean
    reconnect_interval?: number
    max_reconnects?: number
  }

  export class Client {
    ready: boolean
    reconnect: boolean
    max_reconnects: number

    constructor(
      address: string,
      options?: IClientOptions,
      generate_request_id?: (method: string, params: object | any[]) => string | number
    )
    call<T>(method: string, params?: any, timeout?: number, options?: any): Promise<T>
    on(event: string, listener: (...args: any[]) => void): this
    once(event: string, listener: (...args: any[]) => void): this
    close(code: number, data?: string): void
  }
}
