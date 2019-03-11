"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rpc_websockets_1 = require("rpc-websockets");
var events_1 = require("events");
var debug_1 = tslib_1.__importDefault(require("debug"));
var json_rpc_client_1 = require("./json-rpc-client");
var log = debug_1.default('ws-rpc-client');
/**
 * Sends JSON-RPC messages via web sockets.
 */
var WSRPCClient = /** @class */ (function (_super) {
    tslib_1.__extends(WSRPCClient, _super);
    /**
     *
     * @param url
     * @param opts Options object
     * @param opts.requestTimeout Number of milliseconds to wait for a network operation to complete.
     * @param opts.reconnectInterval Number of milliseconds to wait before attempting to reconnect
     *                               (in case the connection drops out).
     * @param opts.maxReconnects Maximum number of times to reconnect, defaults to infinity.
     */
    function WSRPCClient(url, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this) || this;
        _this.url = url;
        _this._isSubcribed = false;
        _this._rpcId = 0;
        _this._getNextRequestId = function () { return (++_this._rpcId).toString(); };
        _this._onEventMessage = function (message) {
            var msgStr = message instanceof ArrayBuffer ? Buffer.from(message).toString() : message;
            var msg = JSON.parse(msgStr);
            // Events from native loomchain have the id equals 0
            if (msg.id === '0') {
                log('Loom Event arrived', msg);
                _this.emit(json_rpc_client_1.RPCClientEvent.Message, _this.url, msg);
            }
            // Events from EVM have the id from the evmsubscribe command
            if (/^0x.+$/.test(msg.id)) {
                log('EVM Event arrived', msg);
                _this.emit(json_rpc_client_1.RPCClientEvent.EVMMessage, _this.url, msg);
            }
        };
        var _a = opts.autoConnect, autoConnect = _a === void 0 ? true : _a, _b = opts.requestTimeout, requestTimeout = _b === void 0 ? 15000 : _b, // 15s
        reconnectInterval = opts.reconnectInterval, _c = opts.maxReconnects, maxReconnects = _c === void 0 ? 0 : _c, // 0 means there is no limit
        _d = opts.generateRequestId, // 0 means there is no limit
        generateRequestId = _d === void 0 ? _this._getNextRequestId : _d;
        _this._client = new rpc_websockets_1.Client(url, {
            autoconnect: autoConnect,
            reconnect: true,
            reconnect_interval: reconnectInterval,
            max_reconnects: maxReconnects
        }, generateRequestId);
        _this.requestTimeout = requestTimeout;
        _this.on('newListener', function (event) {
            if (event === json_rpc_client_1.RPCClientEvent.Message && _this.listenerCount(event) === 0) {
                // rpc-websockets is just going to throw away the event messages from the DAppChain because
                // they don't conform to it's idea of notifications or events... fortunately few things in
                // javascript are truly private... so we'll just handle those event message ourselves ;)
                ;
                _this._client.socket.on('message', _this._onEventMessage);
                if (_this._client.ready) {
                    log('Subscribe for events without topics');
                    _this._client
                        .call('subevents', { topics: null }, _this.requestTimeout)
                        .then(function () {
                        _this._isSubcribed = true;
                        _this.emit(json_rpc_client_1.RPCClientEvent.Subscribed, _this.url, true);
                    })
                        .catch(function (err) { return _this.emit(json_rpc_client_1.RPCClientEvent.Error, _this.url, err); });
                }
            }
            if (event === json_rpc_client_1.RPCClientEvent.EVMMessage && _this.listenerCount(event) === 0) {
                ;
                _this._client.socket.on('message', _this._onEventMessage);
            }
        });
        _this.on('removeListener', function (event) {
            if (event === json_rpc_client_1.RPCClientEvent.Message && _this.listenerCount(event) === 0) {
                ;
                _this._client.socket.removeListener('message', _this._onEventMessage);
                if (_this._client.ready) {
                    log('Unsubscribed for events');
                    _this._client
                        .call('unsubevents', { topics: null }, _this.requestTimeout)
                        .then(function () {
                        _this._isSubcribed = false;
                        _this.emit(json_rpc_client_1.RPCClientEvent.Subscribed, _this.url, false);
                    })
                        .catch(function (err) {
                        _this.emit(json_rpc_client_1.RPCClientEvent.Error, _this.url, err);
                    });
                }
            }
            if (event === json_rpc_client_1.RPCClientEvent.EVMMessage && _this.listenerCount(event) === 0) {
                ;
                _this._client.socket.removeListener('message', _this._onEventMessage);
            }
        });
        _this._client.on('open', function () {
            _this.emit(json_rpc_client_1.RPCClientEvent.Connected, _this.url);
            if (_this.listenerCount(json_rpc_client_1.RPCClientEvent.Message) > 0) {
                log('Subscribe for events without topics');
                _this._client
                    .call('subevents', { topics: null }, _this.requestTimeout)
                    .then(function () {
                    _this._isSubcribed = true;
                    _this.emit(json_rpc_client_1.RPCClientEvent.Subscribed, _this.url, true);
                })
                    .catch(function (err) { return _this.emit(json_rpc_client_1.RPCClientEvent.Error, _this.url, err); });
            }
        });
        _this._client.on('close', function () {
            if (_this.listenerCount(json_rpc_client_1.RPCClientEvent.Message) > 0) {
                _this._isSubcribed = false;
                _this.emit(json_rpc_client_1.RPCClientEvent.Subscribed, _this.url, false);
            }
            _this.emit(json_rpc_client_1.RPCClientEvent.Disconnected, _this.url);
        });
        _this._client.on('error', function (err) { return _this.emit(json_rpc_client_1.RPCClientEvent.Error, _this.url, err); });
        return _this;
    }
    Object.defineProperty(WSRPCClient.prototype, "isSubscribed", {
        get: function () {
            return this._isSubcribed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gracefully closes the underlying web socket connection.
     */
    WSRPCClient.prototype.disconnect = function () {
        // if `max_reconnects` is zero the client will attempt to reconnect even if `reconnect` is `false`,
        // this seems like a bug in rpc-websockets, but the workaround is simple enough...
        this._client.max_reconnects = 1;
        this._client.reconnect = false;
        this._client.close(0);
    };
    /**
     * Waits for a connection to be established to the server (if it isn't already).
     * @returns A promise that will be resolved when a connection is established.
     */
    WSRPCClient.prototype.ensureConnectionAsync = function () {
        var _this = this;
        if (this._client.ready) {
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            var timeout = setTimeout(function () { return reject(new Error('[WSRPCClient] Timeout while waiting for connection')); }, _this.requestTimeout);
            _this._client.once('open', function () {
                clearTimeout(timeout);
                resolve();
            });
        });
    };
    /**
     * Sends a JSON-RPC message.
     * @param method RPC method name.
     * @param params Parameter object or array.
     * @returns A promise that will be resolved with the value of the result field (if any) in the
     *          JSON-RPC response message.
     */
    WSRPCClient.prototype.sendAsync = function (method, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureConnectionAsync()];
                    case 1:
                        _a.sent();
                        log("Sending RPC msg to " + this.url + ", method " + method);
                        return [2 /*return*/, this._client.call(method, params, this.requestTimeout)];
                }
            });
        });
    };
    return WSRPCClient;
}(events_1.EventEmitter));
exports.WSRPCClient = WSRPCClient;
//# sourceMappingURL=ws-rpc-client.js.map