"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ethereumjs_util_1 = tslib_1.__importDefault(require("ethereumjs-util"));
var crypto = require('@binance-chain/javascript-sdk').crypto;
/**
 * Signs message using a Binance account.
 * This signer should be used for interactive signing in the browser.
 */
var BinanceSigner = /** @class */ (function () {
    function BinanceSigner(privateKey) {
        this._privateKey = Buffer.from(privateKey, 'hex');
        var address = crypto.getAddressFromPrivateKey(privateKey);
        this._address = '0x' + crypto.decodeAddress(address).toString('hex');
    }
    BinanceSigner.prototype.signAsync = function (msg) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var msgBuf, sig;
            return tslib_1.__generator(this, function (_a) {
                msgBuf = ethereumjs_util_1.default.sha256(msg);
                sig = ethereumjs_util_1.default.ecsign(msgBuf, this._privateKey);
                return [2 /*return*/, Buffer.concat([
                        ethereumjs_util_1.default.toBuffer(4 /* BINANCE */),
                        sig.r,
                        sig.s,
                        ethereumjs_util_1.default.toBuffer(sig.v)
                    ])];
            });
        });
    };
    BinanceSigner.prototype.getAddress = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._address];
            });
        });
    };
    return BinanceSigner;
}());
exports.BinanceSigner = BinanceSigner;
//# sourceMappingURL=binance-signer.js.map