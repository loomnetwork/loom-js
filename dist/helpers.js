"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var middleware_1 = require("./middleware");
var crypto_utils_1 = require("./crypto-utils");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
/**
 * Creates the default set of tx middleware required to successfully commit a tx to a Loom DAppChain.
 * @param client The client the middleware is being created for.
 * @param privateKey Private key that should be used to sign txs.
 * @returns Set of middleware.
 */
function createDefaultTxMiddleware(client, privateKey) {
    var pubKey = crypto_utils_1.publicKeyFromPrivateKey(privateKey);
    return [new middleware_1.NonceTxMiddleware(pubKey, client), new middleware_1.SignedTxMiddleware(privateKey)];
}
exports.createDefaultTxMiddleware = createDefaultTxMiddleware;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.sleep = sleep;
/**
 * @param num Ethers BigNumber object, e.g. { _hex: '0x123' }.
 * Need to take the _hex, strip the '0x' and then make a hex BN
 */
function hexBN(num) {
    return new bn_js_1.default(num._hex.slice(2), 16);
}
exports.hexBN = hexBN;
//# sourceMappingURL=helpers.js.map