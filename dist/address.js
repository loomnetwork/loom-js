"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ripemd160_1 = tslib_1.__importDefault(require("ripemd160"));
var ethereumjs_util_1 = require("ethereumjs-util");
var crypto_utils_1 = require("./crypto-utils");
var pb = tslib_1.__importStar(require("./proto/loom_pb"));
var LocalAddress = /** @class */ (function () {
    function LocalAddress(bytes) {
        this.bytes = bytes;
    }
    LocalAddress.prototype.isEmpty = function () {
        return this.bytes && this.bytes.length === 0;
    };
    LocalAddress.prototype.toString = function () {
        // TODO: checksum encoding like go-loom
        return ('0x' +
            Buffer.from(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength).toString('hex'));
    };
    LocalAddress.prototype.toChecksumString = function () {
        return ethereumjs_util_1.toChecksumAddress(this.toString());
    };
    LocalAddress.prototype.equals = function (other) {
        // Node API docs say parameters can be Buffer | Uint8Array... so shush TypeScript
        return Buffer.compare(this.bytes, other.bytes) === 0;
    };
    LocalAddress.fromHexString = function (hexAddr) {
        if (!hexAddr.startsWith('0x')) {
            throw new Error('hexAddr argument has no 0x prefix');
        }
        var bytes = Buffer.from(hexAddr.slice(2), 'hex');
        if (bytes.length !== 20) {
            throw new Error("Invalid local address, expected 20 bytes, got " + bytes.length);
        }
        return new LocalAddress(bytes);
    };
    /**
     * Converts a public key to a local address (which is used as unique identifier within a DAppChain).
     * @param publicKey 32-byte public key.
     * @returns Array of bytes representing a local address.
     */
    LocalAddress.fromPublicKey = function (publicKey) {
        if (publicKey.length !== 32) {
            throw new Error("Invalid public key, expected 32 bytes, go " + publicKey.length);
        }
        var hasher = new ripemd160_1.default();
        hasher.update(Buffer.from(publicKey.buffer, publicKey.byteOffset, publicKey.byteLength));
        return new LocalAddress(hasher.digest());
    };
    return LocalAddress;
}());
exports.LocalAddress = LocalAddress;
var Address = /** @class */ (function () {
    function Address(chainId, local) {
        this.chainId = chainId;
        this.local = local;
    }
    Address.prototype.isEmpty = function () {
        return this.chainId === '' && this.local.isEmpty();
    };
    Address.prototype.toString = function () {
        return this.chainId + ":" + this.local.toString();
    };
    Address.prototype.MarshalPB = function () {
        var addr = new pb.Address();
        addr.setChainId(this.chainId);
        addr.setLocal(crypto_utils_1.bufferToProtobufBytes(this.local.bytes));
        return addr;
    };
    Address.prototype.equals = function (other) {
        return this.chainId === other.chainId && this.local.equals(other.local);
    };
    /**
     * @deprecated Use the function UnmarshalPB instead
     */
    Address.UmarshalPB = function (pb) {
        console.warn('Function UmarshalPB is deprecated and should be replaced by UnmarshalPB');
        return Address.UnmarshalPB(pb);
    };
    Address.UnmarshalPB = function (pb) {
        return new Address(pb.getChainId(), new LocalAddress(pb.getLocal_asU8()));
    };
    /**
     * Converts a string to an address.
     * @param address String representation of an address, in the format "chain:0x...".
     */
    Address.fromString = function (address) {
        var parts = address.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid address string');
        }
        return new Address(parts[0], LocalAddress.fromHexString(parts[1]));
    };
    return Address;
}());
exports.Address = Address;
//# sourceMappingURL=address.js.map