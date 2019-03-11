"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ethereumjs_util_1 = tslib_1.__importDefault(require("ethereumjs-util"));
var web3_1 = tslib_1.__importDefault(require("web3"));
var ethers_1 = require("ethers");
var web3 = new web3_1.default();
function soliditySha3() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    var _a;
    return (_a = web3.utils).soliditySha3.apply(_a, values);
}
exports.soliditySha3 = soliditySha3;
/**
 * Signs message using a Web3 account.
 * This signer should be used for interactive signing in the browser with MetaMask.
 */
var EthersSigner = /** @class */ (function () {
    /**
     * @param web3 Web3 instance to use for signing.
     * @param accountAddress Address of web3 account to sign with.
     */
    function EthersSigner(wallet) {
        this._wallet = wallet;
    }
    /**
     * Signs a message.
     * @param msg Message to sign.
     * @returns Promise that will be resolved with the signature bytes.
     */
    EthersSigner.prototype.signAsync = function (msg) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var flatSig, sig, v;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._wallet.signMessage(ethers_1.ethers.utils.arrayify(msg))];
                    case 1:
                        flatSig = _a.sent();
                        sig = ethers_1.ethers.utils.splitSignature(flatSig);
                        v = sig.v;
                        if (v === 0 || v === 1) {
                            v += 27;
                        }
                        flatSig = '0x01' + sig.r.slice(2) + sig.s.slice(2) + v.toString(16);
                        return [2 /*return*/, ethereumjs_util_1.default.toBuffer(flatSig)];
                }
            });
        });
    };
    return EthersSigner;
}());
exports.EthersSigner = EthersSigner;
/**
 * Signs message using a Web3 account.
 * This signer should be used for interactive signing in the browser with MetaMask.
 */
var Web3Signer = /** @class */ (function () {
    /**
     * @param web3 Web3 instance to use for signing.
     * @param accountAddress Address of web3 account to sign with.
     */
    function Web3Signer(web3, accountAddress) {
        this._web3 = web3;
        this._address = accountAddress;
    }
    /**
     * Signs a message.
     * @param msg Message to sign.
     * @returns Promise that will be resolved with the signature bytes.
     */
    Web3Signer.prototype.signAsync = function (msg) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var signature, sig, mode, r, s, v;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._web3.eth.sign(msg, this._address)];
                    case 1:
                        signature = _a.sent();
                        sig = signature.slice(2);
                        mode = 1 // Geth
                        ;
                        r = ethereumjs_util_1.default.toBuffer('0x' + sig.substring(0, 64));
                        s = ethereumjs_util_1.default.toBuffer('0x' + sig.substring(64, 128));
                        v = parseInt(sig.substring(128, 130), 16);
                        if (v === 0 || v === 1) {
                            v += 27;
                        }
                        else {
                            mode = 0; // indicate that msg wasn't prefixed before signing (MetaMask doesn't prefix!)
                        }
                        return [2 /*return*/, Buffer.concat([ethereumjs_util_1.default.toBuffer(mode), r, s, ethereumjs_util_1.default.toBuffer(v)])];
                }
            });
        });
    };
    return Web3Signer;
}());
exports.Web3Signer = Web3Signer;
/**
 * THIS IS BEING DEPRECATED
 * Signs message using a Web3 account.
 * This signer should be used for signing in NodeJS.
 */
var OfflineWeb3Signer = /** @class */ (function () {
    /**
     * @param web3 Web3 instance to use for signing.
     * @param account Web3 account to sign with.
     */
    function OfflineWeb3Signer(web3, account) {
        this._web3 = web3;
        this._account = account;
    }
    /**
     * Signs a message.
     * @param msg Message to sign.
     * @returns Promise that will be resolved with the signature bytes.
     */
    OfflineWeb3Signer.prototype.signAsync = function (msg) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ret, sig, mode, r, s, v;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._web3.eth.accounts.sign(msg, this._account.privateKey)
                        // @ts-ignore
                    ];
                    case 1:
                        ret = _a.sent();
                        sig = ret.signature.slice(2);
                        mode = 1 // Geth
                        ;
                        r = ethereumjs_util_1.default.toBuffer('0x' + sig.substring(0, 64));
                        s = ethereumjs_util_1.default.toBuffer('0x' + sig.substring(64, 128));
                        v = parseInt(sig.substring(128, 130), 16);
                        return [2 /*return*/, Buffer.concat([ethereumjs_util_1.default.toBuffer(mode), r, s, ethereumjs_util_1.default.toBuffer(v)])];
                }
            });
        });
    };
    return OfflineWeb3Signer;
}());
exports.OfflineWeb3Signer = OfflineWeb3Signer;
//# sourceMappingURL=solidity-helpers.js.map