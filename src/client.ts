import { Message } from 'google-protobuf'
import EventEmitter from 'events'
import retry from 'retry'

import { VMType, EvmTxReceipt, EventData } from './proto/loom_pb'
import { Uint8ArrayToB64, B64ToUint8Array, bufferToProtobufBytes } from './crypto-utils'
import { Address, LocalAddress } from './address'
import { WSRPCClient, WSRPCClientEvent, IJSONRPCEvent } from './internal/ws-rpc-client'

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
  /**
   * Emitted when an event is received from a smart contract.
   * Listener will receive IChainEventArgs.
   */
  Contract = 'contractEvent',
  /**
   * Emitted when an error occurs that can't be relayed by other means.
   * Listener will receive IClientErrorEventArgs.
   */
  Error = 'error',
  /**
   * Emitted when a connection is established to the DAppChain.
   * Listener will receive INetEventArgs.
   */
  Connected = 'connected',
  /**
   * Emitted when a connection with the DAppChain is closed.
   * Listener will receive INetEventArgs.
   */
  Disconnected = 'disconnected'
}

export interface IClientEventArgs {
  kind: ClientEvent
  /** URL that corresponds to the RPC client this event originated from. */
  url: string
}

/**
 * Event that's emitted when some kind of error occurs that can't be relayed by other means,
 * e.g. socket error that occurs while listening for RPC events.
 */
export interface IClientErrorEventArgs extends IClientEventArgs {
  kind: ClientEvent.Error
  /** May contain additional information in case of an RPC error. */
  error?: any // could be IJSONRPCError, or something else
}

/** Generic event containing data emitted by smart contracts. */
export interface IChainEventArgs extends IClientEventArgs {
  kind: ClientEvent.Contract
  /** Address of the contract that emitted the event. */
  contractAddress: Address
  /** Address of the caller that caused the event to be emitted. */
  callerAddress: Address
  /** The block containing the tx that caused this event to be emitted. */
  blockHeight: string
  /**
   * Data that was actually emitted by the smart contract,
   * the format and structure is defined by that contract.
   */
  data: Uint8Array
}

const INVALID_TX_NONCE_ERROR = 'Invalid tx nonce'

