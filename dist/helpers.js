"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var client_1 = require("./client");
var middleware_1 = require("./middleware");
var crypto_utils_1 = require("./crypto-utils");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var rpc_client_factory_1 = require("./rpc-client-factory");
var json_rpc_client_1 = require("./internal/json-rpc-client");
var _1 = require(".");
var address_1 = require("./address");
var debug_1 = tslib_1.__importDefault(require("debug"));
var log = debug_1.default('helpers');
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
function parseUrl(rawUrl) {
    // In NodeJS 10+ and browsers the URL class is a global object.
    // In earlier NodeJS versions it needs to be imported.
    var importURL = true;
    try {
        if (typeof URL !== 'undefined') {
            importURL = false;
        }
    }
    catch (err) {
        // probably ReferenceError: URL is not defined
    }
    if (importURL) {
        var url = require('url');
        return new url.URL(rawUrl);
    }
    return new URL(rawUrl);
}
exports.parseUrl = parseUrl;
function createDefaultClient(dappchainKey, dappchainEndpoint, chainId) {
    var privateKey = crypto_utils_1.B64ToUint8Array(dappchainKey);
    var publicKey = crypto_utils_1.publicKeyFromPrivateKey(privateKey);
    var protocol = rpc_client_factory_1.selectProtocol(dappchainEndpoint);
    var writerSuffix = protocol == json_rpc_client_1.JSONRPCProtocol.HTTP ? '/rpc' : '/websocket';
    var readerSuffix = protocol == json_rpc_client_1.JSONRPCProtocol.HTTP ? '/query' : '/queryws';
    var writer = _1.createJSONRPCClient({
        protocols: [{ url: dappchainEndpoint + writerSuffix }]
    });
    var reader = _1.createJSONRPCClient({
        protocols: [{ url: client_1.overrideReadUrl(dappchainEndpoint + readerSuffix) }]
    });
    var client = new client_1.Client(chainId, writer, reader);
    log('Initialized', dappchainEndpoint);
    client.txMiddleware = createDefaultTxMiddleware(client, privateKey);
    client.on('error', function (msg) {
        log('PlasmaChain connection error', msg);
    });
    var address = new address_1.Address(chainId, _1.LocalAddress.fromPublicKey(publicKey));
    return { client: client, publicKey: publicKey, address: address };
}
exports.createDefaultClient = createDefaultClient;
//# sourceMappingURL=helpers.js.map