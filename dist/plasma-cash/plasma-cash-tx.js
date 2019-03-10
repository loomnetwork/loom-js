"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rlp_1 = tslib_1.__importDefault(require("rlp"));
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var address_1 = require("../address");
var big_uint_1 = require("../big-uint");
var crypto_utils_1 = require("../crypto-utils");
var solidity_helpers_1 = require("../solidity-helpers");
var plasma_cash_pb_1 = require("../proto/plasma_cash_pb");
var PlasmaCashTx = /** @class */ (function () {
    function PlasmaCashTx(params) {
        this.slot = params.slot;
        this.prevBlockNum = params.prevBlockNum;
        this.denomination = new bn_js_1.default(params.denomination);
        this.newOwner = params.newOwner;
        this.prevOwner = params.prevOwner;
        this.sigBytes = params.sig;
        this.proofBytes = params.proof;
    }
    PlasmaCashTx.prototype.rlpEncode = function () {
        var data = [
            this.slot.toArrayLike(Buffer, 'be'),
            this.prevBlockNum.toNumber(),
            this.denomination.toNumber(),
            this.newOwner
        ];
        return '0x' + rlp_1.default.encode(data).toString('hex');
    };
    Object.defineProperty(PlasmaCashTx.prototype, "sig", {
        /**
         * Hex encoded signature of the tx, prefixed by "0x".
         */
        get: function () {
            return '0x' + (this.sigBytes ? crypto_utils_1.bytesToHex(Uint8Array.from(this.sigBytes)) : '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlasmaCashTx.prototype, "proof", {
        /**
         * Hex encoded merkle proof of the tx, prefixed by "0x".
         */
        get: function () {
            return '0x' + (this.proofBytes ? crypto_utils_1.bytesToHex(Uint8Array.from(this.proofBytes)) : '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlasmaCashTx.prototype, "hash", {
        /**
         * Hex encoded hash of the tx, prefixed by "0x".
         */
        get: function () {
            if (this.prevBlockNum.cmp(new bn_js_1.default(0)) === 0) {
                return solidity_helpers_1.soliditySha3({ type: 'uint64', value: this.slot.toString() });
            }
            return solidity_helpers_1.soliditySha3({ type: 'bytes', value: this.rlpEncode() });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Signs the tx.
     * @param signer Signer to use for signing the tx.
     */
    PlasmaCashTx.prototype.signAsync = function (signer) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, signer.signAsync(this.hash)];
                    case 1:
                        _a.sigBytes = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PlasmaCashTx;
}());
exports.PlasmaCashTx = PlasmaCashTx;
function unmarshalPlasmaTxPB(rawTx) {
    if (!rawTx.hasNewOwner()) {
        throw new Error('Invalid PlasmaTx: missing new owner');
    }
    var tx = new PlasmaCashTx({
        slot: new bn_js_1.default(rawTx.getSlot()),
        prevBlockNum: rawTx.hasPreviousBlock()
            ? big_uint_1.unmarshalBigUIntPB(rawTx.getPreviousBlock())
            : new bn_js_1.default(0),
        denomination: rawTx.hasDenomination()
            ? big_uint_1.unmarshalBigUIntPB(rawTx.getDenomination())
            : new bn_js_1.default(0),
        newOwner: address_1.Address.UnmarshalPB(rawTx.getNewOwner()).local.toString(),
        sig: rawTx.getSignature_asU8(),
        proof: rawTx.getProof_asU8()
    });
    var sender = rawTx.getSender();
    if (sender) {
        tx.prevOwner = address_1.Address.UnmarshalPB(sender).local.toString();
    }
    return tx;
}
exports.unmarshalPlasmaTxPB = unmarshalPlasmaTxPB;
function marshalPlasmaTxPB(tx) {
    var owner = new address_1.Address('eth', address_1.LocalAddress.fromHexString(tx.newOwner));
    var pb = new plasma_cash_pb_1.PlasmaTx();
    // TODO: protoc TypeScript plugin does't seem to understand annotations in .proto so the type
    // definition is wrong for the slot, it's actually a string that represents a 64-bit number...
    // should fix the plugin or use a different one.
    pb.setSlot(tx.slot.toString(10));
    pb.setPreviousBlock(big_uint_1.marshalBigUIntPB(tx.prevBlockNum));
    pb.setDenomination(big_uint_1.marshalBigUIntPB(tx.denomination));
    pb.setNewOwner(owner.MarshalPB());
    if (tx.prevOwner) {
        var sender = new address_1.Address('eth', address_1.LocalAddress.fromHexString(tx.prevOwner));
        pb.setSender(sender.MarshalPB());
    }
    if (tx.sigBytes) {
        pb.setSignature(crypto_utils_1.bufferToProtobufBytes(tx.sigBytes));
    }
    if (tx.proofBytes) {
        pb.setProof(crypto_utils_1.bufferToProtobufBytes(tx.proofBytes));
    }
    return pb;
}
exports.marshalPlasmaTxPB = marshalPlasmaTxPB;
//# sourceMappingURL=plasma-cash-tx.js.map