"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.18;
 * contract SimpleStore {
 *  function set(uint _value) public {
 *   value = _value;
 *  }
 * function get() public constant returns (uint) {
 *   return value;
 * }
 *  uint value;
 * }
 *
 */
tape_1.default('EVM Contract Calls', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var privKey, pubKey, client, contractAddr, callerAddr, evmContract, inputSet987Array, inputGetArray, numRepeats, results, rtv, i, sameHash, _i, results_1, result, receipt, staticCallRtv, err_1;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                privKey = index_1.CryptoUtils.generatePrivateKey();
                pubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privKey);
                client = helpers_1.createTestWSClient();
                client.on('error', function (err) { return t.error(err); });
                client.txMiddleware = index_1.createDefaultTxMiddleware(client, privKey);
                return [4 /*yield*/, client.getContractAddressAsync('SimpleStore')];
            case 1:
                contractAddr = _a.sent();
                if (!contractAddr) {
                    t.fail('Failed to resolve contract address');
                    return [2 /*return*/];
                }
                callerAddr = new index_1.Address(client.chainId, index_1.LocalAddress.fromPublicKey(pubKey));
                evmContract = new index_1.EvmContract({
                    contractAddr: contractAddr,
                    callerAddr: callerAddr,
                    client: client
                });
                inputSet987Array = [
                    96,
                    254,
                    71,
                    177,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    3,
                    219
                ];
                inputGetArray = [109, 76, 230, 60];
                numRepeats = 10;
                results = [];
                rtv = void 0;
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < numRepeats)) return [3 /*break*/, 5];
                return [4 /*yield*/, evmContract.callAsync(inputSet987Array)];
            case 3:
                rtv = _a.sent();
                if (rtv) {
                    sameHash = false;
                    for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                        result = results_1[_i];
                        if (Buffer.compare(result, rtv) === 0) {
                            sameHash = true;
                        }
                    }
                    t.false(sameHash, 'A different tx hash sould be returned each time');
                    results.push(rtv);
                }
                else {
                    t.fail('Should return a tx hash, check loomchain is running');
                }
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                if (!rtv) return [3 /*break*/, 7];
                return [4 /*yield*/, client.getEvmTxReceiptAsync(rtv)];
            case 6:
                receipt = _a.sent();
                if (receipt) {
                    t.deepEqual(receipt.getContractAddress_asU8().slice(), contractAddr.local.bytes, 'Contract address should match');
                    t.equal(receipt.getStatus(), 1, 'Should return status 1 success');
                }
                else {
                    t.fail('getTxReceiptAsync should return a result');
                }
                _a.label = 7;
            case 7: return [4 /*yield*/, evmContract.staticCallAsync(inputGetArray)];
            case 8:
                staticCallRtv = _a.sent();
                if (staticCallRtv) {
                    t.deepEqual(staticCallRtv, Buffer.from(inputSet987Array.slice(-32)), 'Query result must match the value previously set');
                }
                else {
                    t.fail('staticCallAsync should return a result');
                }
                client.disconnect();
                return [3 /*break*/, 10];
            case 9:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 10];
            case 10:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=evm-contract-tests.js.map