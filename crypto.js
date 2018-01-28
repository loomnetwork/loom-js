import nacl from 'tweetnacl';
import ripemd160 from 'ripemd160';
import { Writer, writeObject } from './wire';

const typeEd25519 = 0x01;

export function pubKeyAddress(pubKey) {
    const encKey = new Writer();
    writeObject(encKey, new Buffer(pubKey));

    const hasher = new ripemd160();
    hasher.update(new Buffer([typeEd25519]));
    hasher.update(encKey.getBuffer());
    return new Uint8Array(hasher.digest())
}

export function sign(msg, privKey) {
    const sigMsg = nacl.sign(msg, privKey);
    return sigMsg.slice(0, 64);
}

module.exports.pubKeyFromPrivKey = nacl.sign.keyPair.fromSecretKey;
