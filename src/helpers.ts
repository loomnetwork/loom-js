import { Client, ITxMiddlewareHandler } from './client'
import { NonceTxMiddleware, SignedTxMiddleware } from './middleware'
import { publicKeyFromPrivateKey } from './crypto-utils'
import BN from 'bn.js'
import debug from 'debug'

import { CryptoUtils, createJSONRPCClient, Address, LocalAddress } from '.'

import { JSONRPCProtocol } from './internal/json-rpc-client'
import { selectProtocol } from './rpc-client-factory'
import { overrideReadUrl } from './client'

const log = debug('helpers')

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
export function hexBN(num: any): BN {
  return new BN(num._hex.slice(2), 16)
}

export function parseUrl(rawUrl: string): URL {
  // In NodeJS 10+ and browsers the URL class is a global object.
  // In earlier NodeJS versions it needs to be imported.
  let importURL = true
  try {
    if (typeof URL !== 'undefined') {
      importURL = false
    }
  } catch (err) {
    // probably ReferenceError: URL is not defined
  }

  if (importURL) {
    const url = require('url')
    return new url.URL(rawUrl)
  }
  return new URL(rawUrl)
}

export function createClient(
  dappchainKey: string,
  dappchainEndpoint: string,
  chainId: string
): {client: Client, publicKey: Uint8Array, address: Address } {
  const privateKey = CryptoUtils.B64ToUint8Array(dappchainKey)
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

  const protocol = selectProtocol(dappchainEndpoint)
  const writerSuffix = protocol == JSONRPCProtocol.HTTP ? '/rpc' : '/websocket'
  const readerSuffix = protocol == JSONRPCProtocol.HTTP ? '/query' : '/queryws'

  const writer = createJSONRPCClient({
    protocols: [{ url: dappchainEndpoint + writerSuffix }]
  })
  const reader = createJSONRPCClient({
    protocols: [{ url: overrideReadUrl(dappchainEndpoint + readerSuffix) }]
  })

  const client = new Client(chainId, writer, reader)
  log('Initialized', dappchainEndpoint)
  client.txMiddleware = [
    new NonceTxMiddleware(publicKey, client),
    new SignedTxMiddleware(privateKey)
  ]

  client.on('error', (msg: any) => {
    log('PlasmaChain connection error', msg)
  })

  const address = new Address(chainId, LocalAddress.fromPublicKey(publicKey))

  return { client, publicKey, address }
}