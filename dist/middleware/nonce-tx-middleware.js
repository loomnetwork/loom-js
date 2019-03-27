"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debug_1 = tslib_1.__importDefault(require("debug"));
var address_1 = require("../address");
var crypto_utils_1 = require("../crypto-utils");
var loom_pb_1 = require("../proto/loom_pb");
var log = debug_1.default('nonce-tx-middleware');
exports.INVALID_TX_NONCE_ERROR = 'Invalid tx nonce';
function isInvalidTxNonceError(err) {
    return err instanceof Error && err.message === exports.INVALID_TX_NONCE_ERROR;
}
exports.isInvalidTxNonceError = isInvalidTxNonceError;
/**
 * Wraps data in a NonceTx.
 * This middleware obtains the latest nonce from the chain for each tx.
 * The Loom DAppChain keeps track of the nonce of the last committed tx to prevent replay attacks.
 */
var NonceTxMiddleware = /** @class */ (function () {
    function NonceTxMiddleware(publicKeyOrAccount, client) {
        this._publicKey = null;
        this._account = null;
        if (publicKeyOrAccount instanceof address_1.Address) {
            this._account = publicKeyOrAccount;
        }
        else {
            this._publicKey = publicKeyOrAccount;
        }
        this._client = client;
    }
    NonceTxMiddleware.prototype.Handle = function (txData) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var key, account, nonce, tx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this._publicKey ? crypto_utils_1.bytesToHex(this._publicKey) : undefined;
                        account = this._account ? this._account.toString() : undefined;
                        return [4 /*yield*/, this._client.getAccountNonceAsync({ key: key, account: account })];
                    case 1:
                        nonce = _a.sent();
                        log("Next nonce " + (nonce + 1));
                        tx = new loom_pb_1.NonceTx();
                        tx.setInner(txData);
                        tx.setSequence(nonce + 1);
                        return [2 /*return*/, tx.serializeBinary()];
                }
            });
        });
    };
    NonceTxMiddleware.prototype.HandleResults = function (results) {
        var validation = results.validation, commit = results.commit;
        if (validation &&
            validation.code === 1 &&
            (validation.log && validation.log.indexOf('sequence number does not match') !== -1)) {
            throw new Error(exports.INVALID_TX_NONCE_ERROR);
        }
        if (commit &&
            commit.code === 1 &&
            (commit.log && commit.log.indexOf('sequence number does not match') !== -1)) {
            throw new Error(exports.INVALID_TX_NONCE_ERROR);
        }
        return results;
    };
    return NonceTxMiddleware;
}());
exports.NonceTxMiddleware = NonceTxMiddleware;
//# sourceMappingURL=nonce-tx-middleware.js.map