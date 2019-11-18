import BN from 'bn.js'
import { Client } from '../client'
import { Contract } from '../contract'
import { Address } from '../address'
import {
  TransferGatewayWithdrawTokenRequest,
  TransferGatewayWithdrawETHRequest,
  TransferGatewayWithdrawalReceipt,
  TransferGatewayWithdrawalReceiptRequest,
  TransferGatewayWithdrawalReceiptResponse,
  TransferGatewayTokenKind,
  TransferGatewayAddContractMappingRequest,
  TransferGatewayTokenWithdrawalSigned,
  TransferGatewayContractMappingConfirmed,
  TransferGatewayReclaimContractTokensRequest,
  TransferGatewayReclaimDepositorTokensRequest,
  TransferGatewayGetUnclaimedTokensRequest,
  TransferGatewayGetUnclaimedTokensResponse,
  TransferGatewayListContractMappingRequest,
  TransferGatewayListContractMappingResponse,
  TransferGatewayGetLocalAccountInfoRequest,
  TransferGatewayGetLocalAccountInfoResponse,
  TransferGatewayGetContractMappingRequest,
  TransferGatewayGetContractMappingResponse,
  TransferGatewayTxStatus
} from '../proto/transfer_gateway_pb'
import { marshalBigUIntPB, unmarshalBigUIntPB } from '../big-uint'
import { B64ToUint8Array } from '../crypto-utils'
import { IAddressMapping } from './address-mapper'

export interface IUnclaimedToken {
  tokenContract: Address
  tokenKind: TransferGatewayTokenKind
  tokenIds?: Array<BN>
  tokenAmounts?: Array<BN>
}

export interface IWithdrawalReceipt {
  tokenOwner: Address
  // Mainnet address of token contract (NOTE: not set when withdrawing LOOM via Binance Gateway)
  tokenContract?: Address
  tokenKind: TransferGatewayTokenKind
  // ERC721/X token ID
  tokenId?: BN
  // ERC721X/ERC20/ETH amount
  tokenAmount?: BN
  withdrawalNonce: BN
  // Signature generated by the Oracle that confirmed the withdrawal
  oracleSignature: Uint8Array
  // Withdrawal tx hash on the foreign chain (currently only used by Binance Gateway)
  txHash?: Uint8Array
  // Withdrawal tx status on the foreign chain (currently only used by Binance Gateway)
  txStatus?: TransferGatewayTxStatus

  // Deprecated, use tokenId and tokenAmount instead.
  // This is the ERC721 token ID, or ERC721X/ERC20/ETH amount.
  value: BN
}

export interface ITokenWithdrawalEventArgs {
  tokenOwner: Address
  // Mainnet address of token contract, blank if ETH
  tokenContract: Address
  tokenKind: TransferGatewayTokenKind
  // ERC721/X token ID
  tokenId?: BN
  // ERC721X/ERC20/ETH amount
  tokenAmount?: BN
  // Oracle signature
  sig: Uint8Array

  // Deprecated, use tokenId and tokenAmount instead.
  // This is the ERC721 token ID, or ERC721X/ERC20/ETH amount.
  value: BN
}

export interface IContractMappingConfirmedEventArgs {
  // Address of a contract on a foreign blockchain
  foreignContract: Address
  // Address of corresponding contract on the local blockchain
  localContract: Address
}

export interface ILocalAccountInfo {
  withdrawalReceipt: IWithdrawalReceipt | null
  totalWithdrawalAmount: BN
  lastWithdrawalLimitResetTime: number
}

export class TransferGateway extends Contract {
  // LoomJS user events
  static readonly EVENT_TOKEN_WITHDRAWAL = 'event_token_withdrawal'
  static readonly EVENT_CONTRACT_MAPPING_CONFIRMED = 'event_contract_mapping_confirmed'

  // Events from Loomchain
  static readonly tokenWithdrawalSignedEventTopic: String = 'event:TokenWithdrawalSigned'
  static readonly contractMappingConfirmedEventTopic: String = 'event:ContractMappingConfirmed'

  static async createAsync(client: Client, callerAddr: Address): Promise<TransferGateway> {
    const contractAddr = await client.getContractAddressAsync('gateway')
    if (!contractAddr) {
      throw Error('Failed to resolve contract address for TransferGateway')
    }

    return new TransferGateway({ contractAddr, callerAddr, client })
  }

