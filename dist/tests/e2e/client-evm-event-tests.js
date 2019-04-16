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
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.22;
 *
 * contract SimpleStore {
 *   uint value;
 *   constructor() public {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint indexed _value);
 *
 *   function set(uint _value) public {
 *     value = _value;
 *     emit NewValueSet(value);
 *   }
 *
 *   function get() public view returns (uint) {
 *     return value;
 *   }
 * }
 *
 *
 */
tape_1.default('Client EVM Event test', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var client, privateKey, publicKey, loomProvider, contractData, result, filter, filterCreated, caller, address, data, callTx, msgTx, tx, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                privateKey = index_1.CryptoUtils.generatePrivateKey();
                publicKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                client = helpers_1.createTestClient();
                client.on('error', function (err) { return t.error(err); });
                loomProvider = new loom_provider_1.LoomProvider(client, privateKey);
                contractData = '0x608060405234801561001057600080fd5b50600a60008190555061010e806100286000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60d9565b6040518082815260200191505060405180910390f35b806000819055506000547fb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b60405160405180910390a250565b600080549050905600a165627a7a72305820b76f6c855a1f95260fc70490b16774074225da52ea165a58e95eb7a72a59d1700029';
                return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)
                    // Middleware used for client
                ];
            case 1:
                result = _a.sent();
                // Middleware used for client
                client.txMiddleware = [
                    new index_1.NonceTxMiddleware(publicKey, client),
                    new index_1.SignedTxMiddleware(privateKey)
                ];
                filter = {
                    topics: [
                        '0xb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b',
                        [
                            '0x0000000000000000000000000000000000000000000000000000000000000001',
                            '0x0000000000000000000000000000000000000000000000000000000000000002',
                            '0x0000000000000000000000000000000000000000000000000000000000000003',
                            '0x0000000000000000000000000000000000000000000000000000000000000004',
                            '0x0000000000000000000000000000000000000000000000000000000000000005'
                        ]
                    ],
                    address: result.contractAddress
                };
                return [4 /*yield*/, client.evmSubscribeAsync('logs', filter)];
            case 2:
                filterCreated = _a.sent();
                console.log('Filter created', filterCreated);
                caller = new address_1.Address('default', address_1.LocalAddress.fromPublicKey(publicKey));
                address = new address_1.Address('default', address_1.LocalAddress.fromHexString(result.contractAddress));
                data = Buffer.from('60fe47b10000000000000000000000000000000000000000000000000000000000000005', 'hex');
                callTx = new loom_pb_1.CallTx();
                callTx.setVmType(loom_pb_1.VMType.EVM);
                callTx.setInput(crypto_utils_1.bufferToProtobufBytes(data));
                msgTx = new loom_pb_1.MessageTx();
                msgTx.setFrom(caller.MarshalPB());
                msgTx.setTo(address.MarshalPB());
                msgTx.setData(callTx.serializeBinary());
                tx = new loom_pb_1.Transaction();
                tx.setId(2);
                tx.setData(msgTx.serializeBinary());
                return [4 /*yield*/, client.commitTxAsync(tx)];
            case 3:
                _a.sent();
                console.log('Disconnected');
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                t.fail(err_1.message);
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
//# sourceMappingURL=client-evm-event-tests.js.map