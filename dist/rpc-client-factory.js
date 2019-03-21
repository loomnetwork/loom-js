"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var json_rpc_client_1 = require("./internal/json-rpc-client");
var ws_rpc_client_1 = require("./internal/ws-rpc-client");
var http_rpc_client_1 = require("./internal/http-rpc-client");
var dual_rpc_client_1 = require("./internal/dual-rpc-client");
/**
 * Creates an RPC client for communicating with a Loom DAppChain based on the specified options.
 * @param opts Options object
 * @param opts.protocols
 * @param opts.autoConnect If `true` the client will automatically connect after being created,
 *                         defaults to `true` and shouldn't be changed.
 * @param opts.requestTimeout Maximum number of milliseconds the client should wait for a request
 *                            to receive a response.
 * @param opts.generateRequestId Can be set to override the default JSON-RPC message ID generator.
 */
function createJSONRPCClient(opts) {
    var protocols = opts.protocols, _a = opts.autoConnect, autoConnect = _a === void 0 ? true : _a, requestTimeout = opts.requestTimeout, generateRequestId = opts.generateRequestId;
    if (protocols.length === 1) {
        var _b = protocols[0], url = _b.url, otherOpts = tslib_1.__rest(_b, ["url"]);
        var protocol = selectProtocol(url);
        if (protocol === json_rpc_client_1.JSONRPCProtocol.HTTP) {
            return new http_rpc_client_1.HTTPRPCClient(url, { requestTimeout: requestTimeout, generateRequestId: generateRequestId });
        }
        else if (protocol === json_rpc_client_1.JSONRPCProtocol.WS) {
            return new ws_rpc_client_1.WSRPCClient(url, tslib_1.__assign({ autoConnect: autoConnect, requestTimeout: requestTimeout, generateRequestId: generateRequestId }, otherOpts));
        }
    }
    else if (protocols.length === 2) {
        var p1 = selectProtocol(protocols[0].url);
        var p2 = selectProtocol(protocols[1].url);
        if (p1 === json_rpc_client_1.JSONRPCProtocol.HTTP && p2 === json_rpc_client_1.JSONRPCProtocol.WS) {
            var _c = protocols[1], reconnectInterval = _c.reconnectInterval, maxReconnects = _c.maxReconnects;
            return new dual_rpc_client_1.DualRPCClient({
                httpUrl: protocols[0].url,
                wsUrl: protocols[1].url,
                autoConnect: autoConnect,
                protocol: p1,
                requestTimeout: requestTimeout,
                generateRequestId: generateRequestId,
                reconnectInterval: reconnectInterval,
                maxReconnects: maxReconnects
            });
        }
        else if (p2 === json_rpc_client_1.JSONRPCProtocol.HTTP && p1 === json_rpc_client_1.JSONRPCProtocol.WS) {
            var _d = protocols[0], reconnectInterval = _d.reconnectInterval, maxReconnects = _d.maxReconnects;
            return new dual_rpc_client_1.DualRPCClient({
                httpUrl: protocols[1].url,
                wsUrl: protocols[0].url,
                autoConnect: autoConnect,
                protocol: p1,
                requestTimeout: requestTimeout,
                generateRequestId: generateRequestId,
                reconnectInterval: reconnectInterval,
                maxReconnects: maxReconnects
            });
        }
    }
    throw new Error('Failed to create JSON-RPC client: invalid protocol configuration');
}
exports.createJSONRPCClient = createJSONRPCClient;
function selectProtocol(url) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return json_rpc_client_1.JSONRPCProtocol.HTTP;
    }
    else if (url.startsWith('ws://') || url.startsWith('wss://')) {
        return json_rpc_client_1.JSONRPCProtocol.WS;
    }
    else {
        throw new Error('Invalid URL');
    }
}
exports.selectProtocol = selectProtocol;
//# sourceMappingURL=rpc-client-factory.js.map