  constructor(params: { contractAddr: Address; callerAddr: Address; client: Client }) {
    super(params)

    this.on(Contract.EVENT, event => {
      if (!event.topics || event.topics.length === 0) {
        return
      }

      if (event.topics[0] === TransferGateway.tokenWithdrawalSignedEventTopic) {
        const eventData = TransferGatewayTokenWithdrawalSigned.deserializeBinary(
          B64ToUint8Array(event.data)
        )

        let tokenId: BN | undefined
        let tokenAmount: BN | undefined
        let value: BN

        const tokenKind = eventData.getTokenKind()
        switch (tokenKind) {
          case TransferGatewayTokenKind.ERC721:
            tokenId = unmarshalBigUIntPB(eventData.getTokenId()!)
            value = tokenId
            break
          case TransferGatewayTokenKind.ERC721X:
            tokenId = unmarshalBigUIntPB(eventData.getTokenId()!)
          // fallthrough
          // tslint:disable-next-line: no-switch-case-fall-through
          default:
            tokenAmount = unmarshalBigUIntPB(eventData.getTokenAmount()!)
            value = tokenAmount
            break
        }

        this.emit(TransferGateway.EVENT_TOKEN_WITHDRAWAL, {
          tokenOwner: Address.UnmarshalPB(eventData.getTokenOwner()!),
          tokenContract: Address.UnmarshalPB(eventData.getTokenContract()!),
          tokenKind,
          tokenId,
          tokenAmount,
          sig: eventData.getSig_asU8(),
          value
        } as ITokenWithdrawalEventArgs)
      } else if (event.topics[0] === TransferGateway.contractMappingConfirmedEventTopic) {
        const contractMappingConfirmed = TransferGatewayContractMappingConfirmed.deserializeBinary(
          B64ToUint8Array(event.data)
        )

        this.emit(TransferGateway.EVENT_CONTRACT_MAPPING_CONFIRMED, {
          foreignContract: Address.UnmarshalPB(contractMappingConfirmed.getForeignContract()!),
          localContract: Address.UnmarshalPB(contractMappingConfirmed.getLocalContract()!)
        } as IContractMappingConfirmedEventArgs)
      }
    })
  }

  /**
   * Adds a contract mapping to the DAppChain Gateway using gatway owner signature.
   * A contract mapping associates a token contract on the DAppChain with it's counterpart on Ethereum.
   */
  addAuthorizedContractMappingAsync(params: {
    foreignContract: Address
    localContract: Address
  }): Promise<void> {
    const { foreignContract, localContract } = params

    const mappingContractRequest = new TransferGatewayAddContractMappingRequest()
    mappingContractRequest.setForeignContract(foreignContract.MarshalPB())
    mappingContractRequest.setLocalContract(localContract.MarshalPB())

    return this.callAsync<void>('AddAuthorizedContractMapping', mappingContractRequest)
  }

  /**
   * Adds a contract mapping to the DAppChain Gateway.
   * A contract mapping associates a token contract on the DAppChain with it's counterpart on Ethereum.
   */
  addContractMappingAsync(params: {
    foreignContract: Address
    localContract: Address
    foreignContractCreatorSig: Uint8Array
    foreignContractCreatorTxHash: Uint8Array
  }): Promise<void> {
    const {
      foreignContract,
      localContract,
      foreignContractCreatorSig,
      foreignContractCreatorTxHash
    } = params

    const mappingContractRequest = new TransferGatewayAddContractMappingRequest()
    mappingContractRequest.setForeignContract(foreignContract.MarshalPB())
    mappingContractRequest.setLocalContract(localContract.MarshalPB())
    mappingContractRequest.setForeignContractCreatorSig(foreignContractCreatorSig)
    mappingContractRequest.setForeignContractTxHash(foreignContractCreatorTxHash)

    return this.callAsync<void>('AddContractMapping', mappingContractRequest)
  }

  /**
   * Fetches contract mappings from the DAppChain Gateway.
   *
   * @returns An object containing both confirmed & pending contract mappings.
   */
  async listContractMappingsAsync(): Promise<{
    confirmed: IAddressMapping[]
    pending: IAddressMapping[]
  }> {
    const response = await this.staticCallAsync<TransferGatewayListContractMappingResponse>(
      'ListContractMapping',
      new TransferGatewayListContractMappingRequest(),
      new TransferGatewayListContractMappingResponse()
    )

    const confirmed = response.getConfimedMappingsList().map(mapping => ({
      from: Address.UnmarshalPB(mapping.getFrom()!),
      to: Address.UnmarshalPB(mapping.getTo()!)
    }))

    const pending = response.getConfimedMappingsList().map(mapping => ({
      from: Address.UnmarshalPB(mapping.getFrom()!),
      to: Address.UnmarshalPB(mapping.getTo()!)
    }))

    return {
      confirmed,
      pending
    }
  }

