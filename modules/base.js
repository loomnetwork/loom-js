class ChainTx {
    constructor(tx, chainId, expiresAt) {
        this.tx = tx;
        this.chainId = chainId;
        this.expiresAt = expiresAt;
    }
}

registerType(ChainTx, ['chainId', 'expiresAt', 'tx'], 0x03);
