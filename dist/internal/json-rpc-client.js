"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSONRPCProtocol;
(function (JSONRPCProtocol) {
    JSONRPCProtocol[JSONRPCProtocol["HTTP"] = 0] = "HTTP";
    JSONRPCProtocol[JSONRPCProtocol["WS"] = 1] = "WS";
})(JSONRPCProtocol = exports.JSONRPCProtocol || (exports.JSONRPCProtocol = {}));
var RPCClientEvent;
(function (RPCClientEvent) {
    /** Emitted when a connection is established with the server. */
    RPCClientEvent["Connected"] = "connected";
    /** Emitted when the connection to the server is closed down. */
    RPCClientEvent["Disconnected"] = "disconnected";
    /** Emitted when an error is encountered that can't be propagated in a more sensible fashion. */
    RPCClientEvent["Error"] = "error";
    /** Emitted when an event message (not a response message) is received from the server. */
    RPCClientEvent["Message"] = "message";
    /**
     * Emitted when an EVM event message (not a response message) is received from the server
     * EVM do not subscribe to subevents as normal Loom events, it only focus listen the emitter
     */
    RPCClientEvent["EVMMessage"] = "EVMMessage";
    /**
     * Emitted when chain events subscription status changes.
     * Listener will receive a single boolean value, `true` indicates that the event subscription is
     * active, `false` indicates that it's inactive.
     */
    RPCClientEvent["Subscribed"] = "subscribed";
    RPCClientEvent["Unsubscribed"] = "unsubscribed";
})(RPCClientEvent = exports.RPCClientEvent || (exports.RPCClientEvent = {}));
//# sourceMappingURL=json-rpc-client.js.map