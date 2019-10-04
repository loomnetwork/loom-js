import BN from 'bn.js'
import debug from 'debug'
import { ethers, ContractTransaction } from 'ethers'
import { CryptoUtils } from '.'
import { parseSigs } from './helpers'
import { IWithdrawalReceipt } from './contracts/transfer-gateway'
import { TransferGatewayTokenKind as TokenKind } from './proto/transfer_gateway_pb.js'
import { TransactionOverrides } from './mainnet-contracts'
import { ValidatorManagerContractV2Factory } from './mainnet-contracts/ValidatorManagerContractV2Factory'
import { EthereumGatewayV2Factory } from './mainnet-contracts/EthereumGatewayV2Factory'
import { EthereumGatewayV1Factory } from './mainnet-contracts/EthereumGatewayV1Factory'
import { ValidatorManagerContractV2 } from './mainnet-contracts/ValidatorManagerContractV2'
import { EthereumGatewayV1 as EthereumGatewayV1Contract } from './mainnet-contracts/EthereumGatewayV1'
import { EthereumGatewayV2 as EthereumGatewayV2Contract } from './mainnet-contracts/EthereumGatewayV2'

const log = debug('loom.ethereum')

/**
 * Thin wrapper over Ethereum Gateway contracts that hides differences between versions.
 */
interface EthereumGateway {
  readonly version: number

  /**
   * Uses receipt.tokenKind to call the right withdrawal functions
   * @param receipt
   */
  withdrawAsync(receipt: IWithdrawalReceipt): Promise<ContractTransaction>

  depositERC20Async(
    amount: number | string | BN,
    contractAddress: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>
}

export class EthereumGatewayV1 implements EthereumGateway {
  readonly version = 1

  constructor(readonly contract: EthereumGatewayV1Contract) {}

  /**
   *
   * @param receipt
   */
  async withdrawAsync(receipt: IWithdrawalReceipt) {
    const signature = CryptoUtils.bytesToHexAddr(receipt.oracleSignature)
    const amount = receipt.tokenAmount.toString()
    const tokenAddr = receipt.tokenContract.local.toString()
    let result

    switch (receipt.tokenKind) {
      case TokenKind.ETH:
        result = this.contract.functions.withdrawETH(amount, signature)
        break

      case TokenKind.LOOMCOIN:
        result = this.contract.functions.withdrawERC20(amount, signature, tokenAddr)
        break

      case TokenKind.ERC20:
        result = this.contract.functions.withdrawERC20(amount, signature, tokenAddr)
        break

      case TokenKind.ERC721:
        result = this.contract.functions.withdrawERC721(amount, signature, tokenAddr)
        break

      case TokenKind.ERC721X:
        result = this.contract.functions.withdrawERC721X(
          receipt.tokenId.toString(),
          amount,
          signature,
          tokenAddr
        )
        break

      default:
        throw new Error('Unsupported token kind ' + receipt.tokenKind)
    }

    // as is or transform?
    return result
  }

  async depositERC20Async(
    amount: number | string | BN,
    contractAddress: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction> {
    return this.contract.functions.depositERC20(amount.toString(), contractAddress, overrides)
  }
}

/**
 * WARNING: keep order the same as {loom-js/dist/contracts/transfer-gateway/GatewayTokenKind}
 */
const WithdrawalPrefixes = new Map<TokenKind, string>([
  [TokenKind.ETH, '\x0eWithdraw ETH:\n'],
  [TokenKind.LOOMCOIN, '\x10Withdraw ERC20:\n'],
  [TokenKind.ERC721, '\x11Withdraw ERC721:\n'],
  [TokenKind.ERC721X, '\x12Withdraw ERC721X:\n'],
  [TokenKind.ERC20, '\x10Withdraw ERC20:\n']
])

/**
 *
 */
export class EthereumGatewayV2 implements EthereumGateway {
  readonly version = 2

  constructor(
    readonly contract: EthereumGatewayV2Contract,
    private readonly vmc: ValidatorManagerContractV2
  ) {}

  async withdrawAsync(receipt: IWithdrawalReceipt) {
    const tokenAddr = receipt.tokenContract.local.toString()
    const validators = await this.vmc.functions.getValidators()
    const hash = createWithdrawalHash(receipt, this.contract.address)

    const { vs, rs, ss, valIndexes } = parseSigs(
      CryptoUtils.bytesToHexAddr(receipt.oracleSignature),
      hash,
      validators
    )

    let result
    switch (receipt.tokenKind) {
      case TokenKind.ETH:
        result = this.contract.functions.withdrawETH(
          receipt.tokenAmount.toString(),
          valIndexes,
          vs,
          rs,
          ss
        )
        break

      case TokenKind.LOOMCOIN:
        result = this.contract.functions.withdrawERC20(
          receipt.tokenAmount.toString(),
          tokenAddr,
          valIndexes,
          vs,
          rs,
          ss
        )
        break

      case TokenKind.ERC20:
        result = this.contract.functions.withdrawERC20(
          receipt.tokenAmount.toString(),
          tokenAddr,
          valIndexes,
          vs,
          rs,
          ss
        )
        break

      case TokenKind.ERC721:
        result = this.contract.functions.withdrawERC721(
          receipt.tokenId.toString(),
          tokenAddr,
          valIndexes,
          vs,
          rs,
          ss
        )
        break

      case TokenKind.ERC721X:
        result = this.contract.functions.withdrawERC721X(
          receipt.tokenAmount.toString(),
          tokenAddr,
          receipt.tokenId.toString(),
          valIndexes,
          vs,
          rs,
          ss
        )
        break

      default:
        throw new Error('Unsupported token kind ' + receipt.tokenKind)
    }

    const tx = await result
    // return this object or just hash or other?
    return tx
  }

