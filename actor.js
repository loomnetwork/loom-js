class Actor {
    constructor(chainId, app, address) {
        this.chainId = chainId;
        this.app = app;
        this.address = address;
    }
}

registerType(Actor, ['chainId', 'app', 'address']);
