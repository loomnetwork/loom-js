import BN from 'bn.js';
import { Client } from '../client';
import { Contract } from '../contract';
import { Address } from '../address';
import { TransferGatewayTokenKind } from '../proto/transfer_gateway_pb';
export interface IUnclaimedToken {
    tokenContract: Address;
    tokenKind: TransferGatewayTokenKind;
    tokenIds?: Array<BN>;
    tokenAmounts?: Array<BN>;
}
export interface IWithdrawalReceipt {
    tokenOwner: Address;
    tokenContract: Address;
    tokenKind: TransferGatewayTokenKind;
    tokenId?: BN;
    tokenAmount?: BN;
    withdrawalNonce: BN;
    oracleSignature: Uint8Array;
    value: BN;
}
export interface ITokenWithdrawalEventArgs {
    tokenOwner: Address;
    tokenContract: Address;
    tokenKind: TransferGatewayTokenKind;
    tokenId?: BN;
    tokenAmount?: BN;
    sig: Uint8Array;
    value: BN;
}
export interface IContractMappingConfirmedEventArgs {
    foreignContract: Address;
    localContract: Address;
}
export declare class TransferGateway extends Contract {
    static readonly EVENT_TOKEN_WITHDRAWAL: string;
    static readonly EVENT_CONTRACT_MAPPING_CONFIRMED: string;
    static readonly tokenWithdrawalSignedEventTopic: String;
    static readonly contractMappingConfirmedEventTopic: String;
    static createAsync(client: Client, callerAddr: Address): Promise<TransferGateway>;
    constructor(params: {
        contractAddr: Address;
        callerAddr: Address;
        client: Client;
    });
    /**
    * Adds a contract mapping to the DAppChain Gateway using gatway owner signature.
    * A contract mapping associates a token contract on the DAppChain with it's counterpart on Ethereum.
    */
    addAuthorizedContractMappingAsync(params: {
        foreignContract: Address;
        localContract: Address;
    }): Promise<void>;
    /**
     * Adds a contract mapping to the DAppChain Gateway.
     * A contract mapping associates a token contract on the DAppChain with it's counterpart on Ethereum.
     */
    addContractMappingAsync(params: {
        foreignContract: Address;
        localContract: Address;
        foreignContractCreatorSig: Uint8Array;
        foreignContractCreatorTxHash: Uint8Array;
    }): Promise<void>;
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
    withdrawERC721Async(tokenId: BN, tokenContract: Address, recipient?: Address): Promise<void>;
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
    withdrawERC721XAsync(tokenId: BN, amount: BN, tokenContract: Address, recipient?: Address): Promise<void>;
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
    withdrawERC20Async(amount: BN, tokenContract: Address, recipient?: Address): Promise<void>;
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
    withdrawETHAsync(amount: BN, ethereumGateway: Address, recipient?: Address): Promise<void>;
    /**
     * Retrieves the current withdrawal receipt (if any) for the given DAppChain account.
     * Withdrawal receipts are created by calling one of the withdraw methods.
     * @param owner DAppChain address of a user account.
     * @returns A promise that will be resolved with the withdrawal receipt, or null if no withdrawal
     *          receipt exists (this indicates there's no withdrawal from the specified account
     *          currently in progress).
     */
    withdrawalReceiptAsync(owner: Address): Promise<IWithdrawalReceipt | null>;
    /**
     * Attempt to transfer tokens that originated from the specified Ethereum contract, and that have
     * been deposited to the Ethereum Gateway, but haven't yet been received by the depositors on the
     * DAppChain because of a missing identity or contract mapping. This method can only be called by
     * the creator of the specified token contract, or the Gateway owner.
     *
     * @param tokenContract token contract to reclaim the tokens
     */
    reclaimContractTokensAsync(tokenContract: Address): Promise<void>;
    getUnclaimedTokensAsync(owner: Address): Promise<Array<IUnclaimedToken>>;
    /**
     * Attempt to transfer any tokens that the caller may have deposited into the Ethereum Gateway
     * but hasn't yet received from the DAppChain Gateway because of a missing identity or contract
     * mapping.
     *
     * @param depositors Optional list of DAppChain accounts to reclaim tokens for, when set tokens
     *                   will be reclaimed for the specified accounts instead of the caller's account.
     *                   NOTE: Only the Gateway owner is authorized to provide a list of accounts.
     */
    reclaimDepositorTokensAsync(depositors?: Array<Address>): Promise<void>;
}
