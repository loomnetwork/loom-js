import nacl from 'tweetnacl';
import crypto from 'crypto';

const nonceLength = nacl.secretbox.nonceLength;

function passphraseToPrivKey(passphrase) {
    const hasher = crypto.createHash('sha256')
    return new Uint8Array(hasher.update(passphrase).digest());
}

export function seal(message, passphrase) {
    const key = passphraseToPrivKey(passphrase);
    const nonce = nacl.randomBytes(nonceLength);
    const enc = nacl.secretbox(message, nonce, key);
    const box = new Uint8Array(nonce.length + enc.length);
    box.set(nonce);
    box.set(enc, nonce.length);
    return box;
}

export function open(box, passphrase) {
    const key = passphraseToPrivKey(passphrase);
    const nonce = box.slice(0, nonceLength);
    const enc = box.slice(nonceLength);
    return nacl.secretbox.open(enc, nonce, key);
}
