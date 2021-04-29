import debug from 'debug'
import { SignedTx } from '../proto/loom_pb'
import { ITxMiddlewareHandler } from '../client'
import { OfflineWeb3Signer, soliditySha3 } from '../solidity-helpers'
import { bytesToHex, hexToBytes } from '../crypto-utils'
import Web3 from 'web3'

const log = debug('signed-tx-middleware')

/**
 * Signs transactions.
 */
export class SignedTxMiddleware implements ITxMiddlewareHandler {
  // The private key that should be used to sign txs.
  private _web3: Web3
  private _account: any

  /**
   * @param web3 Web3 instance to use for signing.
   * @param account Web3 account to sign with.
   */
  constructor(web3: Web3, account: any) {
    this._web3 = web3
    this._account = account
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    // Get hash to be signed
    const hash = soliditySha3({
      type: 'bytes',
      value: bytesToHex(txData)
    })

    // Signing the transaction
    const offlineSigner = new OfflineWeb3Signer(this._web3, this._account)
    const sig = await offlineSigner.signAsync(hash)

    log(`signer: ${this._account.address}, signature: 0x${bytesToHex(sig.slice(1))}`)

    const signedTx = new SignedTx()
    signedTx.setInner(txData as Uint8Array)
    signedTx.setSignature(sig)

    return signedTx.serializeBinary()
  }
}