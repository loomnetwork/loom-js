import { Message } from 'google-protobuf'
import EventEmitter from 'events'

import { VMType, EvmTxReceipt } from './proto/loom_pb'
import { Uint8ArrayToB64, B64ToUint8Array, bufferToProtobufBytes } from './crypto-utils'
import { Address, LocalAddress } from './address'
import { WSRPCClient, IEventData } from './internal/ws-rpc-client'

interface ITxHandlerResult {
  code?: number
  log?: string // error message if code != 0
  data?: string
}

interface IBroadcastTxCommitResult {
  check_tx: ITxHandlerResult
  deliver_tx: ITxHandlerResult
  hash: string
  height: string // int64
}

/**
 * Middleware handlers are expected to transform the input data and return the result.
 * Handlers should not modify the original input data in any way.
 */
export interface ITxMiddlewareHandler {
  Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array>
}

export enum ClientEvent {
  Contract = 'contractEvent'
}

/**
 * Generic event emitted by smart contracts.
 */
export interface IChainEventArgs {
  // Address of the contract that emitted the event.
  contractAddress: Address
  // Address of the caller that caused the event to be emitted.
  callerAddress: Address
  blockHeight: string
  // The data emitted by the smart contract, the format and structure is defined by that contract.
  data: Uint8Array
}

/**
 * Writes to & reads from a Loom DAppChain.
 *
 * The client can listen to events emitted by smart contracts running on a DAppChain,
 * there is currently only one type of event. The event subscription API matches the NodeJS
 * EventEmitter API. For example...
 *
 * function subscribeToEvents(client: Client) {
 *   client.on(ClientEvent.Contract, (event: IChainEventArgs) => {
 *     // handle event
 *   }
 * }
 */
export class Client extends EventEmitter {
  public readonly chainId: string
  public readonly readUrl?: string
  private _writeClient: WSRPCClient
  private _readClient!: WSRPCClient

  // Middleware to apply to transactions before they are transmitted to the DAppChain.
  txMiddleware: ITxMiddlewareHandler[] = []

  /**
   * Constructs a new client to read & write data from/to a Loom DAppChain.
   * @param chainId DAppChain identifier.
   * @param writeUrl Host & port to send txs, specified as "<protocol>://<host>:<port>".
   * @param readUrl Host & port of the DAppChain read/query interface.
   */
  constructor(chainId: string, writeUrl: string, readUrl?: string) {
    super()
    this.chainId = chainId
    // TODO: basic validation of the URIs to ensure they have all required components.
    this._writeClient = new WSRPCClient(writeUrl)
    if (!readUrl || writeUrl === readUrl) {
      this._readClient = this._writeClient
    } else {
      this.readUrl = readUrl
      this._readClient = new WSRPCClient(readUrl)
    }

    const emitContractEvent = this._emitContractEvent.bind(this)

    this.on('newListener', (event: string) => {
      if (event === ClientEvent.Contract && this.listenerCount(ClientEvent.Contract) === 0) {
        this._readClient.subscribeAsync(emitContractEvent)
      }
    })

    this.on('removeListener', (event: string) => {
      if (event === ClientEvent.Contract && this.listenerCount(ClientEvent.Contract) === 0) {
        this._readClient.unsubscribeAsync(emitContractEvent)
      }
    })
  }

  disconnect() {
    this._writeClient.disconnect()
    if (this._readClient && this._readClient != this._writeClient) {
      this._readClient.disconnect()
    }
  }

  /**
   * Commits a transaction to the DAppChain.
   *
   * Consider using Contract.callAsync() instead.
   *
   * @param tx Transaction to commit.
   * @returns Result (if any) returned by the tx handler in the contract that processed the tx.
   */
  async commitTxAsync<T extends Message>(tx: T): Promise<Uint8Array | void> {
    let txBytes = tx.serializeBinary()
    for (let i = 0; i < this.txMiddleware.length; i++) {
      txBytes = await this.txMiddleware[i].Handle(txBytes)
    }
    const result = await this._writeClient.sendAsync<IBroadcastTxCommitResult>(
      'broadcast_tx_commit',
      [Uint8ArrayToB64(txBytes)]
    )
    if (result) {
      if ((result.check_tx.code || 0) != 0) {
        if (!result.check_tx.log) {
          throw new Error(`Failed to commit Tx: ${result.check_tx.code}`)
        }
        throw new Error(`Failed to commit Tx: ${result.check_tx.log}`)
      }
      if ((result.deliver_tx.code || 0) != 0) {
        if (!result.deliver_tx.log) {
          throw new Error(`Failed to commit Tx: ${result.deliver_tx.code}`)
        }
        throw new Error(`Failed to commit Tx: ${result.deliver_tx.log}`)
      }
    }
    if (result.deliver_tx.data) {
      return B64ToUint8Array(result.deliver_tx.data)
    }
  }

  /**
   * Queries the current state of a contract.
   *
   * Consider using Contract.staticCallAsync() instead.
   */
  async queryAsync(
    contract: Address,
    query?: Uint8Array,
    vmType: VMType = VMType.PLUGIN
  ): Promise<Uint8Array | void> {
    const result = await this._readClient.sendAsync<string>('query', {
      contract: contract.local.toString(),
      query: query ? Uint8ArrayToB64(query) : undefined,
      vmType: vmType
    })
    if (result) {
      return B64ToUint8Array(result)
    }
  }

  /**
   * Queries the receipt corresponding to a transaction hash
   *
   * @param txHash Transaction hash returned by call transaction.
   * @return EvmTxReceipt The corresponding transaction receipt.
   */
  async getTxReceiptAsync(txHash: Uint8Array): Promise<EvmTxReceipt | null> {
    const result = await this._readClient.sendAsync<string>('txreceipt', {
      txHash: Uint8ArrayToB64(txHash)
    })
    if (result) {
      return EvmTxReceipt.deserializeBinary(bufferToProtobufBytes(B64ToUint8Array(result)))
    } else {
      return null
    }
  }

  /**
   * Gets a nonce for the given public key.
   *
   * This should only be called by NonceTxMiddleware.
   *
   * @param key A hex encoded public key.
   * @return The nonce.
   */
  getNonceAsync(key: string): Promise<number> {
    return this._readClient.sendAsync<number>('nonce', { key })
  }

  /**
   * Tries to resolve a contract name to an address.
   *
   * @param contractName Name of a smart contract on a Loom DAppChain.
   * @returns Contract address, or null if a contract matching the given name wasn't found.
   */
  async getContractAddressAsync(contractName: string): Promise<Address | null> {
    const addrStr = await this._readClient.sendAsync<string>('resolve', { name: contractName })
    if (!addrStr) {
      return null
    }
    return Address.fromString(addrStr)
  }

  private _emitContractEvent(event: IEventData) {
    this.emit(ClientEvent.Contract, {
      contractAddress: new Address(
        event.address.ChainID,
        new LocalAddress(B64ToUint8Array(event.address.Local))
      ),
      callerAddress: new Address(
        event.caller.ChainID,
        new LocalAddress(B64ToUint8Array(event.caller.Local))
      ),
      blockHeight: event.blockHeight,
      data: B64ToUint8Array(event.encodedData)
    } as IChainEventArgs)
  }
}
