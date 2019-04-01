"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../../helpers");
tape_1.default('Client URL Override', function (t) {
    try {
        var hostname = 'plasma.dappchains.com';
        var readOnlyHostname = 'plasma-readonly.dappchains.com';
        // Client assumes that if the reader/writer are strings they must be websocket URIs, so only
        // test those.
        var clients = [
            new index_1.Client('default', "ws://" + hostname + "/websocket", "ws://" + hostname + "/queryws"),
            new index_1.Client('default', "wss://" + hostname + "/websocket", "wss://" + hostname + "/queryws")
        ];
        for (var _i = 0, clients_1 = clients; _i < clients_1.length; _i++) {
            var client = clients_1[_i];
            client.on('error', function (msg) {
                // don't care about connection errors, just want to validate URL override
            });
            var readUrl = helpers_1.parseUrl(client.readUrl);
            var writeUrl = helpers_1.parseUrl(client.writeUrl);
            t.equal(readUrl.hostname, readOnlyHostname, 'Read URL override was applied');
            t.equal(writeUrl.hostname, hostname, 'Write URL was unchanged');
            client.disconnect();
        }
    }
    catch (err) {
        t.fail(err);
    }
    t.end();
});
//# sourceMappingURL=client-url-override-tests.js.map