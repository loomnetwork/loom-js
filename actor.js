import { registerType } from './wire';

function parseAddress(address) {
    if (typeof address == 'string') {
        if (address.startsWith('0x')) {
            address = address.slice(2);
        }

        return new Buffer(address, 'hex')
    }

    return new Buffer(address);
}

export default class Actor {
    constructor(address, app = 'sigs', chainId = '') {
        this.chainId = chainId;
        this.app = app;
        this.address = parseAddress(address);
    }
}

registerType(Actor, ['chainId', 'app', 'address'], 0x00);
