"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var loom_pb_1 = require("../../proto/loom_pb");
var loom_provider_1 = require("../../loom-provider");
var evm_helpers_1 = require("../evm-helpers");
var crypto_utils_1 = require("../../crypto-utils");
var address_1 = require("../../address");
var helpers_2 = require("../../helpers");
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.22;
 *
 * contract SimpleStore {
 *   uint value;
 *
 *   constructor() public {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint indexed _value);
 *   event NewValueSetAgain(uint indexed _value);
 *
 *   function set(uint _value) public {
 *     value = _value;
 *
 *     require(_value != 100, "Magic value");
 *
 *     emit NewValueSet(value);
 *   }
 *
 *   function setAgain(uint _value) public {
 *     value = _value;
 *     emit NewValueSetAgain(value);
 *   }
 *
 *   function get() public view returns (uint) {
 *     return value;
 *   }
 * }
 *
 */
function deploySimpleStoreContract() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var privateKey, client, contractAddress, loomProvider, contractData, result, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    privateKey = index_1.CryptoUtils.generatePrivateKey();
                    client = helpers_1.createTestWSClient();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    client.on('error', function (err) { return console.error(err); });
                    loomProvider = new loom_provider_1.LoomProvider(client, privateKey);
                    contractData = '608060405234801561001057600080fd5b50600a600081905550610201806100286000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b11461005c5780636d4ce63c14610089578063cf718921146100b4575b600080fd5b34801561006857600080fd5b50610087600480360381019080803590602001909291905050506100e1565b005b34801561009557600080fd5b5061009e610193565b6040518082815260200191505060405180910390f35b3480156100c057600080fd5b506100df6004803603810190808035906020019092919050505061019c565b005b8060008190555060648114151515610161576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600b8152602001807f4d616769632076616c756500000000000000000000000000000000000000000081525060200191505060405180910390fd5b6000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b60008054905090565b806000819055506000547fc151b22f26f815d64ae384647d49bc5655149c4b273318d8c3846086dae3835e60405160405180910390a2505600a165627a7a723058204c7af9b8100ac44b72d5498cd5d9034844c7b2249060740bafbe2876fbbcb6d40029';
                    return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)];
                case 2:
                    result = _a.sent();
                    contractAddress = new address_1.Address('default', address_1.LocalAddress.fromHexString(result.contractAddress));
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    throw err_1;
                case 4:
                    client.disconnect();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, contractAddress];
            }
        });
    });
}
function callTransactionAsync(client, from, to, data) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var callTx, msgTx, tx;
        return tslib_1.__generator(this, function (_a) {
            callTx = new loom_pb_1.CallTx();
            callTx.setVmType(loom_pb_1.VMType.EVM);
            callTx.setInput(crypto_utils_1.bufferToProtobufBytes(data));
            msgTx = new loom_pb_1.MessageTx();
            msgTx.setFrom(from.MarshalPB());
            msgTx.setTo(to.MarshalPB());
            msgTx.setData(callTx.serializeBinary());
            tx = new loom_pb_1.Transaction();
            tx.setId(2);
            tx.setData(msgTx.serializeBinary());
            return [2 /*return*/, client.commitTxAsync(tx)];
        });
    });
}
// Middleware that creates a NonceTx with the same nonce every time.
var DuplicateNonceTxMiddleware = /** @class */ (function () {
    function DuplicateNonceTxMiddleware(publicKey, client) {
        this.nextNonce = 0;
        this._mw = new index_1.NonceTxMiddleware(publicKey, client);
    }
    DuplicateNonceTxMiddleware.prototype.Handle = function (txData) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tx;
            return tslib_1.__generator(this, function (_a) {
                if (this.nextNonce > 0) {
                    console.log('Sending tx with nonce ' + this.nextNonce);
                    tx = new loom_pb_1.NonceTx();
                    tx.setInner(txData);
                    tx.setSequence(this.nextNonce);
                    return [2 /*return*/, tx.serializeBinary()];
                }
                else {
                    console.log('Sending tx with nonce 1');
                    this.nextNonce = 1;
                    return [2 /*return*/, this._mw.Handle(txData)];
                }
                return [2 /*return*/];
            });
        });
    };
    return DuplicateNonceTxMiddleware;
}());
// TODO: This test should be fixed to use Web3 to call the EVM contract
// This test relies on a broken node that allows txs to be resent with the same nonce, it'll have
// to be disabled for newer loom builds.
tape_1.default('Client tx already in cache error (Websocket)', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var address, client, privateKey, publicKey, caller, functionSet, cacheErrCount, err_2, err_3;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, deploySimpleStoreContract()];
            case 1:
                address = _a.sent();
                client = helpers_1.createTestWSClient();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 7, , 8]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                publicKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                // Middleware used for client
                client.txMiddleware = client.txMiddleware = [
                    new DuplicateNonceTxMiddleware(publicKey, client),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                caller = new address_1.Address('default', address_1.LocalAddress.fromPublicKey(publicKey));
                functionSet = Buffer.from('60fe47b1000000000000000000000000000000000000000000000000000000000000000f', 'hex');
                cacheErrCount = 0;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, Promise.all([
                        callTransactionAsync(client, caller, address, functionSet),
                        callTransactionAsync(client, caller, address, functionSet)
                    ])];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                cacheErrCount++;
                return [3 /*break*/, 6];
            case 6:
                t.equal(cacheErrCount, 1, 'expect to receive cache error');
                return [3 /*break*/, 8];
            case 7:
                err_3 = _a.sent();
                console.error(err_3);
                t.fail(err_3.message);
                return [3 /*break*/, 8];
            case 8:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('Client tx already in cache error (HTTP)', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var address, client, privateKey, publicKey, caller, functionSet, cacheErrCount, err_4, err_5;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, deploySimpleStoreContract()];
            case 1:
                address = _a.sent();
                client = helpers_1.createTestHttpClient();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 7, , 8]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                publicKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                // Middleware used for client
                client.txMiddleware = [
                    new DuplicateNonceTxMiddleware(publicKey, client),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                caller = new address_1.Address('default', address_1.LocalAddress.fromPublicKey(publicKey));
                functionSet = Buffer.from('60fe47b1000000000000000000000000000000000000000000000000000000000000000f', 'hex');
                cacheErrCount = 0;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, Promise.all([
                        callTransactionAsync(client, caller, address, functionSet),
                        callTransactionAsync(client, caller, address, functionSet)
                    ])];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_4 = _a.sent();
                cacheErrCount++;
                return [3 /*break*/, 6];
            case 6:
                t.equal(cacheErrCount, 1, 'expect to receive cache error');
                return [3 /*break*/, 8];
            case 7:
                err_5 = _a.sent();
                console.error(err_5);
                t.fail(err_5.message);
                return [3 /*break*/, 8];
            case 8:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('Test CachedNonceTxMiddleware - failed tx', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var address, client, privateKey, publicKey, caller, functionSetErr, functionSetOk, cacheErrCount, err_6, err_7, err_8;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, deploySimpleStoreContract()];
            case 1:
                address = _a.sent();
                client = helpers_1.createTestHttpClient();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 10, , 11]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                publicKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                // Middleware used for client
                client.txMiddleware = [
                    new index_1.CachedNonceTxMiddleware(publicKey, client),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                caller = new address_1.Address('default', address_1.LocalAddress.fromPublicKey(publicKey));
                functionSetErr = Buffer.from('60fe47b10000000000000000000000000000000000000000000000000000000000000064', 'hex');
                functionSetOk = Buffer.from('60fe47b1000000000000000000000000000000000000000000000000000000000000000f', 'hex');
                cacheErrCount = 0;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                // Should revert because the value is 100
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetErr)];
            case 4:
                // Should revert because the value is 100
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_6 = _a.sent();
                cacheErrCount++;
                return [3 /*break*/, 6];
            case 6:
                _a.trys.push([6, 8, , 9]);
                // Should not fail
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetOk)];
            case 7:
                // Should not fail
                _a.sent();
                return [3 /*break*/, 9];
            case 8:
                err_7 = _a.sent();
                console.error(err_7);
                cacheErrCount++;
                return [3 /*break*/, 9];
            case 9:
                t.equal(cacheErrCount, 1, 'expect to receive only one cache error');
                return [3 /*break*/, 11];
            case 10:
                err_8 = _a.sent();
                console.error(err_8);
                t.fail(err_8.message);
                return [3 /*break*/, 11];
            case 11:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('Test CachedNonceTxMiddleware - duplicate tx', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var address, client, client2, privateKey, publicKey, caller, functionSetOk, cacheErrCount, err_9, err_10, err_11, err_12, err_13, err_14;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, deploySimpleStoreContract()];
            case 1:
                address = _a.sent();
                client = helpers_1.createTestHttpClient();
                client2 = helpers_1.createTestHttpClient();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 19, , 20]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                publicKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                client.txMiddleware = [
                    new index_1.CachedNonceTxMiddleware(publicKey, client),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                client2.txMiddleware = [
                    new index_1.NonceTxMiddleware(publicKey, client2),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                caller = new address_1.Address('default', address_1.LocalAddress.fromPublicKey(publicKey));
                functionSetOk = Buffer.from('60fe47b1000000000000000000000000000000000000000000000000000000000000000f', 'hex');
                cacheErrCount = 0;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                // Should not fail
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetOk)];
            case 4:
                // Should not fail
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_9 = _a.sent();
                console.error(err_9);
                cacheErrCount++;
                return [3 /*break*/, 6];
            case 6:
                _a.trys.push([6, 8, , 9]);
                // Should not fail, and should force the nonce to be incremented on the node
                return [4 /*yield*/, callTransactionAsync(client2, caller, address, functionSetOk)];
            case 7:
                // Should not fail, and should force the nonce to be incremented on the node
                _a.sent();
                return [3 /*break*/, 9];
            case 8:
                err_10 = _a.sent();
                console.error(err_10);
                cacheErrCount++;
                return [3 /*break*/, 9];
            case 9:
                _a.trys.push([9, 11, , 12]);
                // Should fail because cached nonce doesn't match the one on the node anymore
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetOk)];
            case 10:
                // Should fail because cached nonce doesn't match the one on the node anymore
                _a.sent();
                return [3 /*break*/, 12];
            case 11:
                err_11 = _a.sent();
                console.error(err_11);
                cacheErrCount++;
                return [3 /*break*/, 12];
            case 12:
                _a.trys.push([12, 14, , 15]);
                // Should not fail because the cached nonce should've been reset, and a fresh nonce should
                // be used for this call
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetOk)];
            case 13:
                // Should not fail because the cached nonce should've been reset, and a fresh nonce should
                // be used for this call
                _a.sent();
                return [3 /*break*/, 15];
            case 14:
                err_12 = _a.sent();
                console.error(err_12);
                cacheErrCount++;
                return [3 /*break*/, 15];
            case 15:
                _a.trys.push([15, 17, , 18]);
                // Should not fail because the cached nonce should still be good
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetOk)];
            case 16:
                // Should not fail because the cached nonce should still be good
                _a.sent();
                return [3 /*break*/, 18];
            case 17:
                err_13 = _a.sent();
                console.error(err_13);
                cacheErrCount++;
                return [3 /*break*/, 18];
            case 18:
                t.equal(cacheErrCount, 1, 'expect to receive only one cache error');
                return [3 /*break*/, 20];
            case 19:
                err_14 = _a.sent();
                console.error(err_14);
                t.fail(err_14.message);
                return [3 /*break*/, 20];
            case 20:
                if (client) {
                    client.disconnect();
                }
                if (client2) {
                    client2.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
// Tests that SpeculativeNonceTxMiddleware can recover after a tx fails due to a contract error.
tape_1.default('Test SpeculativeNonceTxMiddleware - failed tx', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var address, client, privateKey, publicKey, caller, functionSetErr, functionSetOk, cacheErrCount, err_15, err_16, err_17, err_18;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, deploySimpleStoreContract()];
            case 1:
                address = _a.sent();
                client = helpers_1.createTestHttpClient();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 13, , 14]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                publicKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                // Middleware used for client
                client.txMiddleware = [
                    new index_1.SpeculativeNonceTxMiddleware(publicKey, client),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                caller = new address_1.Address('default', address_1.LocalAddress.fromPublicKey(publicKey));
                functionSetErr = Buffer.from('60fe47b10000000000000000000000000000000000000000000000000000000000000064', 'hex');
                functionSetOk = Buffer.from('60fe47b1000000000000000000000000000000000000000000000000000000000000000f', 'hex');
                cacheErrCount = 0;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                // Should not fail
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetOk)];
            case 4:
                // Should not fail
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_15 = _a.sent();
                console.error(err_15);
                cacheErrCount++;
                return [3 /*break*/, 6];
            case 6:
                _a.trys.push([6, 8, , 9]);
                // Should revert because the value is 100
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetErr)];
            case 7:
                // Should revert because the value is 100
                _a.sent();
                return [3 /*break*/, 9];
            case 8:
                err_16 = _a.sent();
                cacheErrCount++;
                return [3 /*break*/, 9];
            case 9:
                _a.trys.push([9, 11, , 12]);
                // Should not fail
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetOk)];
            case 10:
                // Should not fail
                _a.sent();
                return [3 /*break*/, 12];
            case 11:
                err_17 = _a.sent();
                console.error(err_17);
                cacheErrCount++;
                return [3 /*break*/, 12];
            case 12:
                t.equal(cacheErrCount, 1, 'expect to receive only one cache error');
                return [3 /*break*/, 14];
            case 13:
                err_18 = _a.sent();
                console.error(err_18);
                t.fail(err_18.message);
                return [3 /*break*/, 14];
            case 14:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
