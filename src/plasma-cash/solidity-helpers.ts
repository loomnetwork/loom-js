import ethutil from 'ethereumjs-util'
import Web3 from 'web3'

const web3 = new Web3()

export function soliditySha3(...values: any[]): string {
  return (web3.utils.soliditySha3 as any)(...values)
}

/**
 * Signs a message using a web3 account.
 * @param account web3 account to sign with.
 * @param msg Message to sign.
 * @returns Promise that will be resolved with the signature bytes.
 */
export async function signMessageAsync(account: any, msg: string): Promise<Uint8Array> {
  const signature = await web3.eth.sign(account, msg)
  const sig = signature.slice(2)
  const r = ethutil.toBuffer('0x' + sig.substring(0, 64)) as Buffer
  const s = ethutil.toBuffer('0x' + sig.substring(64, 128)) as Buffer
  const v = ethutil.toBuffer(parseInt(sig.substring(128, 130), 16) + 27) as Buffer
  const mode = ethutil.toBuffer(1) as Buffer // mode = geth
  return Buffer.concat([mode, r, s, v])
}
