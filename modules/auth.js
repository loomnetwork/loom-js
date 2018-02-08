import { registerType } from '../wire';

export class Signed {
    constructor(sig, pubkey) {
        this.sig = sig;
        this.pubkey = pubkey;
    }
}

registerType(Signed, ['sig', 'pubkey'], 0x00);

export class OneSigTx {
    constructor(tx, signed) {
        this.tx = tx;
        this.signed = signed;
    }
}

registerType(OneSigTx, ['tx', 'signed'], 0x16);