// Tests that SpeculativeNonceTxMiddleware can recover when txs are sent by the same caller using
// multiple clients.
tape_1.default('Test SpeculativeNonceTxMiddleware - duplicate tx', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var address, client, client2, privateKey, publicKey, caller, functionSetOk, cacheErrCount, err_19, err_20, err_21, err_22, err_23, err_24;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, deploySimpleStoreContract()];
            case 1:
                address = _a.sent();
                client = helpers_1.createTestHttpClient();
                client2 = helpers_1.createTestHttpClient();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 19, , 20]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                publicKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                client.txMiddleware = [
                    new index_1.SpeculativeNonceTxMiddleware(publicKey, client),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                client2.txMiddleware = [
                    new index_1.NonceTxMiddleware(publicKey, client2),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                caller = new address_1.Address('default', address_1.LocalAddress.fromPublicKey(publicKey));
                functionSetOk = Buffer.from('60fe47b1000000000000000000000000000000000000000000000000000000000000000f', 'hex');
                cacheErrCount = 0;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                // Should not fail
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetOk)];
            case 4:
                // Should not fail
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_19 = _a.sent();
                console.error(err_19);
                cacheErrCount++;
                return [3 /*break*/, 6];
            case 6:
                _a.trys.push([6, 8, , 9]);
                // Should not fail, and should force the nonce to be incremented on the node
                return [4 /*yield*/, callTransactionAsync(client2, caller, address, functionSetOk)];
            case 7:
                // Should not fail, and should force the nonce to be incremented on the node
                _a.sent();
                return [3 /*break*/, 9];
            case 8:
                err_20 = _a.sent();
                console.error(err_20);
                cacheErrCount++;
                return [3 /*break*/, 9];
            case 9:
                _a.trys.push([9, 11, , 12]);
                // Should fail because cached nonce doesn't match the one on the node anymore
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetOk)];
            case 10:
                // Should fail because cached nonce doesn't match the one on the node anymore
                _a.sent();
                return [3 /*break*/, 12];
            case 11:
                err_21 = _a.sent();
                console.error(err_21);
                cacheErrCount++;
                return [3 /*break*/, 12];
            case 12:
                _a.trys.push([12, 14, , 15]);
                // Should not fail because the cached nonce should've been reset, and a fresh nonce should
                // be used for this call
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetOk)];
            case 13:
                // Should not fail because the cached nonce should've been reset, and a fresh nonce should
                // be used for this call
                _a.sent();
                return [3 /*break*/, 15];
            case 14:
                err_22 = _a.sent();
                console.error(err_22);
                cacheErrCount++;
                return [3 /*break*/, 15];
            case 15:
                _a.trys.push([15, 17, , 18]);
                // Should not fail because the cached nonce should still be good
                return [4 /*yield*/, callTransactionAsync(client, caller, address, functionSetOk)];
            case 16:
                // Should not fail because the cached nonce should still be good
                _a.sent();
                return [3 /*break*/, 18];
            case 17:
                err_23 = _a.sent();
                console.error(err_23);
                cacheErrCount++;
                return [3 /*break*/, 18];
            case 18:
                t.equal(cacheErrCount, 1, 'expect to receive only one cache error');
                return [3 /*break*/, 20];
            case 19:
                err_24 = _a.sent();
                console.error(err_24);
                t.fail(err_24.message);
                return [3 /*break*/, 20];
            case 20:
                if (client) {
                    client.disconnect();
                }
                if (client2) {
                    client2.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
// Tests that SpeculativeNonceTxMiddleware correctly allocates sequential nonces to a batch of txs.
tape_1.default('Test SpeculativeNonceTxMiddleware - rapid txs', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var address, client, privateKey, publicKey, caller, functionSetOk, errCount_1, promises, _loop_1, i, err_25;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, deploySimpleStoreContract()];
            case 1:
                address = _a.sent();
                client = helpers_1.createTestHttpClient();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 8, , 9]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                publicKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                client.txMiddleware = [
                    new index_1.SpeculativeNonceTxMiddleware(publicKey, client),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                caller = new address_1.Address('default', address_1.LocalAddress.fromPublicKey(publicKey));
                functionSetOk = Buffer.from('60fe47b1000000000000000000000000000000000000000000000000000000000000000f', 'hex');
                errCount_1 = 0;
                promises = [];
                _loop_1 = function (i) {
                    var p;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                p = callTransactionAsync(client, caller, address, functionSetOk);
                                p.catch(function (err) {
                                    console.error("Error sending tx " + (i + 1) + ": " + err);
                                    errCount_1++;
                                });
                                promises.push(p);
                                // Even though we don't want to wait for tx result before sending the next one there still
                                // needs to be slight delay to force the txs to be sent in the right order.
                                return [4 /*yield*/, helpers_2.sleep(100)];
                            case 1:
                                // Even though we don't want to wait for tx result before sending the next one there still
                                // needs to be slight delay to force the txs to be sent in the right order.
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < 4)) return [3 /*break*/, 6];
                return [5 /*yield**/, _loop_1(i)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, Promise.all(promises)];
            case 7:
                _a.sent();
                t.equal(errCount_1, 0, 'expect to receive no errors');
                return [3 /*break*/, 9];
            case 8:
                err_25 = _a.sent();
                console.error(err_25);
                t.fail(err_25.message);
                return [3 /*break*/, 9];
            case 9:
                if (client) {
                    client.disconnect();
                }
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=client-test-tx-cache.js.map