export function isInvalidTxNonceError(err: any): boolean {
  return err instanceof Error && err.message === INVALID_TX_NONCE_ERROR
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
  readonly chainId: string

  private _writeClient: WSRPCClient
  private _readClient!: WSRPCClient

  /** Middleware to apply to transactions before they are transmitted to the DAppChain. */
  txMiddleware: ITxMiddlewareHandler[] = []

  /**
   * The retry strategy that should be used to resend a tx when it's rejected because of a bad nonce.
   * Default is a binary exponential retry strategy with 5 retries.
   * To understand how to tweak the retry strategy see
   * https://github.com/tim-kos/node-retry#retrytimeoutsoptions
   */
  nonceRetryStrategy: retry.OperationOptions = {
    retries: 5,
    minTimeout: 500, // 0.5s
    maxTimeout: 5000, // 5s
    randomize: true
  }

  get readUrl(): string {
    return this._readClient.url
  }

  get writeUrl(): string {
    return this._writeClient.url
  }

  /**
   * Constructs a new client to read & write data from/to a Loom DAppChain.
   * @param chainId DAppChain identifier.
   * @param writeUrl Host & port to send txs, specified as "<protocol>://<host>:<port>".
   * @param readUrl Host & port of the DAppChain read/query interface, this should only be provided
   *                if it's not the same as `writeUrl`.
   */
  constructor(chainId: string, writeUrl: string, readUrl?: string) {
    super()
    this.chainId = chainId
    // TODO: basic validation of the URIs to ensure they have all required components.
    this._writeClient = new WSRPCClient(writeUrl)
    this._writeClient.on(WSRPCClientEvent.Connected, () =>
      this._emitNetEvent(writeUrl, ClientEvent.Connected)
    )
    this._writeClient.on(WSRPCClientEvent.Disconnected, () =>
      this._emitNetEvent(writeUrl, ClientEvent.Disconnected)
    )
    this._writeClient.on(WSRPCClientEvent.Error, err =>
      this._emitNetEvent(writeUrl, ClientEvent.Error, err)
    )

    if (!readUrl || writeUrl === readUrl) {
      this._readClient = this._writeClient
    } else {
      this._readClient = new WSRPCClient(readUrl)
      this._readClient.on(WSRPCClientEvent.Connected, () =>
        this._emitNetEvent(readUrl, ClientEvent.Connected)
      )
      this._readClient.on(WSRPCClientEvent.Disconnected, () =>
        this._emitNetEvent(readUrl, ClientEvent.Disconnected)
      )
      this._readClient.on(WSRPCClientEvent.Error, err =>
        this._emitNetEvent(readUrl, ClientEvent.Error, err)
      )
    }

    const emitContractEvent = (event: IJSONRPCEvent) =>
      this._emitContractEvent(this._readClient.url, event)

    this.on('newListener', (event: string) => {
      if (event === ClientEvent.Contract && this.listenerCount(ClientEvent.Contract) === 0) {
        this._readClient.on(WSRPCClientEvent.Message, emitContractEvent)
      }
    })

    this.on('removeListener', (event: string) => {
      if (event === ClientEvent.Contract && this.listenerCount(ClientEvent.Contract) === 0) {
        this._readClient.removeListener(WSRPCClientEvent.Message, emitContractEvent)
      }
    })
  }

  /**
   * Cleans up all underlying network resources.
   * Once disconnected the client can no longer be used to interact with the DAppChain.
   */
  disconnect() {
    this.removeAllListeners()
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
  commitTxAsync<T extends Message>(tx: T): Promise<Uint8Array | void> {
    const op = retry.operation(this.nonceRetryStrategy)
    return new Promise<Uint8Array | void>((resolve, reject) => {
      op.attempt(currentAttempt => {
        this._commitTxAsync<T>(tx)
          .then(resolve)
          .catch(err => {
            if (err instanceof Error && err.message === INVALID_TX_NONCE_ERROR) {
              if (!op.retry(err)) {
                reject(err)
              }
            } else {
              op.stop()
              reject(err)
            }
          })
      })
    })
  }

  private async _commitTxAsync<T extends Message>(tx: T): Promise<Uint8Array | void> {
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
        if (
          result.check_tx.code === 1 &&
          result.check_tx.log === 'sequence number does not match'
        ) {
          throw new Error(INVALID_TX_NONCE_ERROR)
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
    vmType: VMType = VMType.PLUGIN,
    caller?: Address
  ): Promise<Uint8Array | void> {
    const result = await this._readClient.sendAsync<string>('query', {
      contract: contract.local.toString(),
      query: query ? Uint8ArrayToB64(query) : undefined,
      vmType: vmType,
      caller: caller ? caller.toString() : undefined
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

  private _emitContractEvent(url: string, event: IJSONRPCEvent): void {
    const { error, result } = event
    if (error) {
      const eventArgs: IClientErrorEventArgs = { kind: ClientEvent.Error, url, error }
      this.emit(ClientEvent.Error, eventArgs)
    } else if (result) {
      // Ugh, no built-in JSON->Protobuf marshaller apparently
      // https://github.com/google/protobuf/issues/1591 so gotta do this manually
      const eventArgs: IChainEventArgs = {
        kind: ClientEvent.Contract,
        url,
        contractAddress: new Address(
          result.address.chain_id,
          new LocalAddress(B64ToUint8Array(result.address.local))
        ),
        callerAddress: new Address(
          result.caller.chain_id,
          new LocalAddress(B64ToUint8Array(result.caller.local))
        ),
        blockHeight: result.block_height,
        data: B64ToUint8Array(result.encoded_body)
      }
      this.emit(ClientEvent.Contract, eventArgs)
    }
  }

  private _emitNetEvent(
    url: string,
    kind: ClientEvent.Connected | ClientEvent.Disconnected | ClientEvent.Error,
    error?: any
  ) {
    if (kind === ClientEvent.Error) {
      const eventArgs: IClientErrorEventArgs = { kind, url, error }
      this.emit(kind, eventArgs)
    } else {
      const eventArgs: IClientEventArgs = { kind, url }
      this.emit(kind, eventArgs)
    }
  }
}
