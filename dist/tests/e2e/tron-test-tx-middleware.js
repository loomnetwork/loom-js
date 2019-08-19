"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var index_1 = require("../../index");
var loom_provider_1 = require("../../loom-provider");
var evm_helpers_1 = require("../evm-helpers");
var address_1 = require("../../address");
var helpers_1 = require("../../helpers");
var tron_web_signer_1 = require("../../tron-web-signer");
var helpers_2 = require("../helpers");
var contracts_1 = require("../../contracts");
var Web3 = require('web3');
var TronWeb = require('tronweb');
function bootstrapTest(createClient) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var privKey, pubKey, client, account, loomProvider, contractData, ABI, result, web3, contract, fullNode, solidityNode, eventServer, privateKey, tronWeb, tronDefaultAddr, trxAddress, trxAddressHex, signer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    privKey = index_1.CryptoUtils.B64ToUint8Array('5IKwJ+M1zSrqF/eJ99OeEWGRQH1ND0GURLu8ukm8yx0QmNQm5rOoPUpBLhiR327Ac3IpLts9+ZKAzdRykkMmwg==');
                    pubKey = index_1.CryptoUtils.publicKeyFromPrivateKey(privKey);
                    client = createClient();
                    client.on('error', function (err) { return console.error(err); });
                    client.txMiddleware = helpers_1.createDefaultTxMiddleware(client, privKey);
                    account = new address_1.Address(client.chainId, address_1.LocalAddress.fromPublicKey(pubKey));
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
                    fullNode = new TronWeb.providers.HttpProvider('http://127.0.0.1:9090');
                    solidityNode = new TronWeb.providers.HttpProvider('http://127.0.0.1:9090');
                    eventServer = 'http://127.0.0.1:9090';
                    privateKey = '11b5b4c7ff9e69e89e66ef614d8d63a81f2799c3b2bad938a6ae3b0a10a12772';
                    tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
                    tronDefaultAddr = tronWeb.defaultAddress.base58;
                    trxAddress = tronWeb.address.toHex(tronDefaultAddr);
                    trxAddressHex = '0x' + trxAddress.substring(2, 100);
                    signer = new tron_web_signer_1.TronWebSigner(tronWeb, trxAddressHex);
                    return [2 /*return*/, { client: client, pubKey: pubKey, privKey: privKey, signer: signer, loomProvider: loomProvider, contract: contract, ABI: ABI, account: account }];
            }
        });
    });
}
tape_1.default('Test Signed Tron Tx Middleware Type 2', function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var _a, client, signer, pubKey, loomProvider, contract, account, addressMapper, trxAddress, from, to, addressMapped, err_1, callerChainId, middlewaresUsed, tx, err_2;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                return [4 /*yield*/, bootstrapTest(helpers_2.createTestHttpClient)];
            case 1:
                _a = _b.sent(), client = _a.client, signer = _a.signer, pubKey = _a.pubKey, loomProvider = _a.loomProvider, contract = _a.contract, account = _a.account;
                return [4 /*yield*/, contracts_1.AddressMapper.createAsync(client, new address_1.Address(client.chainId, address_1.LocalAddress.fromPublicKey(pubKey)))
                    // Set the mapping
                ];
            case 2:
                addressMapper = _b.sent();
                return [4 /*yield*/, signer.getAddress()];
            case 3:
                trxAddress = _b.sent();
                from = new address_1.Address(client.chainId, address_1.LocalAddress.fromPublicKey(pubKey));
                to = new address_1.Address('tron', address_1.LocalAddress.fromHexString(trxAddress));
                return [4 /*yield*/, addressMapper.hasMappingAsync(from)];
            case 4:
                if (!!(_b.sent())) return [3 /*break*/, 6];
                return [4 /*yield*/, addressMapper.addIdentityMappingAsync(from, to, signer)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                _b.trys.push([6, 8, , 9]);
                return [4 /*yield*/, addressMapper.getMappingAsync(from)];
            case 7:
                addressMapped = _b.sent();
                t.assert(addressMapped.from.equals(from), 'Address mapper should map dappchain address');
                t.assert(addressMapped.to.equals(to), 'Address mapper should map tron address');
                return [3 /*break*/, 9];
            case 8:
                err_1 = _b.sent();
                t.error(err_1);
                return [3 /*break*/, 9];
            case 9:
                callerChainId = 'tron';
                // Override the default caller chain ID
                loomProvider.callerChainId = callerChainId;
                // Tron account needs its own middleware
                loomProvider.setMiddlewaresForAddress(to.local.toString(), [
                    new index_1.CachedNonceTxMiddleware(account, client),
                    new index_1.SignedTronTxMiddleware(signer)
                ]);
                middlewaresUsed = loomProvider.accountMiddlewares.get(trxAddress.toLowerCase());
                t.assert(middlewaresUsed[0] instanceof index_1.CachedNonceTxMiddleware, 'CachedNonceTxMiddleware used');
                t.assert(middlewaresUsed[1] instanceof index_1.SignedTronTxMiddleware, 'SignedTronTxMiddleware used');
                return [4 /*yield*/, contract.methods.set(1).send({ from: to.local.toString() })];
            case 10:
                tx = _b.sent();
                t.equal(tx.status, true, "SimpleStore.set should return correct status for address (to) " + to.local.toString());
                t.equal(tx.events.NewValueSet.returnValues.sender.toLowerCase(), from.local.toString(), "Should be the same sender from loomchain " + from.local.toString());
                return [3 /*break*/, 12];
            case 11:
                err_2 = _b.sent();
                console.error(err_2);
                t.fail(err_2.message);
                return [3 /*break*/, 12];
            case 12:
                t.end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=tron-test-tx-middleware.js.map