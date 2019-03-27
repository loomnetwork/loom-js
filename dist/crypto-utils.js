"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tweetnacl_1 = tslib_1.__importDefault(require("tweetnacl"));
function bytesToHex(bytes) {
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
        .toString('hex')
        .toUpperCase();
}
exports.bytesToHex = bytesToHex;
function numberToHex(num) {
    return "0x" + num.toString(16);
}
exports.numberToHex = numberToHex;
function hexToNumber(hex) {
    return parseInt(hex, 16);
}
exports.hexToNumber = hexToNumber;
function hexToBytes(hex) {
    return Buffer.from(hex.startsWith('0x') ? hex.slice(2) : hex, 'hex');
}
exports.hexToBytes = hexToBytes;
function bytesToHexAddr(bytes) {
    return '0x' + bytesToHex(bytes);
}
exports.bytesToHexAddr = bytesToHexAddr;
function getGUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
exports.getGUID = getGUID;
exports.SIGNATURE_LENGTH = tweetnacl_1.default.sign.signatureLength;
exports.PRIVATE_KEY_LENGTH = tweetnacl_1.default.sign.secretKeyLength;
exports.PUBLIC_KEY_LENGTH = tweetnacl_1.default.sign.publicKeyLength;
/**
 * Generates a private key for signing.
 * @returns 64-byte private key.
 */
function generatePrivateKey() {
    var pair = tweetnacl_1.default.sign.keyPair();
    return pair.secretKey;
}
exports.generatePrivateKey = generatePrivateKey;
/**
 * Generates a private key for signing from a seed
 * @param seed Uint8Array with the seed to be used
 * @returns 64-byte private key.
 */
function generatePrivateKeyFromSeed(seed) {
    var pair = tweetnacl_1.default.sign.keyPair.fromSeed(seed);
    return pair.secretKey;
}
exports.generatePrivateKeyFromSeed = generatePrivateKeyFromSeed;
/**
 * Generates the public key that corresponds to the given private key.
 * @param privateKey 64-byte private key.
 * @returns 32-byte public key.
 */
function publicKeyFromPrivateKey(privateKey) {
    var pair = tweetnacl_1.default.sign.keyPair.fromSecretKey(privateKey);
    return pair.publicKey;
}
exports.publicKeyFromPrivateKey = publicKeyFromPrivateKey;
/**
 * Signs a message with the given private key.
 * @param msg Message to be signed.
 * @param privateKey 64-byte private key to sign with.
 * @returns The generated signature.
 */
function sign(msg, privateKey) {
    var sigMsg = tweetnacl_1.default.sign(msg, privateKey);
    return sigMsg.slice(0, exports.SIGNATURE_LENGTH);
}
exports.sign = sign;
/**
 * Encodes bytes to a base64 string.
 * @param bytes Array of bytes to encode to string.
 * @returns base64 encoded string.
 */
function Uint8ArrayToB64(bytes) {
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');
}
exports.Uint8ArrayToB64 = Uint8ArrayToB64;
/**
 * Decodes bytes from a base64 string.
 * @param s String to decode.
 * @returns Array of bytes.
 */
function B64ToUint8Array(s) {
    return Buffer.from(s, 'base64');
}
exports.B64ToUint8Array = B64ToUint8Array;
function bufferToProtobufBytes(input) {
    // Buffer in Node is a Uint8Array, but someone broke a runtime type check in Protobuf 3.4.0,
    // so Protobuf fails to serialize/deserialize Buffer(s). Have to wait for
    // https://github.com/google/protobuf/pull/4378 to make into a release (maybe 3.5.3)
    // so that https://github.com/google/protobuf/issues/1319 is fixed... no one seems to be
    // in any rush to push out a new release though.
    // In the meantime work around the issue by copying the Buffer into a plain Uint8Array:
    return input.constructor === Buffer ? new Uint8Array(input) : input;
}
exports.bufferToProtobufBytes = bufferToProtobufBytes;
//# sourceMappingURL=crypto-utils.js.map