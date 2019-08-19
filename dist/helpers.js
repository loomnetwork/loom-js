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
var ethers_1 = require("ethers");
var debug_1 = tslib_1.__importDefault(require("debug"));
exports.ORACLE_SIG_SIZE_WITH_MODE = 134; // '0x'.length + (65 + 1) * 2
exports.ORACLE_SIG_SIZE = 132; // '0x'.length + 65 * 2
/**
 * Given a list of signatures as a concatenated string, it splits the string in an array
 * of signatures, recovers the v/r/s values of each signature, and returns arrays of v, r, s triples
 * which are ordered based on the validators array which was passed in as an argument.
 * The returned values are to be passed as arguments to pass the multisignature check of the
 * functions of the Validator Manager Contract .
 *
 * @param sig Signature (prefixed or not) or list of concatenated signatures
 * @param hash The hash of the message that was s igned
 * @param validators The list of validators which signed on the message
 * @returns Sorted array of v/r/s split signatures to be passed in the Gateway multisig
 */
function parseSigs(sig, hash, validators) {
    var vs = [];
    var rs = [];
    var ss = [];
    var valIndexes = [];
    var sigs;
    if (sig.length === exports.ORACLE_SIG_SIZE_WITH_MODE) {
        // using old oracle but new mainnet contract requires removing the 'mode' bit from the signature
        sigs = ['0x' + sig.slice(4)];
    }
    else if (sig.length === exports.ORACLE_SIG_SIZE) {
        // if the oracle signs without a mode
        sigs = [sig];
    }
    else {
        // else split sig string into 65 byte array of sigs
        sigs = sig
            .slice(2)
            .match(/.{1,130}/g)
            .map(function (s) { return '0x' + s; });
    }
    // Split signature in v,r,s arrays
    // Store the ordering of the validators' signatures in `valIndexes`
    for (var i in sigs) {
        var _hash = ethers_1.ethers.utils.arrayify(ethers_1.ethers.utils.hashMessage(ethers_1.ethers.utils.arrayify(hash)));
        var recAddress = ethers_1.ethers.utils.recoverAddress(_hash, sigs[i]);
        var ind = validators.indexOf(recAddress);
        if (ind == -1) {
            // skip if invalid signature
            continue;
        }
        valIndexes.push(validators.indexOf(recAddress));
        var s = ethers_1.ethers.utils.splitSignature(sigs[i]);
        vs.push(s.v);
        rs.push(s.r);
        ss.push(s.s);
    }
    vs = mapOrder(vs, valIndexes);
    rs = mapOrder(rs, valIndexes);
    ss = mapOrder(ss, valIndexes);
    valIndexes.sort();
    return { vs: vs, rs: rs, ss: ss, valIndexes: valIndexes };
}
exports.parseSigs = parseSigs;
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
function setupProtocolsFromEndpoint(endpoint) {
    var protocol = rpc_client_factory_1.selectProtocol(endpoint);
    var writerSuffix = protocol === json_rpc_client_1.JSONRPCProtocol.HTTP ? '/rpc' : '/websocket';
    var readerSuffix = protocol === json_rpc_client_1.JSONRPCProtocol.HTTP ? '/query' : '/queryws';
    var writer = _1.createJSONRPCClient({
        protocols: [{ url: endpoint + writerSuffix }]
    });
    var reader = _1.createJSONRPCClient({
        protocols: [{ url: client_1.overrideReadUrl(endpoint + readerSuffix) }]
    });
    return { writer: writer, reader: reader };
}
exports.setupProtocolsFromEndpoint = setupProtocolsFromEndpoint;
function createDefaultClient(dappchainKey, dappchainEndpoint, chainId) {
    var privateKey = crypto_utils_1.B64ToUint8Array(dappchainKey);
    var publicKey = crypto_utils_1.publicKeyFromPrivateKey(privateKey);
    var _a = setupProtocolsFromEndpoint(dappchainEndpoint), writer = _a.writer, reader = _a.reader;
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
/**
 * Orders an array of elements based on the order dictated by another array
 * @param array The array of elements to sort
 * @param order Array of indexes based on which the passed array will be sorted
 */
function mapOrder(array, order) {
    if (array.length === 1) {
        return array;
    }
    var sortedArray = [];
    for (var i in order) {
        var ind = order.indexOf(parseInt(i));
        sortedArray.push(array[ind]);
    }
    return sortedArray;
}
function createDefaultEthSignClientAsync(dappchainEndpoint, chainId, wallet) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, writer, reader, client, ethAddress, callerAddress;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setupProtocolsFromEndpoint(dappchainEndpoint), writer = _a.writer, reader = _a.reader;
                    client = new client_1.Client(chainId, writer, reader);
                    log('Initialized', dappchainEndpoint);
                    client.on('error', function (msg) {
                        log('PlasmaChain connection error', msg);
                    });
                    return [4 /*yield*/, wallet.getAddress()];
                case 1:
                    ethAddress = _b.sent();
                    callerAddress = new address_1.Address('eth', _1.LocalAddress.fromHexString(ethAddress));
                    client.txMiddleware = [
                        new middleware_1.NonceTxMiddleware(callerAddress, client),
                        new middleware_1.SignedEthTxMiddleware(wallet)
                    ];
                    return [2 /*return*/, { client: client, callerAddress: callerAddress }];
            }
        });
    });
}
exports.createDefaultEthSignClientAsync = createDefaultEthSignClientAsync;
//# sourceMappingURL=helpers.js.map