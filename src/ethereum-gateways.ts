import debug from 'debug'

import { ethers, ContractTransaction } from 'ethers'
import { BigNumber } from "ethers/utils";

import { CryptoUtils } from ".";
import { parseSigs } from "./helpers";
import { IWithdrawalReceipt } from "./contracts/transfer-gateway"
import { TransferGatewayTokenKind as TokenKind } from "./proto/transfer_gateway_pb.js";

const ValidatorManagerContractABI = require('./mainnet-contracts/ValidatorManagerContract.json')
const GatewayABIv1 = require('./mainnet-contracts/Gateway_v1.json')
const GatewayABIv2 = require('./mainnet-contracts/Gateway_v2.json')

// faking v1 contract
import { Gateway as GatewayContract_v1 } from "./mainnet-contracts/Gateway" // from "./mainnet-contracts/Gateway_v1"
import { Gateway as GatewayContract_v2 } from "./mainnet-contracts/Gateway" // from "./mainnet-contracts/Gateway_v2"
import { TransactionOverrides } from "./mainnet-contracts";


const log = debug('loom.ethereum')

/**
 * 
 */
interface EthereumGateway {
    readonly version: number

    /**
     * Uses receipt.tokenKind to call the right withdrawal functions 
     * @param receipt 
     */
    withdraw(receipt: IWithdrawalReceipt): Promise<ContractTransaction>

    depositETH(
        amount: number | string | BigNumber
    ): Promise<ContractTransaction>