  /**
   * Sends a request to the DAppChain Gateway to begin withdrawal of an ERC721 token from the
   * current DAppChain account to an Ethereum account.
   * @param tokenId ERC721 token ID.
   * @param tokenContract DAppChain address of ERC721 contract.
   * @param recipient Ethereum address of the account the token should be withdrawn to, if this is
   *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
   *                  address of the Ethereum account mapped to the current DAppChain account.
   * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
   *          request.
   */
  withdrawERC721Async(tokenId: BN, tokenContract: Address, recipient?: Address): Promise<void> {
    const req = new TransferGatewayWithdrawTokenRequest()
    req.setTokenKind(TransferGatewayTokenKind.ERC721)
    req.setTokenId(marshalBigUIntPB(tokenId))
    req.setTokenContract(tokenContract.MarshalPB())
    if (recipient) {
      req.setRecipient(recipient.MarshalPB())
    }

    return this.callAsync<void>('WithdrawToken', req)
  }

  /**
   * Sends a request to the DAppChain Gateway to begin withdrawal of ERC721X tokens from the current
   * DAppChain account to an Ethereum account.
   * @param tokenId ERC721X token ID.
   * @param amount Amount of tokenId to withdraw.
   * @param tokenContract DAppChain address of ERC721X contract.
   * @param recipient Ethereum address of the account the token should be withdrawn to, if this is
   *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
   *                  address of the Ethereum account mapped to the current DAppChain account.
   * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
   *          request.
   */
  withdrawERC721XAsync(
    tokenId: BN,
    amount: BN,
    tokenContract: Address,
    recipient?: Address
  ): Promise<void> {
    const req = new TransferGatewayWithdrawTokenRequest()
    req.setTokenKind(TransferGatewayTokenKind.ERC721X)
    req.setTokenId(marshalBigUIntPB(tokenId))
    req.setTokenAmount(marshalBigUIntPB(amount))
    req.setTokenContract(tokenContract.MarshalPB())
    if (recipient) {
      req.setRecipient(recipient.MarshalPB())
    }

    return this.callAsync<void>('WithdrawToken', req)
  }

  /**
   * Sends a request to the DAppChain Gateway to begin withdrawal ERC20 tokens from the current
   * DAppChain account to an Ethereum account.
   * @param amount Amount to withdraw.
   * @param tokenContract DAppChain address of ERC20 contract.
   * @param recipient Ethereum address of the account the token should be withdrawn to, if this is
   *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
   *                  address of the Ethereum account mapped to the current DAppChain account.
   * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
   *          request.
   */
  withdrawERC20Async(amount: BN, tokenContract: Address, recipient?: Address): Promise<void> {
    const req = new TransferGatewayWithdrawTokenRequest()
    req.setTokenKind(TransferGatewayTokenKind.ERC20)
    req.setTokenAmount(marshalBigUIntPB(amount))
    req.setTokenContract(tokenContract.MarshalPB())
    if (recipient) {
      req.setRecipient(recipient.MarshalPB())
    }

    return this.callAsync<void>('WithdrawToken', req)
  }

  /**
   * Sends a request to the DAppChain Gateway to begin withdrawal of ETH from the current
   * DAppChain account to an Ethereum account.
   * @param amount Amount to withdraw.
   * @param ethereumGateway Ethereum address of Ethereum Gateway.
   * @param recipient Ethereum address of the account the token should be withdrawn to, if this is
   *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
   *                  address of the Ethereum account mapped to the current DAppChain account.
   * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
   *          request.
   */
  withdrawETHAsync(amount: BN, ethereumGateway: Address, recipient?: Address): Promise<void> {
    const req = new TransferGatewayWithdrawETHRequest()
    req.setAmount(marshalBigUIntPB(amount))
    req.setMainnetGateway(ethereumGateway.MarshalPB())
    if (recipient) {
      req.setRecipient(recipient.MarshalPB())
    }

    return this.callAsync<void>('WithdrawETH', req)
  }

