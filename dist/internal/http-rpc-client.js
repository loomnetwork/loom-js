"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var axios_1 = tslib_1.__importDefault(require("axios"));
var events_1 = tslib_1.__importDefault(require("events"));
var debug_1 = tslib_1.__importDefault(require("debug"));
var log = debug_1.default('http-rpc-client');
/**
 * Sends JSON-RPC messages via HTTP.
 * Doesn't support listening to DAppChain events at the moment.
 */
var HTTPRPCClient = /** @class */ (function (_super) {
    tslib_1.__extends(HTTPRPCClient, _super);
    /**
     *
     * @param url
     * @param opts Options object
     * @param opts.requestTimeout Number of milliseconds to wait for a network operation to complete.
     */
    function HTTPRPCClient(url, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this) || this;
        _this.url = url;
        _this._rpcId = 0;
        _this._getNextRequestId = function () { return (++_this._rpcId).toString(); };
        var _a = opts.requestTimeout, requestTimeout = _a === void 0 ? 15000 : _a, // 15s
        _b = opts.generateRequestId, // 15s
        generateRequestId = _b === void 0 ? _this._getNextRequestId : _b;
        _this.requestTimeout = requestTimeout;
        return _this;
    }
    Object.defineProperty(HTTPRPCClient.prototype, "isSubscribed", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    HTTPRPCClient.prototype.disconnect = function () {
        // no persistent connection, so do nothing
    };
    HTTPRPCClient.prototype.ensureConnectionAsync = function () {
        // no persistent connection, so do nothing
        return Promise.resolve();
    };
    /**
     * Sends a JSON-RPC message.
     * @param method RPC method name.
     * @param params Parameter object or array.
     * @returns A promise that will be resolved with the value of the result field (if any) in the
     *          JSON-RPC response message.
     */
    HTTPRPCClient.prototype.sendAsync = function (method, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var req, resp, _a, code, message, data;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        log("Sending RPC msg to " + this.url + ", method " + method);
                        req = {
                            jsonrpc: '2.0',
                            method: method,
                            params: params,
                            id: this._getNextRequestId()
                        };
                        return [4 /*yield*/, axios_1.default.post(this.url, req, {
                                timeout: this.requestTimeout
                            })];
                    case 1:
                        resp = _b.sent();
                        if (resp.data.error) {
                            _a = resp.data.error, code = _a.code, message = _a.message, data = _a.data;
                            throw new Error("JSON-RPC Error " + code + " (" + message + "): " + data);
                        }
                        return [2 /*return*/, resp.data.result];
                }
            });
        });
    };
    return HTTPRPCClient;
}(events_1.default));
exports.HTTPRPCClient = HTTPRPCClient;
//# sourceMappingURL=http-rpc-client.js.map