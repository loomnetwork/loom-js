"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var index_1 = require("../index");
function getTestUrls() {
    return {
        wsWriteUrl: process.env.TEST_LOOM_DAPP_WS_WRITE_URL || 'ws://127.0.0.1:46657/websocket',
        wsReadUrl: process.env.TEST_LOOM_DAPP_WS_READ_URL || 'ws://127.0.0.1:9999/queryws',
        httpWriteUrl: process.env.TEST_LOOM_DAPP_HTTP_WRITE_URL || 'http://127.0.0.1:46658/rpc',
        httpReadUrl: process.env.TEST_LOOM_DAPP_HTTP_READ_URL || 'http://127.0.0.1:46658/query'
    };
}
exports.getTestUrls = getTestUrls;
/**
 * Creates a client for tests, the default read/write URLs can be overriden by setting the env vars
 * TEST_LOOM_DAPP_WRITE_URL and TEST_LOOM_DAPP_READ_URL. These env vars can be set by modifying
 * the .env.test (see .env.test.example for default values).
 */
function createTestClient() {
    return new index_1.Client('default', getTestUrls().wsWriteUrl, getTestUrls().wsReadUrl);
}
exports.createTestClient = createTestClient;
function createTestHttpClient() {
    var writer = index_1.createJSONRPCClient({ protocols: [{ url: getTestUrls().httpWriteUrl }] });
    var reader = index_1.createJSONRPCClient({ protocols: [{ url: getTestUrls().httpReadUrl }] });
    return new index_1.Client('default', writer, reader);
}
exports.createTestHttpClient = createTestHttpClient;
function createTestWSClient() {
    var writer = index_1.createJSONRPCClient({ protocols: [{ url: getTestUrls().wsWriteUrl }] });
    var reader = index_1.createJSONRPCClient({ protocols: [{ url: getTestUrls().wsReadUrl }] });
    return new index_1.Client('default', writer, reader);
}
exports.createTestWSClient = createTestWSClient;
function createTestHttpWSClient() {
    var writer = index_1.createJSONRPCClient({ protocols: [{ url: getTestUrls().httpWriteUrl }] });
    var reader = index_1.createJSONRPCClient({
        protocols: [{ url: getTestUrls().httpReadUrl }, { url: getTestUrls().wsReadUrl }]
    });
    return new index_1.Client('default', writer, reader);
}
exports.createTestHttpWSClient = createTestHttpWSClient;
function waitForMillisecondsAsync(ms) {
    return new Promise(function (res) { return setTimeout(res, ms); });
}
exports.waitForMillisecondsAsync = waitForMillisecondsAsync;
function execAndWaitForMillisecondsAsync(fn, ms) {
    if (ms === void 0) { ms = 2000; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var ret;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fn];
                case 1:
                    ret = _a.sent();
                    return [4 /*yield*/, waitForMillisecondsAsync(ms)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, ret];
            }
        });
    });
}
exports.execAndWaitForMillisecondsAsync = execAndWaitForMillisecondsAsync;
//# sourceMappingURL=helpers.js.map