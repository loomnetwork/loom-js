import BN from 'bn.js';
import { EthErc721Contract } from './eth-erc721-contract';
export declare class EthCardsContract extends EthErc721Contract {
    registerAsync(address: string): Promise<object>;
    depositToPlasmaAsync(params: {
        tokenId: BN | number;
        from: string;
    }): Promise<object>;
}
