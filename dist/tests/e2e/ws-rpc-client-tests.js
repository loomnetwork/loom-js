"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var ws_rpc_client_1 = require("../../internal/ws-rpc-client");
var json_rpc_client_1 = require("../../internal/json-rpc-client");
var helpers_1 = require("../helpers");
var dual_rpc_client_1 = require("../../internal/dual-rpc-client");
function closeSocket(client) {
    ;
    client._client.close(3000);
}
function ensureSubscriptionAsync(client) {
    if (client.isSubscribed) {
        return Promise.resolve();
    }
    return new Promise(function (resolve, reject) {
        var timeout = setTimeout(function () { return reject(new Error('Timeout waiting for subscription')); }, client.requestTimeout);
        client.once(json_rpc_client_1.RPCClientEvent.Subscribed, function (url, isSubscribed) {
            clearTimeout(timeout);
            if (isSubscribed) {
                resolve();
            }
            else {
                reject(new Error('Subscription inactive'));
            }
        });
    });
}
function ensureUnsubscriptionAsync(client) {
    if (!client.isSubscribed) {
        return Promise.resolve();
    }
    return new Promise(function (resolve, reject) {
        var timeout = setTimeout(function () { return reject(new Error('Timeout waiting for unsubscription')); }, client.requestTimeout);
        client.once(json_rpc_client_1.RPCClientEvent.Subscribed, function (url, isSubscribed) {
            clearTimeout(timeout);
            if (!isSubscribed) {
                resolve();
            }
            else {
                reject(new Error('Subscription active'));
            }
        });
    });
}
function testClientOnlyMaintainsEventSubscriptionWhenListenersExist(t, client) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var listener;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client.on(json_rpc_client_1.RPCClientEvent.Error, function (url, err) {
                        t.error(err);
                    });
                    return [4 /*yield*/, client.ensureConnectionAsync()];
                case 1:
                    _a.sent();
                    listener = function () { };
                    client.on(json_rpc_client_1.RPCClientEvent.Message, listener);
                    return [4 /*yield*/, ensureSubscriptionAsync(client)];
                case 2:
                    _a.sent();
                    t.ok(client.isSubscribed, 'Should auto-subscribe to DAppChain events');
                    client.removeListener(json_rpc_client_1.RPCClientEvent.Message, listener);
                    return [4 /*yield*/, ensureUnsubscriptionAsync(client)];
                case 3:
                    _a.sent();
                    t.ok(!client.isSubscribed, 'Should auto-unsubscribe from DAppChain events');
                    return [2 /*return*/];
            }
        });
    });
}
function testClientReestablishedEventSubscriptionAfterReconnect(t, client) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var listener;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client.on(json_rpc_client_1.RPCClientEvent.Error, function (url, err) {
                        t.error(err);
                    });
                    return [4 /*yield*/, client.ensureConnectionAsync()];
                case 1:
                    _a.sent();
                    listener = function () { };
                    client.on(json_rpc_client_1.RPCClientEvent.Message, listener);
                    return [4 /*yield*/, ensureSubscriptionAsync(client)];
                case 2:
                    _a.sent();
                    closeSocket(client);
                    return [4 /*yield*/, ensureUnsubscriptionAsync(client)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, client.ensureConnectionAsync()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, ensureSubscriptionAsync(client)];
                case 5:
                    _a.sent();
                    t.ok(client.isSubscribed, 'Should auto-subscribe to DAppChain events after reconnect');
                    return [2 /*return*/];
            }
        });
    });
}
tape_1.default('WSRPCClient', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var client, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                client = new ws_rpc_client_1.WSRPCClient(helpers_1.getTestUrls().wsReadUrl, { requestTimeout: 1000 });
                return [4 /*yield*/, testClientOnlyMaintainsEventSubscriptionWhenListenersExist(t, client)];
            case 2:
                _a.sent();
                client.disconnect();
                client = new ws_rpc_client_1.WSRPCClient(helpers_1.getTestUrls().wsReadUrl, {
                    requestTimeout: 2000,
                    reconnectInterval: 100
                });
                return [4 /*yield*/, testClientReestablishedEventSubscriptionAfterReconnect(t, client)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                t.fail(err_1);
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('DualRPCClient', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var client, err_2;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                client = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                client = new dual_rpc_client_1.DualRPCClient({
                    httpUrl: helpers_1.getTestUrls().httpReadUrl,
                    wsUrl: helpers_1.getTestUrls().wsReadUrl,
                    requestTimeout: 1000
                });
                return [4 /*yield*/, testClientOnlyMaintainsEventSubscriptionWhenListenersExist(t, client)];
            case 2:
                _a.sent();
                client.disconnect();
                client = new dual_rpc_client_1.DualRPCClient({
                    httpUrl: helpers_1.getTestUrls().httpReadUrl,
                    wsUrl: helpers_1.getTestUrls().wsReadUrl,
                    requestTimeout: 2000,
                    reconnectInterval: 100
                });
                return [4 /*yield*/, testClientReestablishedEventSubscriptionAfterReconnect(t, client)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                t.fail(err_2);
                return [3 /*break*/, 5];
            case 5:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=ws-rpc-client-tests.js.map