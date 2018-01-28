class Signed {
    constructor(sig, pubkey) {
        this.sig = sig;
        this.pubkey = pubkey;
    }
}

registerType(Signed, ['sig', 'pubkey']);

class OneSigTx {
    constructor(tx, signed) {
        this.tx = tx;
        this.signed = signed;
    }
}

registerType(OneSigTx, ['tx', 'signed'], 0x16);
