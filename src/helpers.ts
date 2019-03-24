import { Client, ITxMiddlewareHandler, overrideReadUrl } from './client'
import { NonceTxMiddleware, SignedTxMiddleware, SignedEthTxMiddleware } from './middleware'
import { publicKeyFromPrivateKey, B64ToUint8Array } from './crypto-utils'
import BN from 'bn.js'
import { selectProtocol } from './rpc-client-factory'
import { JSONRPCProtocol } from './internal/json-rpc-client'
import { createJSONRPCClient, LocalAddress } from '.'
import { Address } from './address'
import { ethers } from 'ethers'
import debug from 'debug'

export interface IParsedSigsArray {
  vs: Array<number>
  rs: Array<string>
  ss: Array<string>
  valIndexes: Array<number>
}

export const ORACLE_SIG_SIZE_WITH_MODE = 134 // '0x'.length + (65 + 1) * 2
export const ORACLE_SIG_SIZE = 132 // '0x'.length + 65 * 2

export function parseSigs(sig: string, hash: string, validators: string[]): IParsedSigsArray {
  let vs: Array<number> = []
  let rs: Array<string> = []
  let ss: Array<string> = []
  let valIndexes: Array<number> = []

  let sigs: Array<string>
  if (sig.length === ORACLE_SIG_SIZE_WITH_MODE) {
    // using old oracle but new mainnet contract requires removing the 'mode' bit from the signature
    sigs = ['0x' + sig.slice(4)]
  } else if (sig.length === ORACLE_SIG_SIZE) {
    // if the oracle signs without a mode
    sigs = [sig]
  } else {
    // else split sig string into 65 byte array of sigs
    sigs = sig
      .slice(2)
      .match(/.{1,130}/g)!
      .map(s => '0x' + s)
  }

  // Split signature in v,r,s arrays
  // Store the ordering of the validators' signatures in `valIndexes`
  for (let i in sigs) {
    const _hash = ethers.utils.arrayify(ethers.utils.hashMessage(ethers.utils.arrayify(hash)))

    const recAddress = ethers.utils.recoverAddress(_hash, sigs[i])
    const ind = validators.indexOf(recAddress)
    if (ind == -1) {
      // skip if invalid signature
      continue
    }

    valIndexes.push(validators.indexOf(recAddress))

    const s = ethers.utils.splitSignature(sigs[i])
    vs.push(s.v!)
    rs.push(s.r)
    ss.push(s.s)
  }

  vs = mapOrder(vs, valIndexes)
  rs = mapOrder(rs, valIndexes)
  ss = mapOrder(ss, valIndexes)
  valIndexes.sort()
  return { vs, rs, ss, valIndexes }
}

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

export function createDefaultClient(
  dappchainKey: string,
  dappchainEndpoint: string,
  chainId: string
): { client: Client; publicKey: Uint8Array; address: Address } {
  const privateKey = B64ToUint8Array(dappchainKey)
  const publicKey = publicKeyFromPrivateKey(privateKey)

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

  client.txMiddleware = createDefaultTxMiddleware(client, privateKey)

  client.on('error', (msg: any) => {
    log('PlasmaChain connection error', msg)
  })

  const address = new Address(chainId, LocalAddress.fromPublicKey(publicKey))

  return { client, publicKey, address }
}

function mapOrder(array: Array<any>, order: Array<number>): Array<any> {
  if (array.length === 1) {
    return array
  }

  let sortedArray = []

  for (let i in order) {
    const ind = order.indexOf(parseInt(i))
    sortedArray.push(array[ind])
  }

  return sortedArray
}

export async function createDefaultEthSignClientAsync(
  dappchainKey: string,
  dappchainEndpoint: string,
  chainId: string,
  wallet: ethers.Signer
): Promise<{ client: Client; publicKey: Uint8Array; address: Address }> {
  const defaultClientObj = createDefaultClient(dappchainKey, dappchainEndpoint, chainId)
  const ethAddress = await wallet.getAddress()

  defaultClientObj.client.txMiddleware = [
    new NonceTxMiddleware(
      new Address('eth', LocalAddress.fromHexString(ethAddress)),
      defaultClientObj.client
    ),
    new SignedEthTxMiddleware(wallet)
  ]

  return { ...defaultClientObj }
}
