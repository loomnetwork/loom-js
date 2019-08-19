"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debug_1 = tslib_1.__importDefault(require("debug"));
var loom_pb_1 = require("../proto/loom_pb");
var client_1 = require("../client");
var crypto_utils_1 = require("../crypto-utils");
var nonce_tx_middleware_1 = require("./nonce-tx-middleware");
var address_1 = require("../address");
var log = debug_1.default('speculative-nonce-tx-middleware');
/**
 * Wraps data in a NonceTx.
 * This middleware obtains the initial nonce value from the chain, and then increments it locally
 * for every tx, if a tx fails due to a nonce mismatch the chain is queried again to obtain the
 * latest nonce.
 *
 * The CachedNonceTxMiddleware waits for a tx to be commited before incrementing the cached nonce,
 * while the SpeculativeNonceTxMiddleware increments the cached nonce before the tx is even
 * sent to the chain - which makes it possible for a caller to rapidly submit a bunch of txs.
 */
var SpeculativeNonceTxMiddleware = /** @class */ (function () {
    function SpeculativeNonceTxMiddleware(publicKeyOrAccount, client) {
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
        this._fetchNoncePromise = null;
    }
    SpeculativeNonceTxMiddleware.prototype.Handle = function (txData) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tx;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._lastNonce === -1)) return [3 /*break*/, 2];
                        log('Nonce not cached');
                        return [4 /*yield*/, this._updateLastNonce()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this._lastNonce++;
                        log("Next nonce " + this._lastNonce);
                        tx = new loom_pb_1.NonceTx();
                        tx.setInner(txData);
                        tx.setSequence(this._lastNonce);
                        return [2 /*return*/, tx.serializeBinary()];
                }
            });
        });
    };
    SpeculativeNonceTxMiddleware.prototype.HandleResults = function (results) {
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
        return results;
    };
    SpeculativeNonceTxMiddleware.prototype.handleError = function (err) {
        if (client_1.isTxAlreadyInCacheError(err)) {
            // This error indicates the tx payload & nonce were identical to a previously sent tx,
            // which means the cached nonce has diverged from the nonce on the node, need to clear it out
            // so it's refetched for the next tx.
            this._lastNonce = -1;
            // TODO: start a timeout so nonce isn't requeried too soon
            log('Reset cached nonce due to dupe tx');
        }
    };
    SpeculativeNonceTxMiddleware.prototype._updateLastNonce = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                // make sure only one request is in flight at any time
                if (this._fetchNoncePromise) {
                    return [2 /*return*/, this._fetchNoncePromise];
                }
                this._fetchNoncePromise = this._fetchNonce();
                this._fetchNoncePromise
                    .then(function () { return (_this._fetchNoncePromise = null); })
                    .catch(function () { return (_this._fetchNoncePromise = null); });
                return [2 /*return*/, this._fetchNoncePromise];
            });
        });
    };
    SpeculativeNonceTxMiddleware.prototype._fetchNonce = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var key, account, _a, err_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        log('Fetching nonce...');
                        key = this._publicKey ? crypto_utils_1.bytesToHex(this._publicKey) : undefined;
                        account = this._account ? this._account.toString() : undefined;
                        _a = this;
                        return [4 /*yield*/, this._client.getAccountNonceAsync({ key: key, account: account })];
                    case 1:
                        _a._lastNonce = _b.sent();
                        log("Fetched nonce " + this._lastNonce);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _b.sent();
                        throw Error('Failed to obtain latest nonce');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SpeculativeNonceTxMiddleware;
}());
exports.SpeculativeNonceTxMiddleware = SpeculativeNonceTxMiddleware;
//# sourceMappingURL=speculative-nonce-tx-middleware.js.map