"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debug_1 = tslib_1.__importDefault(require("debug"));
var loom_pb_1 = require("../proto/loom_pb");
var client_1 = require("../client");
var crypto_utils_1 = require("../crypto-utils");
var nonce_tx_middleware_1 = require("./nonce-tx-middleware");
var address_1 = require("../address");
var log = debug_1.default('cached-nonce-tx-middleware');
/**
 * Wraps data in a NonceTx.
 * This middleware obtains the initial nonce value from the chain, and then increments it locally
 * for every tx, if a tx fails due to a nonce mismatch the chain is queried again to obtain the
 * latest nonce.
 */
var CachedNonceTxMiddleware = /** @class */ (function () {
    function CachedNonceTxMiddleware(publicKeyOrAccount, client) {
        this._publicKey = null;
        this._account = null;
        if (publicKeyOrAccount instanceof address_1.Address) {
            this._account = publicKeyOrAccount;
        }
        else {
            this._publicKey = publicKeyOrAccount;
        }
        this._client = client;
        this._lastNonce = -1;
    }
    CachedNonceTxMiddleware.prototype.Handle = function (txData) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var key, account, _a, err_1, tx;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._lastNonce === -1)) return [3 /*break*/, 4];
                        log('Nonce not cached');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        key = this._publicKey ? crypto_utils_1.bytesToHex(this._publicKey) : undefined;
                        account = this._account ? this._account.toString() : undefined;
                        _a = this;
                        return [4 /*yield*/, this._client.getAccountNonceAsync({ key: key, account: account })];
                    case 2:
                        _a._lastNonce = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        throw Error('Failed to obtain latest nonce');
                    case 4:
                        log("Next nonce " + (this._lastNonce + 1));
                        tx = new loom_pb_1.NonceTx();
                        tx.setInner(txData);
                        tx.setSequence(this._lastNonce + 1);
                        return [2 /*return*/, tx.serializeBinary()];
                }
            });
        });
    };
    CachedNonceTxMiddleware.prototype.HandleResults = function (results) {
        var validation = results.validation, commit = results.commit;
        var isInvalidTx = validation && validation.code !== 0;
        var isFailedTx = commit && commit.code;
        if (isInvalidTx || isFailedTx) {
            // Nonce has to be reset regardless of the cause of the tx failure.
            log("Reset cached nonce due to failed tx");
            this._lastNonce = -1;
            // Throw a specific error for a nonce mismatch
            var isCheckTxNonceInvalid = validation &&
                validation.code === 1 &&
                (validation.log && validation.log.indexOf('sequence number does not match') !== -1);
            var isDeliverTxNonceInvalid = commit &&
                commit.code === 1 &&
                (commit.log && commit.log.indexOf('sequence number does not match') !== -1);
            if (isCheckTxNonceInvalid || isDeliverTxNonceInvalid) {
                throw new Error(nonce_tx_middleware_1.INVALID_TX_NONCE_ERROR);
            }
        }
        else if (this._lastNonce !== -1) {
            // Only increment the nonce if the tx is valid
            this._lastNonce++;
            log("Incremented cached nonce to " + this._lastNonce);
        }
        return results;
    };
    CachedNonceTxMiddleware.prototype.handleError = function (err) {
        if (client_1.isTxAlreadyInCacheError(err)) {
            // This error indicates the tx payload & nonce were identical to a previously sent tx,
            // which means the cached nonce has diverged from the nonce on the node, need to clear it out
            // so it's refetched for the next tx.
            this._lastNonce = -1;
            log('Reset cached nonce due to dupe tx');
        }
    };
    return CachedNonceTxMiddleware;
}());
exports.CachedNonceTxMiddleware = CachedNonceTxMiddleware;
//# sourceMappingURL=cached-nonce-tx-middleware.js.map