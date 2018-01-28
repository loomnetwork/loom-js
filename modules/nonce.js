class NonceTx {
    constructor(tx, sequence, signers) {
        this.tx = tx;
        this.sequence = sequence;
        this.signers = signers;
    }
}

registerType(NonceTx, ['sequence', 'signers', 'tx'], 0x69);
