import { registerType } from './wire';

export default class Actor {
    constructor(address, app = 'sigs', chainId = '') {
        this.chainId = chainId;
        this.app = app;
        this.address = address;
    }
}

registerType(Actor, ['chainId', 'app', 'address']);
