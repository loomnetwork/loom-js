import BN from 'bn.js'
import debug from 'debug'
import { ethers, ContractTransaction } from 'ethers'
import { CryptoUtils } from '.'
import { parseSigs } from './helpers'
import { IWithdrawalReceipt } from './contracts/transfer-gateway'
import { TransferGatewayTokenKind as TokenKind } from './proto/transfer_gateway_pb.js'
import { ValidatorManagerV2__factory as ValidatorManagerV2Factory } from './mainnet-contracts/factories/ValidatorManagerV2__factory'
import { EthereumGatewayV2__factory as EthereumGatewayV2Factory } from './mainnet-contracts/factories/EthereumGatewayV2__factory'
import { EthereumGatewayV1__factory as EthereumGatewayV1Factory } from './mainnet-contracts/factories/EthereumGatewayV1__factory'
import { ValidatorManagerV2 as ValidatorManagerContractV2 } from './mainnet-contracts/ValidatorManagerV2'
import { EthereumGatewayV1 as EthereumGatewayV1Contract } from './mainnet-contracts/EthereumGatewayV1'
import { EthereumGatewayV2 as EthereumGatewayV2Contract } from './mainnet-contracts/EthereumGatewayV2'

const log = debug('loom.ethereum')

type TransactionOverrides = ethers.utils.UnsignedTransaction

/**
 * Thin wrapper over Ethereum Gateway contracts that smoothes over differences between versions.
 * Each instance of the wrapper is connected to a single Ethereum account.
 */
export interface IEthereumGateway {
  readonly version: 1 | 2

  /**
   * Withdraws ERC20, ERC721, ERC721X tokens, or ETH from the Ethereum Gateway.
   * @param receipt Withdrawal receipt from the DAppChain.
   * @param overrides ethers.js transaction overrides.
   */
  withdrawAsync(
    receipt: IWithdrawalReceipt,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  /**
   * Deposits ERC20 tokens into the Ethereum Gateway.
   * @note Before calling this function the user that intends to make the deposit must allow the
   *       Ethereum Gateway to transfer the desired amount via the standard ERC20 approve function.
   * @param amount Amount of tokens to deposit.
   * @param contractAddress Ethereum token contract address.
   * @param overrides ethers.js transaction overrides.
   */
  depositERC20Async(
    amount: number | string | BN,
    contractAddress: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  /**
   * @returns A new instance of the wrapper connected to the given Ethereum account.
   */
  withSigner(signer: ethers.Signer): IEthereumGateway
}

export class EthereumGatewayV1 implements IEthereumGateway {
  readonly version: 1 | 2 = 1

  constructor(readonly contract: EthereumGatewayV1Contract) {}

  async withdrawAsync(
    receipt: IWithdrawalReceipt,
    overrides?: TransactionOverrides
  ): Promise<ethers.ContractTransaction> {
    const signature = CryptoUtils.bytesToHexAddr(receipt.oracleSignature)

    let result
    switch (receipt.tokenKind) {
      case TokenKind.ETH:
        result = this.contract.functions.withdrawETH(
          receipt.tokenAmount!.toString(),
          signature,
          overrides
        )
        break

      case TokenKind.LOOMCOIN:
      case TokenKind.ERC20:
        result = this.contract.functions.withdrawERC20(
          receipt.tokenAmount!.toString(),
          signature,
          receipt.tokenContract!.local.toString(),
          overrides
        )
        break

      case TokenKind.ERC721:
        result = this.contract.functions.withdrawERC721(
          receipt.tokenId!.toString(),
          signature,
          receipt.tokenContract!.local.toString(),
          overrides
        )
        break

      case TokenKind.ERC721X:
        result = this.contract.functions.withdrawERC721X(
          receipt.tokenId!.toString(),
          receipt.tokenAmount!.toString(),
          signature,
          receipt.tokenContract!.local.toString(),
          overrides
        )
        break

      default:
        throw new Error('Unsupported token kind ' + receipt.tokenKind)
    }

    return result
  }

  async depositERC20Async(
    amount: number | string | BN,
    contractAddress: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction> {
    return this.contract.functions.depositERC20(amount.toString(), contractAddress, overrides)
  }

  withSigner(signer: ethers.Signer): IEthereumGateway {
    return new EthereumGatewayV1(this.contract.connect(signer))
  }
}

export class EthereumGatewayV2 implements IEthereumGateway {
  readonly version: 1 | 2 = 2

  constructor(
    readonly contract: EthereumGatewayV2Contract,
    private readonly vmc: ValidatorManagerContractV2
  ) {}

  async withdrawAsync(
    receipt: IWithdrawalReceipt,
    overrides?: TransactionOverrides
  ): Promise<ethers.ContractTransaction> {
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
          receipt.tokenAmount!.toString(),
          valIndexes,
          vs,
          rs,
          ss,
          overrides
        )
        break

      case TokenKind.LOOMCOIN:
      case TokenKind.ERC20:
        result = this.contract.functions.withdrawERC20(
          receipt.tokenAmount!.toString(),
          receipt.tokenContract!.local.toString(),
          valIndexes,
          vs,
          rs,
          ss,
          overrides
        )
        break

      case TokenKind.ERC721:
        result = this.contract.functions.withdrawERC721(
          receipt.tokenId!.toString(),
          receipt.tokenContract!.local.toString(),
          valIndexes,
          vs,
          rs,
          ss,
          overrides
        )
        break

      case TokenKind.ERC721X:
        result = this.contract.functions.withdrawERC721X(
          receipt.tokenId!.toString(),
          receipt.tokenAmount!.toString(),
          receipt.tokenContract!.local.toString(),
          valIndexes,
          vs,
          rs,
          ss,
          overrides
        )
        break

      default:
        throw new Error('Unsupported token kind ' + receipt.tokenKind)
    }

    return result
  }

  async depositERC20Async(
    amount: number | string | BN,
    contractAddress: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction> {
    return this.contract.functions.depositERC20(amount.toString(), contractAddress, overrides)
  }

  withSigner(signer: ethers.Signer): IEthereumGateway {
    return new EthereumGatewayV2(this.contract.connect(signer), this.vmc)
  }
}

/**
 * Creates an Ethereum Gateway contract wrapper.
 * @param version Ethereum Gateway contract version, must be 1, or 2.
 * @param address Ethereum Gateway address.
 * @param provider web3 provider.
 */
export async function createEthereumGatewayAsync(
  version: 1 | 2,
  address: string,
  provider: ethers.Signer | ethers.providers.Provider
): Promise<IEthereumGateway> {
  const gatewayContract = EthereumGatewayV2Factory.connect(address, provider)

  switch (version) {
    case 2:
      const vmcAddress = await gatewayContract.functions.vmc()
      const vmcContract = ValidatorManagerV2Factory.connect(vmcAddress, provider)
      return new EthereumGatewayV2(gatewayContract, vmcContract)

    case 1:
      return new EthereumGatewayV1(EthereumGatewayV1Factory.connect(address, provider))

    default:
      throw new Error('Invalid Ethereum Gateway version: ' + version)
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
        [receipt.tokenId ? receipt.tokenId.toString() : 0, receipt.tokenContract!.local.toString()]
      )
      break

    case TokenKind.ERC721X:
      prefix = MessagePrefix.ERC721X
      amountHashed = ethers.utils.solidityKeccak256(
        ['uint256', 'uint256', 'address'],
        [
          receipt.tokenId ? receipt.tokenId.toString() : 0,
          receipt.tokenAmount ? receipt.tokenAmount.toString() : 0,
          receipt.tokenContract!.local.toString()
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
          receipt.tokenContract!.local.toString()
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
