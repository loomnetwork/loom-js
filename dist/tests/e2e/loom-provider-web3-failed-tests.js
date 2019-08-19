"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var helpers_1 = require("../helpers");
var loom_provider_1 = require("../../loom-provider");
var evm_helpers_1 = require("../evm-helpers");
// import Web3 from 'web3'
var Web3 = require('web3');
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * contract SimpleStore {
 *   uint256 public value;
 *
 *   function set(uint256 v) public {
 *     value = v;
 *   }
 *
 *   function err() public {
 *     revert("Revert");
 *   }
 * }
 *
 */
var newContractAndClient = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var privKey, client, from, loomProvider, web3, contractData, ABI, result, contract;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                privKey = index_1.CryptoUtils.generatePrivateKey();
                client = helpers_1.createTestClient();
                from = index_1.LocalAddress.fromPublicKey(index_1.CryptoUtils.publicKeyFromPrivateKey(privKey)).toString();
                loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                web3 = new Web3(loomProvider);
                client.on('error', console.log);
                contractData = '0x608060405234801561001057600080fd5b50610183806100206000396000f3fe608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806338df76771461005c5780633fa4f2451461007357806360fe47b11461009e575b600080fd5b34801561006857600080fd5b506100716100d9565b005b34801561007f57600080fd5b50610088610147565b6040518082815260200191505060405180910390f35b3480156100aa57600080fd5b506100d7600480360360208110156100c157600080fd5b810190808035906020019092919050505061014d565b005b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260068152602001807f526576657274000000000000000000000000000000000000000000000000000081525060200191505060405180910390fd5b60005481565b806000819055505056fea165627a7a7230582096044210a4428c0d0fbc0d047c02beceeb862f2017233c4f68ead346c47030de0029';
                ABI = [
                    {
                        constant: false,
                        inputs: [],
                        name: 'err',
                        outputs: [],
                        payable: false,
                        stateMutability: 'nonpayable',
                        type: 'function'
                    },
                    {
                        constant: false,
                        inputs: [
                            {
                                name: 'v',
                                type: 'uint256'
                            }
                        ],
                        name: 'set',
                        outputs: [],
                        payable: false,
                        stateMutability: 'nonpayable',
                        type: 'function'
                    },
                    {
                        constant: true,
                        inputs: [],
                        name: 'value',
                        outputs: [
                            {
                                name: '',
                                type: 'uint256'
                            }
                        ],
                        payable: false,
                        stateMutability: 'view',
                        type: 'function'
                    }
                ];
                return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)];
            case 1:
                result = _a.sent();
                contract = new web3.eth.Contract(ABI, result.contractAddress, { from: from });
                return [2 /*return*/, { contract: contract, client: client, web3: web3, from: from, privKey: privKey }];
        }
    });
}); };
tape_1.default.only('LoomProvider + Web3 + Tx Fail', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, contract, client, newValue, txSet, txErr, err_1;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, newContractAndClient()];
            case 1:
                _a = _b.sent(), contract = _a.contract, client = _a.client;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 6, , 7]);
                newValue = 10;
                return [4 /*yield*/, contract.methods.set(newValue).send()];
            case 3:
                txSet = _b.sent();
                t.equal(txSet.status, '0x1', 'SimpleStore.set should return correct status');
                return [4 /*yield*/, contract.methods.err().send()];
            case 4:
                txErr = _b.sent();
                t.equal(txErr.status, '0x0', 'SimpleStore.err should return corrent status');
                return [4 /*yield*/, helpers_1.waitForMillisecondsAsync(1000)];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                console.log(err_1);
                return [3 /*break*/, 7];
            case 7:
                if (client) {
                    client.disconnect();
                }
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=loom-provider-web3-failed-tests.js.map