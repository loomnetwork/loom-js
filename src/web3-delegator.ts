import Web3 from 'web3'
import { WebsocketProvider } from 'web3-providers/types'
import { AbstractMethod } from 'web3-core-method/types'

export class Web3Delegator {
  protected _web3: Web3

  constructor(host: string) {
    // Setting the web3 provider
    if (host.startsWith('http://') || host.startsWith('https://')) {
      this._web3 = new Web3(new Web3.providers.HttpProvider(host))
    } else if (host.startsWith('ws://') || host.startsWith('wss://')) {
      this._web3 = new Web3(new Web3.providers.WebsocketProvider(host))
    } else {
      throw Error('The protocol for endpoint should HTTP or WS')
    }
  }

  // DELEGATING WEB3 WEBSOCKET HANDLERS

  get connected(): boolean {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    return delegatedProvider.connected
  }

  reconnect(): void {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    delegatedProvider.reconnect()
  }

  disconnect(code: number, reason: string) {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    delegatedProvider.disconnect(code, reason)
  }

  removeAllListeners(type: string): void {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    delegatedProvider.removeAllListeners(type)
  }

  isConnecting() {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    return delegatedProvider.isConnecting()
  }

  subscribe(
    subscribeMethod: string,
    subscriptionMethod: string,
    parameters: any[]
  ): Promise<string> {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    return delegatedProvider.subscribe(subscribeMethod, subscriptionMethod, parameters)
  }

  registerEventListeners(): void {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    delegatedProvider.registerEventListeners()
  }

  unsubscribe(subscriptionId: string, unsubscribeMethod: string): Promise<boolean> {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    return delegatedProvider.unsubscribe(subscriptionId, unsubscribeMethod)
  }

  clearSubscriptions(unsubscribeMethod: string): Promise<boolean> {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    return delegatedProvider.clearSubscriptions(unsubscribeMethod)
  }

  on(type: string, callback: () => void) {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    delegatedProvider.on(type, callback)
  }

  removeListener(type: string, callback: () => void): void {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    delegatedProvider.removeListener(type, callback)
  }

  reset(): void {
    const delegatedProvider: WebsocketProvider = this._web3.currentProvider as WebsocketProvider
    delegatedProvider.reset()
  }
}