  /**
   * Sends a request to the DAppChain Gateway to begin withdrawal TRX tokens from the current
   * DAppChain account to an Tron account.
   * @param amount Amount to withdraw.
   * @param tokenContract DAppChain address of Tron coin contract.
   * @param recipient Tron address of the account in hex string where the token should be withdrawn to, if this is
   *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
   *                  address of the Tron account mapped to the current DAppChain account.
   * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
   *          request.
   */
  withdrawTRXAsync(amount: BN, tokenContract: Address, recipient?: Address): Promise<void> {
    const req = new TransferGatewayWithdrawTokenRequest()
    req.setTokenKind(TransferGatewayTokenKind.TRX)
    req.setTokenAmount(marshalBigUIntPB(amount))
    req.setTokenContract(tokenContract.MarshalPB())
    if (recipient) {
      req.setRecipient(recipient.MarshalPB())
    }

    return this.callAsync<void>('WithdrawToken', req)
  }

  /**
   * Sends a request to the DAppChain Gateway to begin withdrawal TRC20 tokens from the current
   * DAppChain account to an Tron account.
   * @param amount Amount to withdraw.
   * @param tokenContract DAppChain address of Tron TRC20 contract.
   * @param recipient Tron address of the account in hex string where the token should be withdrawn to, if this is
   *                  omitted the Gateway will attempt to use the Address Mapper to retrieve the
   *                  address of the Tron account mapped to the current DAppChain account.
   * @returns A promise that will be resolved when the DAppChain Gateway has accepted the withdrawal
   *          request.
   */
  withdrawTRC20Async(amount: BN, tokenContract: Address, recipient?: Address): Promise<void> {
    const req = new TransferGatewayWithdrawTokenRequest()
    req.setTokenKind(TransferGatewayTokenKind.TRC20)
    req.setTokenAmount(marshalBigUIntPB(amount))
    req.setTokenContract(tokenContract.MarshalPB())
    if (recipient) {
      req.setRecipient(recipient.MarshalPB())
    }

    return this.callAsync<void>('WithdrawToken', req)
  }

  /**
   * Retrieves the current withdrawal receipt (if any) for the given DAppChain account.
   * Withdrawal receipts are created by calling one of the withdraw methods.
   * @param owner DAppChain address of a user account.
   * @returns A promise that will be resolved with the withdrawal receipt, or null if no withdrawal
   *          receipt exists (this indicates there's no withdrawal from the specified account
   *          currently in progress).
   */
  async withdrawalReceiptAsync(owner: Address): Promise<IWithdrawalReceipt | null> {
    const tgWithdrawReceiptReq = new TransferGatewayWithdrawalReceiptRequest()
    tgWithdrawReceiptReq.setOwner(owner.MarshalPB())

    const result = await this.staticCallAsync(
      'WithdrawalReceipt',
      tgWithdrawReceiptReq,
      new TransferGatewayWithdrawalReceiptResponse()
    )

    const receipt = result.getReceipt()
    return receipt ? unmarshalWithdrawalReceipt(receipt) : null
  }

  /**
   * Attempt to transfer tokens that originated from the specified Ethereum contract, and that have
   * been deposited to the Ethereum Gateway, but haven't yet been received by the depositors on the
   * DAppChain because of a missing identity or contract mapping. This method can only be called by
   * the creator of the specified token contract, or the Gateway owner.
   *
   * @param tokenContract token contract to reclaim the tokens
   */
  async reclaimContractTokensAsync(tokenContract: Address): Promise<void> {
    const req = new TransferGatewayReclaimContractTokensRequest()
    req.setTokenContract(tokenContract.MarshalPB())
    return this.callAsync<void>('ReclaimContractTokens', req)
  }

  async getUnclaimedTokensAsync(owner: Address): Promise<Array<IUnclaimedToken>> {
    const req = new TransferGatewayGetUnclaimedTokensRequest()
    req.setOwner(owner.MarshalPB())
    const result = await this.staticCallAsync(
      'GetUnclaimedTokens',
      req,
      new TransferGatewayGetUnclaimedTokensResponse()
    )

    const unclaimedTokens = result.getUnclaimedTokensList()

    let tokens: Array<IUnclaimedToken> = []
    for (let token of unclaimedTokens) {
      const tokenKind = token.getTokenKind()
      let tokenIds: Array<BN> = []
      let tokenAmounts: Array<BN> = []
      if (tokenKind === TransferGatewayTokenKind.ERC721) {
        // Set only the tokenId for ERC721
        for (let amt of token.getAmountsList()) {
          tokenIds.push(unmarshalBigUIntPB(amt.getTokenId()!))
        }
      } else if (tokenKind === TransferGatewayTokenKind.ERC721X) {
        // Set both the tokenId and the tokenAmounts for ERC721x
        for (let amt of token.getAmountsList()) {
          tokenIds.push(unmarshalBigUIntPB(amt.getTokenId()!))
          tokenAmounts.push(unmarshalBigUIntPB(amt.getTokenAmount()!))
        }
      } else {
        // Set only amount for all other cases
        for (let amt of token.getAmountsList()) {
          tokenAmounts.push(unmarshalBigUIntPB(amt.getTokenAmount()!))
        }
      }

      tokens.push({
        tokenContract: Address.UnmarshalPB(token.getTokenContract()!),
        tokenKind: tokenKind,
        tokenAmounts: tokenAmounts,
        tokenIds: tokenIds
      })
    }

    return tokens
  }

