import debug from 'debug'
import { ethers } from 'ethers'
import { SignedTx, NonceTx, MessageTx, Transaction } from '../proto/loom_pb'
import { ITxMiddlewareHandler } from '../client'
import { EthersSigner, soliditySha3 } from '../solidity-helpers'
import { bytesToHex, hexToBytes, bufferToProtobufBytes } from '../crypto-utils'
import { Address } from '../address'

const log = debug('signed-eth-tx-middleware')

/**
 * Signs transactions using Eth crypto primitives
 */
export class SignedEthTxMiddleware implements ITxMiddlewareHandler {
  signer: ethers.Signer
  fromAddress!: string

  constructor(signer: ethers.Signer) {
    this.signer = signer
  }

  private getHashedValues(txData: Readonly<Uint8Array>): string {
    // Accessing previous buffers to retrieve required data
    const nonce = NonceTx.deserializeBinary(txData as Uint8Array)
    const transaction = Transaction.deserializeBinary(nonce.getInner() as Uint8Array)
    const message = MessageTx.deserializeBinary(transaction.getData() as Uint8Array)

    // Getting address as hex and sequence (nonce) as numerical string
    const toAddress = Address.UnmarshalPB(message.getTo()!).local.toString()
    const sequence = nonce.getSequence().toString()

    // Values to be hashed
    const hashValues = [
      {
        type: 'address',
        value: this.fromAddress
      },
      {
        type: 'address',
        value: toAddress
      },
      {
        type: 'uint256',
        value: sequence // nonce
      },
      {
        type: 'bytes',
        value: `0x${bytesToHex(txData as Uint8Array)}`
      }
    ]

    log('Hashing values', hashValues)

    const hash = soliditySha3(...hashValues)

    log('Hashed values', hash)

    return hash
  }

  async Handle(txData: Readonly<Uint8Array>): Promise<Uint8Array> {
    if (!this.fromAddress) {
      // Getting the public key address
      this.fromAddress = await this.signer.getAddress()
    }

    // Get hash to be signed
    const hash = this.getHashedValues(txData)

    // Signing the transaction
    const etherSigner = new EthersSigner(this.signer)
    const sig = await etherSigner.signAsync(hash)

    log('Signature without first byte', `0x${bytesToHex(sig.slice(1))}`)

    // Recovers the public key
    const publicKey = ethers.utils.recoverPublicKey(
      ethers.utils.arrayify(ethers.utils.hashMessage(ethers.utils.arrayify(hash))),
      `0x${bytesToHex(sig.slice(1))}`
    )

    // Check if we're generating the right public key
    if (ethers.utils.computeAddress(publicKey) !== this.fromAddress) {
      throw Error("Public key generated isn't valid")
    }

    const signedTx = new SignedTx()
    signedTx.setInner(txData as Uint8Array)
    signedTx.setSignature(sig)
    signedTx.setPublicKey(hexToBytes(publicKey))
    signedTx.setChainname('eth')
    return Promise.resolve(signedTx.serializeBinary())
  }
}
