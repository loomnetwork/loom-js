import { Client, ITxMiddlewareHandler } from './client'
import { NonceTxMiddleware, SignedTxMiddleware } from './middleware'
import { publicKeyFromPrivateKey } from './crypto-utils'
import BN from 'bn.js'

/**
 * Creates the default set of tx middleware required to successfully commit a tx to a Loom DAppChain.
 * @param client The client the middleware is being created for.
 * @param privateKey Private key that should be used to sign txs.
 * @returns Set of middleware.
 */
export function createDefaultTxMiddleware(
  client: Client,
  privateKey: Uint8Array
): ITxMiddlewareHandler[] {
  const pubKey = publicKeyFromPrivateKey(privateKey)
  return [new NonceTxMiddleware(pubKey, client), new SignedTxMiddleware(privateKey)]
}

export function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * @param num Ethers BigNumber object, e.g. { _hex: '0x123' }. 
 * Need to take the _hex, strip the '0x' and then make a hex BN
 */
export function hexBN(num: any) : BN {
  return new BN(num._hex.slice(2), 16)
}