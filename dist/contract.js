"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var google_protobuf_1 = require("google-protobuf");
var events_1 = tslib_1.__importDefault(require("events"));
var debug_1 = tslib_1.__importDefault(require("debug"));
var client_1 = require("./client");
var loom_pb_1 = require("./proto/loom_pb");
var crypto_utils_1 = require("./crypto-utils");
var debugLog = debug_1.default('contract');
/**
 * The Contract class streamlines interaction with a contract that was deployed on a Loom DAppChain.
 * Each instance of this class is bound to a specific contract, and provides a simple way of calling
 * into and querying that contract.
 *
 * A contract instance can be used to listen to events emitted by the corresponding smart contract,
 * there is currently only one type of event. The event subscription API matches the NodeJS
 * EventEmitter API. For example...
 *
 * function subscribeToEvents(contract: Contract) {
 *   contract.on(Contract.EVENT, (event: IChainEventArgs) => {
 *     const dataStr = Buffer.from(event.data as Buffer).toString('utf8')
 *     const dataObj = JSON.parse(dataStr)
 *     console.log('Contract Event: ' + dataStr)
 *   })
 * }
 */
var Contract = /** @class */ (function (_super) {
    tslib_1.__extends(Contract, _super);
    /**
     * @param params Parameters.
     * @param params.contractAddr Address of a contract on the Loom DAppChain.
     * @param params.contractName Name of the contract.
     * @param params.callerAddr: Address of the caller, generated from the public key of the tx signer,
     *                           e.g. `new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))`
     * @param params.client: Client to use to communicate with the contract.
     */
    function Contract(params) {
        var _this = _super.call(this) || this;
        _this._client = params.client;
        _this.name = params.contractName;
        _this.address = params.contractAddr;
        _this.caller = params.callerAddr;
        var emitContractEvent = _this._emitContractEvent.bind(_this);
        _this.on('newListener', function (event) {
            if (event === Contract.EVENT && _this.listenerCount(event) === 0) {
                _this._client.on(client_1.ClientEvent.Contract, emitContractEvent);
            }
        });
        _this.on('removeListener', function (event) {
            if (event === Contract.EVENT && _this.listenerCount(event) === 0) {
                _this._client.removeListener(client_1.ClientEvent.Contract, emitContractEvent);
            }
        });
        return _this;
    }
    /**
     * Calls a contract method that mutates state.
     * The call into the contract is accomplished by committing a tx to the DAppChain.
     * @param method Contract method to call.
     * @param args Arguments to pass to the contract method.
     * @returns A promise that will be resolved with return value (if any) of the contract method.
     */
    Contract.prototype.callAsync = function (method, args, output) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var methodTx, request, callTx, msgTx, tx, result, resp, msgClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        methodTx = new loom_pb_1.ContractMethodCall();
                        methodTx.setMethod(method);
                        methodTx.setArgs(args.serializeBinary());
                        request = new loom_pb_1.Request();
                        request.setContentType(loom_pb_1.EncodingType.PROTOBUF3);
                        request.setAccept(loom_pb_1.EncodingType.PROTOBUF3);
                        request.setBody(methodTx.serializeBinary());
                        callTx = new loom_pb_1.CallTx();
                        callTx.setVmType(loom_pb_1.VMType.PLUGIN);
                        callTx.setInput(request.serializeBinary());
                        msgTx = new loom_pb_1.MessageTx();
                        msgTx.setFrom(this.caller.MarshalPB());
                        msgTx.setTo(this.address.MarshalPB());
                        msgTx.setData(callTx.serializeBinary());
                        tx = new loom_pb_1.Transaction();
                        tx.setId(2);
                        tx.setData(msgTx.serializeBinary());
                        debugLog("call '" + method + " on " + this.address.toString() + " from " + this.caller.toString());
                        return [4 /*yield*/, this._client.commitTxAsync(tx)];
                    case 1:
                        result = _a.sent();
                        if (result && output) {
                            resp = loom_pb_1.Response.deserializeBinary(crypto_utils_1.bufferToProtobufBytes(result));
                            msgClass = output.constructor;
                            google_protobuf_1.Message.copyInto(msgClass.deserializeBinary(resp.getBody_asU8()), output);
                        }
                        return [2 /*return*/, output];
                }
            });
        });
    };
    /**
     * Calls a contract method that doesn't mutate state.
     * This method is usually used to query the current contract state, it doesn't commit any txs.
     * @param method Contract method to call.
     * @param args Arguments to pass to the contract method.
     * @returns A promise that will be resolved with the return value of the contract method.
     */
    Contract.prototype.staticCallAsync = function (method, args, output) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var query, result, msgClass;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = new loom_pb_1.ContractMethodCall();
                        query.setMethod(method);
                        query.setArgs(args.serializeBinary());
                        debugLog("static call '" + method + " on " + this.address.toString() + " from " + this.caller.toString());
                        return [4 /*yield*/, this._client.queryAsync(this.address, query.serializeBinary(), loom_pb_1.VMType.PLUGIN, this.caller)];
                    case 1:
                        result = _a.sent();
                        if (result && output) {
                            msgClass = output.constructor;
                            google_protobuf_1.Message.copyInto(msgClass.deserializeBinary(crypto_utils_1.bufferToProtobufBytes(result)), output);
                        }
                        return [2 /*return*/, output];
                }
            });
        });
    };
    Contract.prototype._emitContractEvent = function (event) {
        if (event.contractAddress.equals(this.address)) {
            this.emit(Contract.EVENT, event);
        }
    };
    Contract.EVENT = 'event';
    return Contract;
}(events_1.default));
exports.Contract = Contract;
//# sourceMappingURL=contract.js.map