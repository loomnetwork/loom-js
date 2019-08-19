"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ethereumjs_util_1 = tslib_1.__importDefault(require("ethereumjs-util"));
/**
 * Signs message using a TronWeb account.
 * This signer should be used for interactive signing in the browser with TronLink.
 */
var TronWebSigner = /** @class */ (function () {
    /**
     * @param tronweb tronweb instance to use for signing.
     * @param accountAddress Address of tronweb account to sign with.
     */
    function TronWebSigner(tronWeb, accountAddress) {
        this._tronWeb = tronWeb;
        this._address = accountAddress;
    }
    /**
     * Signs a message.
     * @param msg Message to sign.
     * @returns Promise that will be resolved with the signature bytes.
     */
    TronWebSigner.prototype.signAsync = function (msg) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var signature, sig, r, s, v;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._tronWeb.trx.sign(msg)];
                    case 1:
                        signature = _a.sent();
                        sig = signature.slice(2);
                        r = ethereumjs_util_1.default.toBuffer('0x' + sig.substring(0, 64));
                        s = ethereumjs_util_1.default.toBuffer('0x' + sig.substring(64, 128));
                        v = parseInt(sig.substring(128, 130), 16);
                        if (v === 0 || v === 1) {
                            v += 27;
                        }
                        return [2 /*return*/, Buffer.concat([
                                ethereumjs_util_1.default.toBuffer(3 /* TRON */),
                                r,
                                s,
                                ethereumjs_util_1.default.toBuffer(v)
                            ])];
                }
            });
        });
    };
    /**
     * Returns signer address
     */
    TronWebSigner.prototype.getAddress = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._address];
            });
        });
    };
    return TronWebSigner;
}());
exports.TronWebSigner = TronWebSigner;
//# sourceMappingURL=tron-web-signer.js.map