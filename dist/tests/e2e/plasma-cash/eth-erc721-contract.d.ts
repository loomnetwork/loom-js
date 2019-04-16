import BN from 'bn.js';
/**
 * Wrapper for a Web3 ERC721 contract.
 */
export declare class EthErc721Contract {
    contract: any;
    /**
     * @param contract Web3 contract instance.
     */
    constructor(contract: any);
    balanceOfAsync(address: string): Promise<BN>;
}
