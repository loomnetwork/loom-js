"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var http_rpc_client_1 = require("../../internal/http-rpc-client");
var ws_rpc_client_1 = require("../../internal/ws-rpc-client");
var dual_rpc_client_1 = require("../../internal/dual-rpc-client");
tape_1.default('RPC Client Factory', function (t) {
    try {
        var autoConnect = false;
        var client = index_1.createJSONRPCClient({ protocols: [{ url: 'http://localhost' }], autoConnect: autoConnect });
        t.ok(client instanceof http_rpc_client_1.HTTPRPCClient, 'Should create HTTPRPCClient for http url');
        client = index_1.createJSONRPCClient({ protocols: [{ url: 'https://localhost' }], autoConnect: autoConnect });
        t.ok(client instanceof http_rpc_client_1.HTTPRPCClient, 'Should create HTTPRPCClient for https url');
        client = index_1.createJSONRPCClient({ protocols: [{ url: 'ws://localhost' }], autoConnect: autoConnect });
        t.ok(client instanceof ws_rpc_client_1.WSRPCClient, 'Should create WSRPCClient for ws url');
        client = index_1.createJSONRPCClient({ protocols: [{ url: 'wss://localhost' }], autoConnect: autoConnect });
        t.ok(client instanceof ws_rpc_client_1.WSRPCClient, 'Should create WSRPCClient for wss url');
        client = index_1.createJSONRPCClient({
            protocols: [{ url: 'http://localhost' }, { url: 'ws://localhost' }],
            autoConnect: autoConnect
        });
        t.ok(client instanceof dual_rpc_client_1.DualRPCClient, 'Should create DualRPCClient for http + ws urls');
        client = index_1.createJSONRPCClient({
            protocols: [{ url: 'https://localhost' }, { url: 'wss://localhost' }],
            autoConnect: autoConnect
        });
        t.ok(client instanceof dual_rpc_client_1.DualRPCClient, 'Should create DualRPCClient for https + wss urls');
        client = index_1.createJSONRPCClient({
            protocols: [{ url: 'http://localhost' }, { url: 'wss://localhost' }],
            autoConnect: autoConnect
        });
        t.ok(client instanceof dual_rpc_client_1.DualRPCClient, 'Should create DualRPCClient for http + wss urls');
        client = index_1.createJSONRPCClient({
            protocols: [{ url: 'https://localhost' }, { url: 'ws://localhost' }],
            autoConnect: autoConnect
        });
        t.ok(client instanceof dual_rpc_client_1.DualRPCClient, 'Should create DualRPCClient for https + ws urls');
    }
    catch (err) {
        t.fail(err);
    }
    t.end();
});
//# sourceMappingURL=rpc-client-factory-tests.js.map