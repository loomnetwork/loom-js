"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var debug_1 = tslib_1.__importDefault(require("debug"));
var ethers_1 = require("ethers");
var _1 = require(".");
var contracts_1 = require("./contracts");
var helpers_1 = require("./helpers");
var solidity_helpers_1 = require("./solidity-helpers");
var crosschain_user_1 = require("./crosschain-user");
var log = debug_1.default('gateway-user');
var coinMultiplier = new bn_js_1.default(10).pow(new bn_js_1.default(18));
var ValidatorManagerContractABI = require('./mainnet-contracts/ValidatorManagerContract.json');
var ERC20GatewayABI = require('./mainnet-contracts/ERC20Gateway.json');
var ERC20GatewayABI_v2 = require('./mainnet-contracts/ERC20Gateway_v2.json');
var ERC20ABI = require('./mainnet-contracts/ERC20.json');
var ERC20Prefix = '\x10Withdraw ERC20:\n';
var V2_GATEWAYS = ['oracle-dev', 'asia1'];
var GatewayVersion;
(function (GatewayVersion) {
    GatewayVersion[GatewayVersion["SINGLESIG"] = 1] = "SINGLESIG";
    GatewayVersion[GatewayVersion["MULTISIG"] = 2] = "MULTISIG";
})(GatewayVersion = exports.GatewayVersion || (exports.GatewayVersion = {}));
var GatewayUser = /** @class */ (function (_super) {
    tslib_1.__extends(GatewayUser, _super);
    function GatewayUser(params) {
        var _this = _super.call(this, params) || this;
        _this._version = params.version;
        // Set ethereum contracts
        // @ts-ignore
        _this._ethereumGateway = params.gateway;
        // @ts-ignore
        _this._ethereumLoom = params.loomToken;
        // @ts-ignore
        _this._ethereumVMC = params.vmc;
        // Set dappchain contracts
        _this._dappchainGateway = params.dappchainGateway;
        _this._dappchainLoom = params.dappchainLoom;
        _this._dappchainGateway = params.dappchainGateway;
        return _this;
    }
    GatewayUser.createGatewayOfflineUserAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.JsonRpcProvider(params.ethEndpoint);
                wallet = new ethers_1.ethers.Wallet(params.ethereumPrivateKey, provider);
                return [2 /*return*/, GatewayUser.createGatewayUserAsync(tslib_1.__assign({ wallet: wallet }, params))];
            });
        });
    };
    GatewayUser.createGatewayMetamaskUserAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var wallet;
            return tslib_1.__generator(this, function (_a) {
                wallet = solidity_helpers_1.getMetamaskSigner(params.web3.currentProvider);
                return [2 /*return*/, GatewayUser.createGatewayUserAsync(tslib_1.__assign({ wallet: wallet }, params))];
            });
        });
    };
    GatewayUser.getContracts = function (wallet, gatewayAddress, version) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var gatewayABI, gateway, loomAddress, loomToken, vmc, vmcAddress;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gatewayABI = version == GatewayVersion.MULTISIG ? ERC20GatewayABI_v2 : ERC20GatewayABI;
                        gateway = new ethers_1.ethers.Contract(gatewayAddress, gatewayABI, wallet);
                        return [4 /*yield*/, gateway.functions.loomAddress()];
                    case 1:
                        loomAddress = _a.sent();
                        loomToken = new ethers_1.ethers.Contract(loomAddress, ERC20ABI, wallet);
                        if (!(version === GatewayVersion.MULTISIG)) return [3 /*break*/, 3];
                        return [4 /*yield*/, gateway.functions.vmc()];
                    case 2:
                        vmcAddress = _a.sent();
                        vmc = new ethers_1.ethers.Contract(vmcAddress, ValidatorManagerContractABI, wallet);
                        _a.label = 3;
                    case 3: return [2 /*return*/, {
                            gateway: gateway,
                            loomToken: loomToken,
                            vmc: vmc
                        }];
                }
            });
        });
    };
    GatewayUser.getGatewayVersion = function (endpoint, version) {
        // If no gateway version is provided, pick based on the chain URL prefix
        var retVersion = GatewayVersion.SINGLESIG;
        if (typeof version === undefined) {
            var chainName = endpoint.split('.')[0];
            for (var _i = 0, V2_GATEWAYS_1 = V2_GATEWAYS; _i < V2_GATEWAYS_1.length; _i++) {
                var chainPrefix = V2_GATEWAYS_1[_i];
                if (chainName.indexOf(chainPrefix) != -1) {
                    retVersion = GatewayVersion.MULTISIG;
                }
            }
        }
        return retVersion;
    };
    GatewayUser.createEthSignMetamaskGatewayUserAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var gwVersion, crosschain, dappchainEthAddress, dappchainLoom, dappchainGateway, _a, gateway, loomToken, vmc;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        gwVersion = GatewayUser.getGatewayVersion(params.dappchainEndpoint, params.version);
                        return [4 /*yield*/, crosschain_user_1.CrossChainUser.createEthSignMetamaskCrossChainUserAsync(params)];
                    case 1:
                        crosschain = _b.sent();
                        dappchainEthAddress = new _1.Address('eth', _1.LocalAddress.fromHexString(crosschain.ethAddress));
                        return [4 /*yield*/, contracts_1.Coin.createAsync(crosschain.client, dappchainEthAddress)];
                    case 2:
                        dappchainLoom = _b.sent();
                        return [4 /*yield*/, contracts_1.LoomCoinTransferGateway.createAsync(crosschain.client, dappchainEthAddress)];
                    case 3:
                        dappchainGateway = _b.sent();
                        return [4 /*yield*/, GatewayUser.getContracts(crosschain.wallet, params.gatewayAddress, params.version)];
                    case 4:
                        _a = _b.sent(), gateway = _a.gateway, loomToken = _a.loomToken, vmc = _a.vmc;
                        return [2 /*return*/, new GatewayUser({
                                wallet: crosschain.wallet,
                                client: crosschain.client,
                                loomAddress: crosschain.loomAddress,
                                ethAddress: crosschain.ethAddress,
                                gateway: gateway,
                                loomToken: loomToken,
                                vmc: vmc,
                                dappchainGateway: dappchainGateway,
                                dappchainLoom: dappchainLoom,
                                version: gwVersion
                            })];
                }
            });
        });
    };
    GatewayUser.createGatewayUserAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var gwVersion, crosschain, dappchainLoom, dappchainGateway, _a, gateway, loomToken, vmc;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        gwVersion = GatewayUser.getGatewayVersion(params.dappchainEndpoint, params.version);
                        return [4 /*yield*/, crosschain_user_1.CrossChainUser.createCrossChainUserAsync(params)];
                    case 1:
                        crosschain = _b.sent();
                        return [4 /*yield*/, contracts_1.Coin.createAsync(crosschain.client, crosschain.loomAddress)];
                    case 2:
                        dappchainLoom = _b.sent();
                        return [4 /*yield*/, contracts_1.LoomCoinTransferGateway.createAsync(crosschain.client, crosschain.loomAddress)];
                    case 3:
                        dappchainGateway = _b.sent();
                        return [4 /*yield*/, GatewayUser.getContracts(crosschain.wallet, params.gatewayAddress, params.version)];
                    case 4:
                        _a = _b.sent(), gateway = _a.gateway, loomToken = _a.loomToken, vmc = _a.vmc;
                        return [2 /*return*/, new GatewayUser({
                                wallet: crosschain.wallet,
                                client: crosschain.client,
                                loomAddress: crosschain.loomAddress,
                                ethAddress: crosschain.ethAddress,
                                gateway: gateway,
                                loomToken: loomToken,
                                vmc: vmc,
                                dappchainGateway: dappchainGateway,
                                dappchainLoom: dappchainLoom,
                                addressMapper: crosschain.addressMapper,
                                version: gwVersion
                            })];
                }
            });
        });
    };
    Object.defineProperty(GatewayUser.prototype, "ethereumVMC", {
        get: function () {
            return this._ethereumVMC;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GatewayUser.prototype, "ethereumGateway", {
        get: function () {
            return this._ethereumGateway;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GatewayUser.prototype, "ethereumLoom", {
        get: function () {
            return this._ethereumLoom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GatewayUser.prototype, "dappchainLoom", {
        get: function () {
            return this._dappchainLoom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GatewayUser.prototype, "dappchainGateway", {
        get: function () {
            return this._dappchainGateway;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Deposits funds from mainnet to the gateway
     */
    GatewayUser.prototype.depositAsync = function (amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentApproval, _a, _b, currentApprovalBN, tx;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = this._ethereumLoom.functions).allowance;
                        return [4 /*yield*/, this.ethAddress];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                            this._ethereumGateway.address])];
                    case 2:
                        currentApproval = _c.sent();
                        currentApprovalBN = new bn_js_1.default(currentApproval.toString());
                        log('Current approval:', currentApproval);
                        if (!amount.gt(currentApprovalBN)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._ethereumLoom.functions.approve(this._ethereumGateway.address, amount.sub(currentApprovalBN).toString())];
                    case 3:
                        tx = _c.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 4:
                        _c.sent();
                        log('Approved an extra', amount.sub(currentApprovalBN));
                        _c.label = 5;
                    case 5: return [2 /*return*/, this._ethereumGateway.functions.depositERC20(amount.toString(), this._ethereumLoom.address)];
                }
            });
        });
    };
    /**
     * Withdraw funds from the gateway to mainnet
     */
    GatewayUser.prototype.withdrawAsync = function (amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var sig;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.depositCoinToDAppChainGatewayAsync(amount)];
                    case 1:
                        sig = _a.sent();
                        return [2 /*return*/, this.withdrawCoinFromDAppChainGatewayAsync(amount, sig)];
                }
            });
        });
    };
    GatewayUser.prototype.resumeWithdrawalAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var receipt, signature, amount;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPendingWithdrawalReceiptAsync()];
                    case 1:
                        receipt = _a.sent();
                        if (receipt === null) {
                            log('No pending receipt');
                            return [2 /*return*/];
                        }
                        signature = _1.CryptoUtils.bytesToHexAddr(receipt.oracleSignature);
                        amount = receipt.tokenAmount;
                        return [2 /*return*/, this.withdrawCoinFromDAppChainGatewayAsync(amount, signature)];
                }
            });
        });
    };
    GatewayUser.prototype.getPendingWithdrawalReceiptAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._dappchainGateway.withdrawalReceiptAsync(this.loomAddress)];
            });
        });
    };
    /**
     * Retrieves the  DAppChain LoomCoin balance of a user
     * @param address The address to check the balance of. If not provided, it will check the user's balance
     */
    GatewayUser.prototype.getDAppChainBalanceAsync = function (address) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var addr, balance;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addr = address ? this.prefixAddress(address) : this.loomAddress;
                        return [4 /*yield*/, this._dappchainLoom.getBalanceOfAsync(addr)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, balance];
                }
            });
        });
    };
    /**
     * Deposits an amount of LOOM tokens to the dappchain gateway and return a signature which can be used to withdraw the same amount from the mainnet gateway.
     *
     * @param amount The amount that will be deposited to the DAppChain Gateway (and will be possible to withdraw from the mainnet)
     */
    GatewayUser.prototype.depositCoinToDAppChainGatewayAsync = function (amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pendingReceipt, signature, ethereumAddressStr, ethereumAddress, _ethereumLoomCoinAddress;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPendingWithdrawalReceiptAsync()];
                    case 1:
                        pendingReceipt = _a.sent();
                        if (!(pendingReceipt === null)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this._dappchainLoom.approveAsync(this._dappchainGateway.address, amount)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.ethAddress];
                    case 3:
                        ethereumAddressStr = _a.sent();
                        ethereumAddress = _1.Address.fromString("eth:" + ethereumAddressStr);
                        _ethereumLoomCoinAddress = _1.Address.fromString("eth:" + this._ethereumLoom.address);
                        return [4 /*yield*/, this._dappchainGateway.withdrawLoomCoinAsync(amount, _ethereumLoomCoinAddress, ethereumAddress)];
                    case 4:
                        _a.sent();
                        log(amount.div(coinMultiplier).toString() + " tokens deposited to DAppChain Gateway...");
                        _a.label = 5;
                    case 5:
                        if (!(pendingReceipt === null || pendingReceipt.oracleSignature.length === 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getPendingWithdrawalReceiptAsync()];
                    case 6:
                        pendingReceipt = _a.sent();
                        return [4 /*yield*/, helpers_1.sleep(2000)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 8:
                        signature = pendingReceipt.oracleSignature;
                        return [2 /*return*/, _1.CryptoUtils.bytesToHexAddr(signature)];
                }
            });
        });
    };
    GatewayUser.prototype.getUnclaimedLoomTokensAsync = function (owner) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var address, tokens, unclaimedLoomTokens, amount, amounts;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = owner
                            ? _1.Address.fromString("eth:" + owner)
                            : _1.Address.fromString("eth:" + this.ethAddress);
                        return [4 /*yield*/, this._dappchainGateway.getUnclaimedTokensAsync(address)];
                    case 1:
                        tokens = _a.sent();
                        unclaimedLoomTokens = tokens.filter(function (t) { return t.tokenContract.local.toString() === _this.ethereumLoom.address; });
                        if (unclaimedLoomTokens.length === 0) {
                            // no unclaimed tokens
                            amount = new bn_js_1.default(0);
                        }
                        else {
                            amounts = unclaimedLoomTokens[0].tokenAmounts;
                            amount = amounts ? amounts[0] : new bn_js_1.default(0);
                        }
                        return [2 /*return*/, amount];
                }
            });
        });
    };
    GatewayUser.prototype.withdrawCoinFromDAppChainGatewayAsync = function (amount, sig) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var hash, validators, _a, vs, rs, ss, valIndexes;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._version === GatewayVersion.MULTISIG && this._ethereumVMC !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createWithdrawalHash(amount)];
                    case 1:
                        hash = _b.sent();
                        return [4 /*yield*/, this._ethereumVMC.functions.getValidators()];
                    case 2:
                        validators = _b.sent();
                        _a = helpers_1.parseSigs(sig, hash, validators), vs = _a.vs, rs = _a.rs, ss = _a.ss, valIndexes = _a.valIndexes;
                        return [2 /*return*/, this._ethereumGateway.functions.withdrawERC20(amount.toString(), this._ethereumLoom.address, valIndexes, vs, rs, ss)];
                    case 3: 
                    // @ts-ignore
                    return [2 /*return*/, this._ethereumGateway.functions.withdrawERC20(amount.toString(), sig, this._ethereumLoom.address)];
                }
            });
        });
    };
    GatewayUser.prototype.createWithdrawalHash = function (amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nonce, amountHashed, msg;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ethereumGateway.functions.nonces(this.ethAddress)];
                    case 1:
                        nonce = _a.sent();
                        amountHashed = ethers_1.ethers.utils.solidityKeccak256(['uint256', 'address'], [amount.toString(), this.ethereumLoom.address]);
                        msg = ethers_1.ethers.utils.solidityKeccak256(['string', 'address', 'uint256', 'address', 'bytes32'], [ERC20Prefix, this.ethAddress, nonce, this.ethereumGateway.address, amountHashed]);
                        return [2 /*return*/, msg];
                }
            });
        });
    };
    /**
     * Helper function to prefix an address with the chainId to get chainId:address format
     */
    GatewayUser.prototype.prefixAddress = function (address) {
        return _1.Address.fromString(this.client.chainId + ":" + address);
    };
    return GatewayUser;
}(crosschain_user_1.CrossChainUser));
exports.GatewayUser = GatewayUser;
//# sourceMappingURL=gateway-user.js.map