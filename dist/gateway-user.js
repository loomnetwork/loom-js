"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var debug_1 = tslib_1.__importDefault(require("debug"));
var ethers_1 = require("ethers");
var _1 = require(".");
var contracts_1 = require("./contracts");
var helpers_1 = require("./helpers");
var crosschain_1 = require("./crosschain");
var log = debug_1.default('dpos-user');
var coinMultiplier = new bn_js_1.default(10).pow(new bn_js_1.default(18));
var ERC20Gateway_1 = require("./mainnet-contracts/ERC20Gateway");
var ERC20_1 = require("./mainnet-contracts/ERC20");
var ERC20GatewayABI = require('./mainnet-contracts/ERC20.json');
var ERC20ABI = require('./mainnet-contracts/ERC20.json');
var GatewayUser = /** @class */ (function (_super) {
    tslib_1.__extends(GatewayUser, _super);
    function GatewayUser(wallet, client, address, ethAddress, gatewayAddress, loomAddress, dappchainGateway, dappchainLoom, dappchainMapper) {
        var _this = _super.call(this, wallet, client, address, ethAddress, dappchainMapper) || this;
        _this._ethereumGateway = new ERC20Gateway_1.ERC20Gateway(gatewayAddress, ERC20GatewayABI, wallet);
        _this._ethereumLoom = new ERC20_1.ERC20(loomAddress, ERC20ABI, wallet);
        _this._dappchainGateway = dappchainGateway;
        _this._dappchainLoom = dappchainLoom;
        _this._dappchainGateway = dappchainGateway;
        return _this;
    }
    GatewayUser.createGatewayOfflineUserAsync = function (endpoint, privateKey, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.JsonRpcProvider(endpoint);
                wallet = new ethers_1.ethers.Wallet(privateKey, provider);
                return [2 /*return*/, GatewayUser.createGatewayUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress)];
            });
        });
    };
    GatewayUser.createGatewayMetamaskUserAsync = function (web3, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.Web3Provider(web3.currentProvider);
                wallet = provider.getSigner();
                return [2 /*return*/, GatewayUser.createGatewayUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress)];
            });
        });
    };
    GatewayUser.createGatewayUserAsync = function (wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var crosschain, dappchainLoom, dappchainGateway;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, crosschain_1.CrossChain.createUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId)];
                    case 1:
                        crosschain = _a.sent();
                        return [4 /*yield*/, contracts_1.Coin.createAsync(crosschain.client, crosschain.loomAddress)];
                    case 2:
                        dappchainLoom = _a.sent();
                        return [4 /*yield*/, contracts_1.LoomCoinTransferGateway.createAsync(crosschain.client, crosschain.loomAddress)];
                    case 3:
                        dappchainGateway = _a.sent();
                        return [2 /*return*/, new GatewayUser(wallet, crosschain.client, crosschain.loomAddress, crosschain.ethAddress, gatewayAddress, loomAddress, dappchainGateway, dappchainLoom, crosschain.addressMapper)];
                }
            });
        });
    };
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
                        return [2 /*return*/, this.withdrawCoinFromRinkebyGatewayAsync(amount, sig)];
                }
            });
        });
    };
    GatewayUser.prototype.resumeWithdrawalAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var receipt, amount;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPendingWithdrawalReceiptAsync()];
                    case 1:
                        receipt = _a.sent();
                        if (receipt === null) {
                            log('No pending receipt');
                            return [2 /*return*/];
                        }
                        amount = receipt.tokenAmount;
                        return [2 /*return*/, this.withdrawCoinFromRinkebyGatewayAsync(amount, receipt.sig)];
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
            var pubKey, callerAddress, balance;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if no address is provided, return our balance
                        if (address === undefined) {
                            return [2 /*return*/, this._dappchainLoom.getBalanceOfAsync(this.loomAddress)];
                        }
                        pubKey = _1.CryptoUtils.B64ToUint8Array(address);
                        callerAddress = new _1.Address(this.client.chainId, _1.LocalAddress.fromPublicKey(pubKey));
                        return [4 /*yield*/, this._dappchainLoom.getBalanceOfAsync(callerAddress)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, balance];
                }
            });
        });
    };
    GatewayUser.prototype.disconnect = function () {
        this.client.disconnect();
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
                        if (!(pendingReceipt === null || pendingReceipt.sig === null)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getPendingWithdrawalReceiptAsync()];
                    case 6:
                        pendingReceipt = _a.sent();
                        return [4 /*yield*/, helpers_1.sleep(2000)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 8:
                        signature = pendingReceipt.sig;
                        return [2 /*return*/, signature];
                }
            });
        });
    };
    GatewayUser.prototype.withdrawCoinFromRinkebyGatewayAsync = function (amount, sig) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._ethereumGateway.functions.withdrawERC20(amount.toString(), this._ethereumLoom.address, 
                    // @ts-ignore
                    sig.validatorIndexes, sig.v, sig.r, sig.s)];
            });
        });
    };
    return GatewayUser;
}(crosschain_1.CrossChain));
exports.GatewayUser = GatewayUser;
//# sourceMappingURL=gateway-user.js.map