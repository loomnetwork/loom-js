import { Client as RPCClient } from 'rpc-websockets'
import { Message } from 'google-protobuf'
import wretch from 'wretch'

import { ContractMethodCall, Address } from './proto/loom_pb'
import { bytesToBase64String, bytesToHexAddr } from './crypto-utils'

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
  private _writeUrl: string
  private _readUrl: string
  private _rpcId = 0
  private _openPromise?: Promise<void>
  private _rpcClient: any

  TxMiddleware: ITxMiddlewareHandler[] = []

  /**
   * Constructs a new client to read & write data from/to a Loom DAppChain.
   * @param nodeUrl Loom DAppChain URL, e.g. "http://localhost".
   * @param writePort Port number for the write interface.
   * @param readPort Port number for the read interface.
   */
  constructor(nodeUrl: string, writePort: number, readPort: number) {
    this._writeUrl = `${nodeUrl}:${writePort}`
    this._readUrl = `${nodeUrl}:${readPort}`
    this._rpcClient = new RPCClient(
      this._writeUrl,
      {
        autoconnect: true,
        reconnect: true,
        reconnect_interval: 1000,
        max_reconnects: 5
      },
      this._getNextRequestId.bind(this)
    )
  }

  private _getNextRequestId(): string {
    return (++this._rpcId).toString()
  }

  /**
   * Commits a transaction to the DAppChain.
   *
   * @param tx Transaction to commit.
   * @returns Commit metadata.
   */
  async CommitTx<T extends Message, U>(tx: T): Promise<U> {
    let txBytes = tx.serializeBinary()
    for (let i = 0; i < this.TxMiddleware.length; i++) {
      txBytes = await this.TxMiddleware[i].Handle(txBytes)
    }
    const payload = bytesToBase64String(txBytes)
    await this._connect()
    const resp = await this._rpcClient('broadcast_tx_commit', [payload])
    const result = resp.Result
    if (result) {
      if (result.CheckTx.Code != 0) {
        if (!result.CheckTx.Error) {
          throw new Error(`Failed to commit Tx: ${result.CheckTx.Code}`)
        }
        throw new Error(`Failed to commit Tx: ${result.CheckTx.Error}`)
      }
      if (result.DeliverTx.Code != 0) {
        if (!result.DeliverTx.Error) {
          throw new Error(`Failed to commit Tx: ${result.DeliverTx.Code}`)
        }
        throw new Error(`Failed to commit Tx: ${result.DeliverTx.Error}`)
      }
    }
    return result
  }

  /**
   * Queries the current state of a contract.
   */

  async Query<T>(contract: Address, queryParams: any = null): Promise<T> {
    return wretch(this._readUrl)
      .json({
        jsonrpc: '2.0',
        method: 'query',
        params: {
          contract: bytesToHexAddr(contract.getLocal_asU8()),
          query: queryParams
        }
      })
      .post()
      .json<T>()
  }

  _connect(): Promise<void> {
    if (this._rpcClient.ready) {
      return Promise.resolve()
    }
    if (!this._openPromise) {
      const rpc = this._rpcClient
      this._openPromise = new Promise((resolve, reject) => {
        rpc.on('open', () => {
          resolve()
        })
      })
    }
    return this._openPromise
  }

  /**
   * Gets a nonce for the given public key.
   *
   * @param key A hex encoded public key.
   * @return The nonce.
   */
  async getNonce(key: string): Promise<number> {
    const resp = await wretch(this._readUrl)
      .url('/nonce')
      .query({ key })
      .get()
      .json<{ Result: number }>()
    return resp.Result
  }
}
