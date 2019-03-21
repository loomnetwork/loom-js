import BN from 'bn.js';
import { EthersSigner } from '../solidity-helpers';
import { PlasmaTx } from '../proto/plasma_cash_pb';
export declare class PlasmaCashTx {
    slot: BN;
    prevBlockNum: BN;
    denomination: BN;
    /**
     * Hex-encoded Ethereum address of the new owner of the Plasma token.
     */
    newOwner: string;
    /**
     * Hex-encoded Ethereum address of the previous owner of the Plasma token.
     */
    prevOwner?: string;
    sigBytes?: Uint8Array;
    proofBytes?: Uint8Array;
    constructor(params: {
        slot: BN;
        prevBlockNum: BN;
        denomination: BN | number;
        newOwner: string;
        prevOwner?: string;
        sig?: Uint8Array;
        proof?: Uint8Array;
    });
    rlpEncode(): string;
    /**
     * Hex encoded signature of the tx, prefixed by "0x".
     */
    readonly sig: string;
    /**
     * Hex encoded merkle proof of the tx, prefixed by "0x".
     */
    readonly proof: string;
    /**
     * Hex encoded hash of the tx, prefixed by "0x".
     */
    readonly hash: string;
    /**
     * Signs the tx.
     * @param signer Signer to use for signing the tx.
     */
    signAsync(signer: EthersSigner): Promise<void>;
}
export declare function unmarshalPlasmaTxPB(rawTx: PlasmaTx): PlasmaCashTx;
export declare function marshalPlasmaTxPB(tx: PlasmaCashTx): PlasmaTx;