  async depositERC20Async(
    amount: number | string | BN,
    contractAddress: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction> {
    return this.contract.functions.depositERC20(amount.toString(), contractAddress, overrides)
  }

  /**
   *
   * @param receipt
   */
  async withdrawalHash(receipt: IWithdrawalReceipt): Promise<string> {
    const prefix = WithdrawalPrefixes.get(receipt.tokenKind)
    if (prefix === undefined) {
      throw new Error("Don't know prefix for token kind " + receipt.tokenKind)
    }

    const ownerAddr = receipt.tokenOwner.local.toString()
    const tokenAddr = receipt.tokenContract.local.toString()
    const gatewayAddr = this.contract.address
    // how do we pick the amount? this random code works...
    const amount = receipt.value.isZero()
      ? receipt.tokenAmount.toString()
      : receipt.value.toString()

    const amountHashed =
      receipt.tokenKind === TokenKind.ETH
        ? ethers.utils.solidityKeccak256(['uint256'], [amount])
        : ethers.utils.solidityKeccak256(['uint256', 'address'], [amount, ownerAddr])

    const nonce = await this.contract.functions.nonces(ownerAddr)
    log('Hashing', [prefix, ownerAddr, nonce, gatewayAddr, amountHashed])

    return ethers.utils.solidityKeccak256(
      ['string', 'address', 'uint256', 'address', 'bytes32'],
      [prefix, ownerAddr, nonce, gatewayAddr, amountHashed]
    )
  }
}

/**
 * Creates an Ethereum Gateway contract wrapper.
 * @param address Ethereum Gateway address
 * @param provider web3 provider
 */
export async function createEthereumGateway(
  address: string,
  provider: ethers.Signer | ethers.providers.Provider
): Promise<EthereumGateway> {
  const gatewayContract = EthereumGatewayV2Factory.connect(address, provider)

  try {
    const vmcAddress = await gatewayContract.functions.vmc()
    const vmcContract = ValidatorManagerContractV2Factory.connect(vmcAddress, provider)
    return new EthereumGatewayV2(gatewayContract, vmcContract)
  } catch (error) {
    // TODO: need to check if error is effectively "function not found"...
    return new EthereumGatewayV1(EthereumGatewayV1Factory.connect(address, provider))
  }
}

enum MessagePrefix {
  ETH = '\x0eWithdraw ETH:\n',
  ERC20 = '\x10Withdraw ERC20:\n',
  ERC721 = '\x11Withdraw ERC721:\n',
  ERC721X = '\x12Withdraw ERC721X:\n'
}

function createWithdrawalHash(receipt: IWithdrawalReceipt, gatewayAddress: string) {
  let prefix: MessagePrefix
  let amountHashed: string

  switch (receipt.tokenKind) {
    case TokenKind.ERC721:
      prefix = MessagePrefix.ERC721
      amountHashed = ethers.utils.solidityKeccak256(
        ['uint256', 'address'],
        [receipt.tokenId ? receipt.tokenId.toString() : 0, receipt.tokenContract.local.toString()]
      )
      break

    case TokenKind.ERC721X:
      prefix = MessagePrefix.ERC721X
      amountHashed = ethers.utils.solidityKeccak256(
        ['uint256', 'uint256', 'address'],
        [
          receipt.tokenId ? receipt.tokenId.toString() : 0,
          receipt.tokenAmount ? receipt.tokenAmount.toString() : 0,
          receipt.tokenContract.local.toString()
        ]
      )
      break

    case TokenKind.LOOMCOIN:
    case TokenKind.ERC20:
      prefix = MessagePrefix.ERC20
      amountHashed = ethers.utils.solidityKeccak256(
        ['uint256', 'address'],
        [
          receipt.tokenAmount ? receipt.tokenAmount.toString() : 0,
          receipt.tokenContract.local.toString()
        ]
      )
      break

    case TokenKind.ETH:
      prefix = MessagePrefix.ETH
      amountHashed = ethers.utils.solidityKeccak256(
        ['uint256'],
        [receipt.tokenAmount ? receipt.tokenAmount.toString() : 0]
      )
      break

    default:
      throw new Error('Unsupported token kind')
  }

  return ethers.utils.solidityKeccak256(
    ['string', 'address', 'uint256', 'address', 'bytes32'],
    [
      prefix,
      receipt.tokenOwner.local.toString(),
      receipt.withdrawalNonce.toString(),
      gatewayAddress,
      amountHashed
    ]
  )
}
