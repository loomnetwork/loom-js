import { Message } from 'google-protobuf'

import { ContractMethodCall, VMType } from './proto/loom_pb'
import { Uint8ArrayToB64, B64ToUint8Array, bytesToHexAddr } from './crypto-utils'
import { Address } from './address'
import { WSRPCClient } from './internal/ws-rpc-client'

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

/**
 * Writes to & reads from a Loom DAppChain.
 */
export class Client {
  public readonly chainId: string
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
    this.chainId = chainId
    // TODO: basic validation of the URIs to ensure they have all required components.
    this._writeClient = new WSRPCClient(writeUrl)
    if (!readUrl || writeUrl === readUrl) {
      this._readClient = this._writeClient
    } else {
      this._readClient = new WSRPCClient(readUrl)
    }
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
   */
  async txReceiptAsync(txHash: Uint8Array): Promise<Uint8Array | void> {
    const result = await this._readClient.sendAsync<string>('txreceipt', {
      txHash: Uint8ArrayToB64(txHash)
    })
    if (result) {
      return B64ToUint8Array(result)
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
}