  /**
   * Attempt to transfer any tokens that the caller may have deposited into the Ethereum Gateway
   * but hasn't yet received from the DAppChain Gateway because of a missing identity or contract
   * mapping.
   *
   * @param depositors Optional list of DAppChain accounts to reclaim tokens for, when set tokens
   *                   will be reclaimed for the specified accounts instead of the caller's account.
   *                   NOTE: Only the Gateway owner is authorized to provide a list of accounts.
   */
  async reclaimDepositorTokensAsync(depositors?: Array<Address>): Promise<void> {
    const req = new TransferGatewayReclaimDepositorTokensRequest()
    if (depositors && depositors.length > 0) {
      req.setDepositorsList(depositors.map((address: Address) => address.MarshalPB()))
    }
    return this.callAsync<void>('ReclaimDepositorTokens', req)
  }

  /**
   * Retrieves the information stored by the Gateway for the given DAppChain account.
   * @param owner DAppChain address of a user account.
   * @returns A promise that will be resolved with the local account info.
   */
  async getLocalAccountInfoAsync(owner: Address): Promise<ILocalAccountInfo> {
    const req = new TransferGatewayGetLocalAccountInfoRequest()
    req.setOwner(owner.MarshalPB())

    const resp = await this.staticCallAsync(
      'GetLocalAccountInfo',
      req,
      new TransferGatewayGetLocalAccountInfoResponse()
    )

    const receipt = resp.getWithdrawalReceipt()
    const amount = resp.getTotalWithdrawalAmount()

    return {
      withdrawalReceipt: receipt ? unmarshalWithdrawalReceipt(receipt) : null,
      totalWithdrawalAmount: amount ? unmarshalBigUIntPB(amount) : new BN(0),
      lastWithdrawalLimitResetTime: resp.getLastWithdrawalLimitResetTime()
    }
  }

  /**
   * Looks up the contract mapping for the given contract address.
   * @param from Contract address.
   * @returns null if no mapping was found for the given contract, otherwise an object that contains
   *          the address of the contract the `from` contract is mapped to, and the current status of
   *          the mapping (pending or confirmed).
   */
  async getContractMappingAsync(from: Address): Promise<{ to: Address; pending: boolean } | null> {
    const request = new TransferGatewayGetContractMappingRequest()
    request.setFrom(from.MarshalPB())

    const response = await this.staticCallAsync<TransferGatewayGetContractMappingResponse>(
      'GetContractMapping',
      request,
      new TransferGatewayGetContractMappingResponse()
    )

    if (!response.getFound()) {
      return null
    }

    return {
      to: Address.UnmarshalPB(response.getMappedAddress()!),
      pending: response.getIsPending()
    }
  }
}

function unmarshalWithdrawalReceipt(
  receipt: TransferGatewayWithdrawalReceipt
): IWithdrawalReceipt {
  let tokenId: BN | undefined
  let tokenAmount: BN | undefined
  let value: BN

  const tokenKind = receipt.getTokenKind()
  switch (tokenKind) {
    case TransferGatewayTokenKind.ERC721:
      tokenId = unmarshalBigUIntPB(receipt.getTokenId()!)
      value = tokenId
      break
    case TransferGatewayTokenKind.ERC721X:
      tokenId = unmarshalBigUIntPB(receipt.getTokenId()!)
    // fallthrough
    // tslint:disable-next-line: no-switch-case-fall-through
    default:
      tokenAmount = unmarshalBigUIntPB(receipt.getTokenAmount()!)
      value = tokenAmount
      break
  }
  return {
    tokenOwner: Address.UnmarshalPB(receipt.getTokenOwner()!),
    tokenContract: Address.UnmarshalPB(receipt.getTokenContract()!),
    tokenKind,
    tokenId,
    tokenAmount,
    withdrawalNonce: new BN(receipt.getWithdrawalNonce()!),
    oracleSignature: receipt.getOracleSignature_asU8(),
    txHash: receipt.getTxHash_asU8(),
    txStatus: receipt.getTxStatus(),
    value
  }
}
