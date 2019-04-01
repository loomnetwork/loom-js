"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var index_1 = require("../../index");
var loom_provider_1 = require("../../loom-provider");
var evm_helpers_1 = require("../evm-helpers");
var address_1 = require("../../address");
var helpers_1 = require("../../helpers");
var solidity_helpers_1 = require("../../solidity-helpers");
var helpers_2 = require("../helpers");
var contracts_1 = require("../../contracts");
// import Web3 from 'web3'
var Web3 = require('web3');
/**
 * Requires the SimpleStore solidity contract deployed on a loomchain.
 * go-loom/examples/plugins/evmexample/contract/SimpleStore.sol
 *
 * pragma solidity ^0.4.24;
 *
 * contract SimpleStore {
 *   uint256 value;
 *
 *   constructor() public {
 *       value = 10;
 *   }
 *
 *   event NewValueSet(uint indexed _value, address sender);
 *
 *   function set(uint _value) public {
 *     value = _value;
 *     emit NewValueSet(value, msg.sender);
 *   }
 *
 *   function get() public view returns (uint) {
 *     return value;
 *   }
 * }
 *
 */
var toCoinE18 = function (amount) {
    return new bn_js_1.default(10).pow(new bn_js_1.default(18)).mul(new bn_js_1.default(amount));
};
function bootstrapTest(createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var privKey, pubKey, client, loomProvider, contractData, ABI, result, web3, contract, signer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    privKey = index_1.CryptoUtils.B64ToUint8Array('D6XCGyCcDZ5TE22h66AlU+Bn6JqL4RnSl4a09RGU9LfM53JFG/T5GAnC0uiuIIiw9Dl0TwEAmdGb+WE0Bochkg==');
                    pubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privKey);
                    client = createClient();
                    client.on('error', function (err) { return console.error(err); });
                    client.txMiddleware = helpers_1.createDefaultTxMiddleware(client, privKey);
                    loomProvider = new loom_provider_1.LoomProvider(client, privKey);
                    contractData = '608060405234801561001057600080fd5b50600a60008190555061014e806100286000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b1146100515780636d4ce63c1461007e575b600080fd5b34801561005d57600080fd5b5061007c600480360381019080803590602001909291905050506100a9565b005b34801561008a57600080fd5b50610093610119565b6040518082815260200191505060405180910390f35b806000819055506000547f7e0b7a35f017ec94e71d7012fe8fa8011f1dab6090674f92de08f8092ab30dda33604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a250565b600080549050905600a165627a7a7230582041f33d6a8b78928e192affcb980ca6bef9b6f5b7da5aa4b2d75b1208720caeeb0029';
                    ABI = [
                        {
                            constant: false,
                            inputs: [
                                {
                                    name: '_value',
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
                            name: 'get',
                            outputs: [
                                {
                                    name: '',
                                    type: 'uint256'
                                }
                            ],
                            payable: false,
                            stateMutability: 'view',
                            type: 'function'
                        },
                        {
                            inputs: [],
                            payable: false,
                            stateMutability: 'nonpayable',
                            type: 'constructor'
                        },
                        {
                            anonymous: false,
                            inputs: [
                                {
                                    indexed: true,
                                    name: '_value',
                                    type: 'uint256'
                                },
                                {
                                    indexed: false,
                                    name: 'sender',
                                    type: 'address'
                                }
                            ],
                            name: 'NewValueSet',
                            type: 'event'
                        }
                    ];
                    return [4 /*yield*/, evm_helpers_1.deployContract(loomProvider, contractData)
                        // Instantiate Contract using web3
                    ];
                case 1:
                    result = _a.sent();
                    web3 = new Web3(loomProvider);
                    contract = new web3.eth.Contract(ABI, result.contractAddress, {
                        from: address_1.LocalAddress.fromPublicKey(pubKey).toString()
                    });
                    return [4 /*yield*/, solidity_helpers_1.getJsonRPCSignerAsync('http://localhost:8545')];
                case 2:
                    signer = _a.sent();
                    return [2 /*return*/, { client: client, pubKey: pubKey, privKey: privKey, signer: signer, loomProvider: loomProvider, contract: contract, ABI: ABI }];
            }
        });
    });
}
tape_1.default('Test Signed Eth Tx Middleware Type 1', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, client, signer, loomProvider, contract, ethAddress, callerChainId, middlewaresUsed, tx, err_1;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, bootstrapTest(helpers_2.createTestHttpClient)
                    // Get address of the account 0 = 0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1
                ];
            case 1:
                _a = _b.sent(), client = _a.client, signer = _a.signer, loomProvider = _a.loomProvider, contract = _a.contract;
                return [4 /*yield*/, signer.getAddress()];
            case 2:
                ethAddress = _b.sent();
                callerChainId = 'eth1';
                // Override the default caller chain ID
                loomProvider.callerChainId = callerChainId;
                // Ethereum account needs its own middleware
                loomProvider.setMiddlewaresForAddress(ethAddress, [
                    new index_1.NonceTxMiddleware(new address_1.Address(callerChainId, address_1.LocalAddress.fromHexString(ethAddress)), client),
                    new index_1.SignedEthTxMiddleware(signer)
                ]);
                middlewaresUsed = loomProvider.accountMiddlewares.get(ethAddress.toLowerCase());
                t.assert(middlewaresUsed[0] instanceof index_1.NonceTxMiddleware, 'Nonce2TxMiddleware used');
                t.assert(middlewaresUsed[1] instanceof index_1.SignedEthTxMiddleware, 'SignedEthTxMiddleware used');
                return [4 /*yield*/, contract.methods.set(1).send({ from: ethAddress })];
            case 3:
                tx = _b.sent();
                t.equal(tx.status, '0x1', "SimpleStore.set should return correct status for address (to) " + ethAddress);
                t.equal(tx.events.NewValueSet.returnValues.sender, ethAddress, "Sender should be same sender from eth " + ethAddress);
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                console.error(err_1);
                t.fail(err_1.message);
                return [3 /*break*/, 5];
            case 5:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('Test Signed Eth Tx Middleware Type 2', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, client, signer, pubKey, loomProvider, contract, addressMapper, ethAddress, from, to, ethersSigner, addressMapped, err_2, callerChainId, middlewaresUsed, tx, err_3;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                return [4 /*yield*/, bootstrapTest(helpers_2.createTestHttpClient)];
            case 1:
                _a = _b.sent(), client = _a.client, signer = _a.signer, pubKey = _a.pubKey, loomProvider = _a.loomProvider, contract = _a.contract;
                return [4 /*yield*/, contracts_1.AddressMapper.createAsync(client, new address_1.Address(client.chainId, address_1.LocalAddress.fromPublicKey(pubKey)))
                    // Set the mapping
                ];
            case 2:
                addressMapper = _b.sent();
                return [4 /*yield*/, signer.getAddress()];
            case 3:
                ethAddress = _b.sent();
                from = new address_1.Address(client.chainId, address_1.LocalAddress.fromPublicKey(pubKey));
                to = new address_1.Address('eth', address_1.LocalAddress.fromHexString(ethAddress));
                return [4 /*yield*/, addressMapper.hasMappingAsync(from)];
            case 4:
                if (!!(_b.sent())) return [3 /*break*/, 6];
                ethersSigner = new solidity_helpers_1.EthersSigner(signer);
                return [4 /*yield*/, addressMapper.addIdentityMappingAsync(from, to, ethersSigner)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                _b.trys.push([6, 8, , 9]);
                return [4 /*yield*/, addressMapper.getMappingAsync(from)];
            case 7:
                addressMapped = _b.sent();
                t.assert(addressMapped.from.equals(from), 'Should be mapped the from address');
                t.assert(addressMapped.to.equals(to), 'Should be mapped the to address');
                return [3 /*break*/, 9];
            case 8:
                err_2 = _b.sent();
                t.error(err_2);
                return [3 /*break*/, 9];
            case 9:
                callerChainId = 'eth';
                // Override the default caller chain ID
                loomProvider.callerChainId = callerChainId;
                // Ethereum account needs its own middleware
                loomProvider.setMiddlewaresForAddress(to.local.toString(), [
                    new index_1.CachedNonceTxMiddleware(pubKey, client),
                    new index_1.SignedEthTxMiddleware(signer)
                ]);
                middlewaresUsed = loomProvider.accountMiddlewares.get(ethAddress.toLowerCase());
                t.assert(middlewaresUsed[0] instanceof index_1.CachedNonceTxMiddleware, 'CachedNonceTxMiddleware used');
                t.assert(middlewaresUsed[1] instanceof index_1.SignedEthTxMiddleware, 'SignedEthTxMiddleware used');
                return [4 /*yield*/, contract.methods.set(1).send({ from: to.local.toString() })];
            case 10:
                tx = _b.sent();
                t.equal(tx.status, '0x1', "SimpleStore.set should return correct status for address (to) " + to.local.toString());
                t.equal(tx.events.NewValueSet.returnValues.sender.toLowerCase(), from.local.toString(), "Should be the same sender from loomchain " + from.local.toString());
                return [3 /*break*/, 12];
            case 11:
                err_3 = _b.sent();
                console.error(err_3);
                t.fail(err_3.message);
                return [3 /*break*/, 12];
            case 12:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
tape_1.default('Test Signed Eth Tx Middleware Type 2 with Coin Contract', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var privKey, pubKey, client, addressMapper, signer, ethAddress, from, to, ethersSigner, addressMapped, err_4, coin, spender, allowance, err_5;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 13, , 14]);
                privKey = index_1.CryptoUtils.B64ToUint8Array('D6XCGyCcDZ5TE22h66AlU+Bn6JqL4RnSl4a09RGU9LfM53JFG/T5GAnC0uiuIIiw9Dl0TwEAmdGb+WE0Bochkg==');
                pubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privKey);
                client = helpers_2.createTestHttpClient();
                client.on('error', function (err) { return console.error(err); });
                // <---- From this point using loom common middleware until change
                client.txMiddleware = helpers_1.createDefaultTxMiddleware(client, privKey);
                return [4 /*yield*/, contracts_1.AddressMapper.createAsync(client, new address_1.Address(client.chainId, address_1.LocalAddress.fromPublicKey(pubKey)))
                    // And get the signer
                ];
            case 1:
                addressMapper = _a.sent();
                return [4 /*yield*/, solidity_helpers_1.getJsonRPCSignerAsync('http://localhost:8545')
                    // Set the mapping
                ];
            case 2:
                signer = _a.sent();
                return [4 /*yield*/, signer.getAddress()];
            case 3:
                ethAddress = _a.sent();
                from = new address_1.Address(client.chainId, address_1.LocalAddress.fromPublicKey(pubKey));
                to = new address_1.Address('eth', address_1.LocalAddress.fromHexString(ethAddress));
                return [4 /*yield*/, addressMapper.hasMappingAsync(from)];
            case 4:
                if (!!(_a.sent())) return [3 /*break*/, 6];
                ethersSigner = new solidity_helpers_1.EthersSigner(signer);
                return [4 /*yield*/, addressMapper.addIdentityMappingAsync(from, to, ethersSigner)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, addressMapper.getMappingAsync(from)];
            case 7:
                addressMapped = _a.sent();
                t.assert(addressMapped.from.equals(from), 'Should be mapped the from address');
                t.assert(addressMapped.to.equals(to), 'Should be mapped the to address');
                return [3 /*break*/, 9];
            case 8:
                err_4 = _a.sent();
                t.error(err_4);
                return [3 /*break*/, 9];
            case 9: return [4 /*yield*/, contracts_1.Coin.createAsync(client, new address_1.Address('eth', address_1.LocalAddress.fromHexString(ethAddress)))];
            case 10:
                coin = _a.sent();
                spender = new address_1.Address(client.chainId, address_1.LocalAddress.fromPublicKey(pubKey));
                client.txMiddleware = [
                    new index_1.CachedNonceTxMiddleware(pubKey, client),
                    new index_1.SignedEthTxMiddleware(signer)
                ];
                // Check approval on coin native contract
                return [4 /*yield*/, coin.approveAsync(spender, toCoinE18(1))
                    // Using owner and spender as the same just for test
                ];
            case 11:
                // Check approval on coin native contract
                _a.sent();
                return [4 /*yield*/, coin.getAllowanceAsync(spender, spender)];
            case 12:
                allowance = _a.sent();
                t.equal(allowance.toString(), '1000000000000000000', 'Allowance should ok');
                return [3 /*break*/, 14];
            case 13:
                err_5 = _a.sent();
                console.error(err_5);
                t.fail(err_5.message);
                return [3 /*break*/, 14];
            case 14:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=client-test-tx-middleware.js.map