    depositERC20(
        amount: number | string | BigNumber,
        contractAddress: string,
        overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    depositERC721(
        amount: number | string | BigNumber,
        contractAddress: string,
        overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    depositERC721X(
        amount: number | string | BigNumber,
        contractAddress: string,
        overrides?: TransactionOverrides
    ): Promise<ContractTransaction>
}




export class EthereumGatewayV1 implements EthereumGateway {

    readonly version = 1

    constructor(readonly contract: GatewayContract_v1) { }

    /**
     * 
     * @param receipt 
     */
    async withdraw(receipt: IWithdrawalReceipt) {
        const signature = CryptoUtils.bytesToHexAddr(receipt.oracleSignature)
        const amount = receipt.tokenAmount.toString()
        const ownerAddr = receipt.tokenOwner.local.toString()
        // tokenContract basechain or ethereum?
        const tokenAddr = receipt.tokenContract
        let promise;

        switch (receipt.tokenKind) {
            case TokenKind.ETH:
                // errors should clear once v1 gateway type is imported
                promise = this.contract.functions.withdrawETH(amount, signature)
                break;
            case TokenKind.LOOMCOIN:
                promise = this.contract.functions.withdrawERC20(amount, signature, tokenAddr)
                break;
            case TokenKind.ERC20:
                promise = this.contract.functions.withdrawERC20(amount, signature, tokenAddr)
                break;
            case TokenKind.ERC721:
                promise = this.contract.functions.withdrawERC721(amount, signature, tokenAddr)
                break;
            case TokenKind.ERC721X:
                promise = this.contract.functions.withdrawERC721X(amount, signature, tokenAddr)
                break;

            default:
                throw new Error("Unsupported token kind " + receipt.tokenKind)
        }

        // as is or transform?
        return promise
    }

    async depositETH(
        amount: number | string | BigNumber
    ): Promise<ContractTransaction> {

        return this.contract.signer.sendTransaction({
            to: this.contract.address,
            value: amount
        })
    }
    async depositERC20(
        amount: number | string | BigNumber,
        contractAddress: string,
        overrides?: TransactionOverrides
    ): Promise<ContractTransaction> {
        return this.contract.functions.depositERC20(amount, contractAddress, overrides)
    }

    async depositERC721(
        amount: number | string | BigNumber,
        contractAddress: string,
        overrides?: TransactionOverrides
    ): Promise<ContractTransaction> {
        return this.contract.functions.depositERC721(amount, contractAddress, overrides)
    }

    async depositERC721X(
        amount: number | string | BigNumber,
        contractAddress: string,
        overrides?: TransactionOverrides
    ): Promise<ContractTransaction> {
        return this.contract.functions.depositERC721X(amount, contractAddress, overrides)
    }

}


/**
 * WARNING: keep order the same as {loom-js/dist/contracts/transfer-gateway/GatewayTokenKind}
 */
const WithdrawalPrefixes = new Map<TokenKind, string>([
    [TokenKind.ETH, "\x0eWithdraw ETH:\n"],
    [TokenKind.LOOMCOIN, "\x10Withdraw ERC20:\n"],
    [TokenKind.ERC721, "\x11Withdraw ERC721:\n"],
    [TokenKind.ERC721X, "\x12Withdraw ERC721X:\n"],
    [TokenKind.ERC20, "\x10Withdraw ERC20:\n"],
])

/**
 * 
 */
export class EthereumGatewayV2 implements EthereumGateway {

    readonly version = 1

    constructor(
        readonly contract: GatewayContract_v2,
        private readonly vmc: ethers.Contract | null,
    ) { }


    async withdraw(receipt: IWithdrawalReceipt) {

        const [validators, hash] = await Promise.all([
            this.vmc.functions.getValidators(),
            this.withdrawalHash(receipt)
        ])

        const { vs, rs, ss, valIndexes } = parseSigs(
            CryptoUtils.bytesToHexAddr(receipt.oracleSignature),
            hash,
            validators,
        )

        const tokenContractAddr = receipt.tokenContract.local.toString()
        // if ETH amount is receipt.value else it's receipt.tokenAmount
        const amount = receipt.value.isZero() ? receipt.tokenAmount.toString() : receipt.value.toString()

        let promise;
        const contract = this.contract

        switch (receipt.tokenKind) {
            case TokenKind.ETH:
                promise = contract.functions.withdrawETH(
                    amount,
                    valIndexes, vs, rs, ss)
                break;

            case TokenKind.LOOMCOIN:
                promise = contract.functions.withdrawERC20(
                    amount,
                    tokenContractAddr,
                    valIndexes, vs, rs, ss)
                break;

            case TokenKind.ERC20:
                promise = contract.functions.withdrawERC20(
                    amount,
                    tokenContractAddr,
                    valIndexes, vs, rs, ss)
                break;

            case TokenKind.ERC721:
                promise = contract.functions.withdrawERC721(
                    amount,
                    tokenContractAddr,
                    valIndexes, vs, rs, ss)
                break;

            case TokenKind.ERC721X:
                promise = contract.functions.withdrawERC721X(
                    amount,
                    tokenContractAddr,
                    receipt.tokenId.toString(),
                    valIndexes, vs, rs, ss)
                break;

            default:
                throw new Error("Unsupported token kind " + receipt.tokenKind)
        }

        const tx = await promise
        // return this object or just hash or other?
        return tx
    }

    /**
     * 
     * @param receipt 
     */
    async withdrawalHash(
        receipt: IWithdrawalReceipt
    ): Promise<string> {

        const prefix = WithdrawalPrefixes.get(receipt.tokenKind)
        if (prefix === undefined) {
            throw new Error("Don't know prefix for token kind " + receipt.tokenKind)
        }

        const ownerAddr = receipt.tokenOwner.local.toString()
        const tokenAddr = receipt.tokenContract.local.toString()
        const gatewayAddr = this.contract.address
        // how do we pick the amount? this random code works...
        const amount = receipt.value.isZero() ? receipt.tokenAmount.toString() : receipt.value.toString()

        const amountHashed = receipt.tokenKind === TokenKind.ETH ?
            ethers.utils.solidityKeccak256(
                ["uint256"],
                [amount],
            ) :
            ethers.utils.solidityKeccak256(
                ["uint256", "address"],
                [amount, ownerAddr],
            )


        const nonce = await this.contract.functions.nonces(ownerAddr)
        log("Hashing", [prefix, ownerAddr, nonce, gatewayAddr, amountHashed])

        return ethers.utils.solidityKeccak256(
            ["string", "address", "uint256", "address", "bytes32"],
            [prefix, ownerAddr, nonce, gatewayAddr, amountHashed],
        )
    }

    async deposit() {
        // let the user do ethGateway.contract.depositXXX ?
    }

}



/**
 * 
 * @param address gateway address
 * @param provider web3 provider
 */
export async function createEthereumGateway(
    address: string,
    provider: ethers.Signer | ethers.providers.Provider)
    : Promise<EthereumGateway> {

    let gatewayContract = new ethers.Contract(address, GatewayABIv2, provider) as GatewayContract_v2
    let version: 1 | 2 = 2
    let vmcAddress: string

    try {
        vmcAddress = await gatewayContract.functions.vmc()
    } catch (error) {
        // need to check if error is effectively "function not found"...
        version = 1
    }

    let vmcContract = null

    if (version === 2) {
        vmcContract = new ethers.Contract(address, ValidatorManagerContractABI, provider)
        return new EthereumGatewayV2(vmcContract, gatewayContract)

    } else {
        gatewayContract = new ethers.Contract(address, GatewayABIv1, provider) as GatewayContract_v1
        return new EthereumGatewayV1(gatewayContract)

    }

}