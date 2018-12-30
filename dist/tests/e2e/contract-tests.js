"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var tests_pb_1 = require("../tests_pb");
var helpers_1 = require("../helpers");
function getClientAndContract(createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var privKey, pubKey, client, contractAddr, _a, callerAddr, contract;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    privKey = index_1.CryptoUtils.generatePrivateKey();
                    pubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privKey);
                    client = createClient();
                    client.txMiddleware = index_1.createDefaultTxMiddleware(client, privKey);
                    contractAddr = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.getContractAddressAsync('BluePrint')];
                case 2:
                    contractAddr = _b.sent();
                    if (!contractAddr) {
                        throw new Error();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    throw new Error('Failed to resolve contract address');
                case 4:
                    callerAddr = new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey));
                    contract = new index_1.Contract({ contractAddr: contractAddr, callerAddr: callerAddr, client: client });
                    return [2 /*return*/, { client: client, contract: contract }];
            }
        });
    });
}
function testContractCalls(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, client, contract, msgKey, msgValue, msg, retVal, result;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(createClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, contract = _a.contract;
                    msgKey = '123';
                    msgValue = '456';
                    msg = new tests_pb_1.MapEntry();
                    msg.setKey(msgKey);
                    msg.setValue(msgValue);
                    return [4 /*yield*/, contract.callAsync('SetMsg', msg)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, contract.callAsync('SetMsgEcho', msg, new tests_pb_1.MapEntry())];
                case 3:
                    retVal = _b.sent();
                    t.ok(retVal, "callAsync('SetMsgEcho', ...) must return a value");
                    if (retVal) {
                        t.equal(retVal.getKey(), msgKey, 'Key in return value must match the one that was sent');
                        t.equal(retVal.getValue(), msgValue, 'Value in return value must match the one that was sent');
                    }
                    msg.setValue('');
                    return [4 /*yield*/, contract.staticCallAsync('GetMsg', msg, new tests_pb_1.MapEntry())];
                case 4:
                    result = _b.sent();
                    t.ok(result, "staticCallAsync('GetMsg', ...) must return a value");
                    if (result) {
                        t.equal(result.getValue(), msgValue, 'Return value must match previously set value');
                    }
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
function testContractEvents(t, createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, client, contract, msgKey, msgValue, msg, listener1InvokeCount, listener2InvokeCount, listener1, listener2;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getClientAndContract(helpers_1.createTestClient)];
                case 1:
                    _a = _b.sent(), client = _a.client, contract = _a.contract;
                    msgKey = '123';
                    msgValue = '456';
                    msg = new tests_pb_1.MapEntry();
                    msg.setKey(msgKey);
                    msg.setValue(msgValue);
                    listener1InvokeCount = 0;
                    listener2InvokeCount = 0;
                    listener1 = function (event) {
                        t.deepEqual(event.contractAddress, contract.address, 'IChainEventArgs.contractAddress matches');
                        t.deepEqual(event.callerAddress, contract.caller, 'IChainEventArgs.callerAddress matches');
                        t.ok(event.blockHeight, 'IChainEventArgs.blockHeight is set');
                        t.ok(event.data.length > 0, 'IChainEventArgs.data is set');
                        var dataStr = Buffer.from(event.data).toString('utf8');
                        var dataObj = JSON.parse(dataStr);
                        t.deepEqual(dataObj, { Method: 'SetMsg', Key: msgKey, Value: msgValue }, 'IChainEventArgs.data is correct');
                        listener1InvokeCount++;
                    };
                    contract.once(index_1.Contract.EVENT, listener1);
                    return [4 /*yield*/, contract.callAsync('SetMsg', msg)];
                case 2:
                    _b.sent();
                    listener2 = function (event) {
                        listener2InvokeCount++;
                    };
                    contract.on(index_1.Contract.EVENT, listener2);
                    return [4 /*yield*/, contract.callAsync('SetMsg', msg)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, contract.callAsync('SetMsg', msg)];
                case 4:
                    _b.sent();
                    t.isEqual(listener1InvokeCount, 1, 'Contract.once listener invoked only once');
                    t.isEqual(listener2InvokeCount, 2, 'Contract.on listener invoked multiple times');
                    contract.removeListener(index_1.Contract.EVENT, listener2);
                    return [4 /*yield*/, contract.callAsync('SetMsg', msg)];
                case 5:
                    _b.sent();
                    t.isEqual(listener2InvokeCount, 2, 'Contract.on listener not invoked after removal');
                    client.disconnect();
                    return [2 /*return*/];
            }
        });
    });
}
tape_1.default('Contract', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                t.comment('Calls via HTTP');
                return [4 /*yield*/, testContractCalls(t, helpers_1.createTestHttpClient)];
            case 1:
                _a.sent();
                t.comment('Calls via WebSocket');
                return [4 /*yield*/, testContractCalls(t, helpers_1.createTestWSClient)];
            case 2:
                _a.sent();
                t.comment('Calls via HTTP/WebSocket');
                return [4 /*yield*/, testContractCalls(t, helpers_1.createTestHttpWSClient)];
            case 3:
                _a.sent();
                t.comment('Events via WebSocket');
                return [4 /*yield*/, testContractEvents(t, helpers_1.createTestHttpWSClient)];
            case 4:
                _a.sent();
                t.comment('Events via HTTP/WebSocket');
                return [4 /*yield*/, testContractEvents(t, helpers_1.createTestHttpWSClient)];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                t.fail(err_1);
                return [3 /*break*/, 7];
            case 7:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=contract-tests.js.map