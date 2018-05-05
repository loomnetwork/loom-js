// FIXME: For whatever reason TypeScript is unable to load these typings properly...
declare module 'rpc-websockets' {
  interface IClientOptions {
    autoconnect: boolean
    reconnect: boolean
    reconnect_interval: number
    max_reconnects: number
  }

  export class Client {
    constructor(
      address: string,
      options?: IClientOptions,
      generate_request_id?: (method: string, params: any) => string
    )
    call<T>(method: string, params?: any, timeout?: number, options?: any): Promise<T>
  }
}
