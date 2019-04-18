"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debug_1 = tslib_1.__importDefault(require("debug"));
var ethers_1 = require("ethers");
var helpers_1 = require("./helpers");
var _1 = require(".");
var address_mapper_1 = require("./contracts/address-mapper");
var solidity_helpers_1 = require("./solidity-helpers");
var log = debug_1.default('crosschain-user');
var CrossChainUser = /** @class */ (function () {
    function CrossChainUser(params) {
        this._wallet = params.wallet;
        this._loomAddress = params.loomAddress;
        this._ethAddress = params.ethAddress;
        this._client = params.client;
        this._addressMapper = params.addressMapper;
    }
    CrossChainUser.createOfflineCrossChainUserAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.JsonRpcProvider(params.ethEndpoint);
                wallet = new ethers_1.ethers.Wallet(params.ethereumPrivateKey, provider);
                return [2 /*return*/, CrossChainUser.createCrossChainUserAsync(tslib_1.__assign({ wallet: wallet }, params))];
            });
        });
    };
    CrossChainUser.createMetamaskCrossChainUserAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.Web3Provider(params.web3.currentProvider);
                wallet = provider.getSigner();
                return [2 /*return*/, CrossChainUser.createCrossChainUserAsync(tslib_1.__assign({ wallet: wallet }, params))];
            });
        });
    };
    CrossChainUser.createEthSignMetamaskCrossChainUserAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var wallet, _a, client, callerAddress, ethAddress, mapper, mapping, loomAddress;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        wallet = solidity_helpers_1.getMetamaskSigner(params.web3.currentProvider);
                        return [4 /*yield*/, helpers_1.createDefaultEthSignClientAsync(params.dappchainEndpoint, params.chainId, wallet)];
                    case 1:
                        _a = _b.sent(), client = _a.client, callerAddress = _a.callerAddress;
                        ethAddress = callerAddress.local.toString();
                        return [4 /*yield*/, address_mapper_1.AddressMapper.createAsync(client, callerAddress)];
                    case 2:
                        mapper = _b.sent();
                        return [4 /*yield*/, mapper.getMappingAsync(callerAddress)];
                    case 3:
                        mapping = _b.sent();
                        loomAddress = mapping.to;
                        return [2 /*return*/, new CrossChainUser({ wallet: wallet, client: client, loomAddress: loomAddress, ethAddress: ethAddress })];
                }
            });
        });
    };
    CrossChainUser.createCrossChainUserAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, client, publicKey, loomAddress, ethAddress, addressMapper;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = helpers_1.createDefaultClient(params.dappchainPrivateKey, params.dappchainEndpoint, params.chainId), client = _a.client, publicKey = _a.publicKey;
                        loomAddress = new _1.Address(client.chainId, _1.LocalAddress.fromPublicKey(publicKey));
                        return [4 /*yield*/, params.wallet.getAddress()];
                    case 1:
                        ethAddress = _b.sent();
                        return [4 /*yield*/, address_mapper_1.AddressMapper.createAsync(client, loomAddress)];
                    case 2:
                        addressMapper = _b.sent();
                        return [2 /*return*/, new CrossChainUser({
                                wallet: params.wallet,
                                client: client,
                                loomAddress: loomAddress,
                                ethAddress: ethAddress,
                                addressMapper: addressMapper
                            })];
                }
            });
        });
    };
    Object.defineProperty(CrossChainUser.prototype, "client", {
        get: function () {
            return this._client;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CrossChainUser.prototype, "wallet", {
        get: function () {
            return this._wallet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CrossChainUser.prototype, "addressMapper", {
        get: function () {
            return this._addressMapper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CrossChainUser.prototype, "ethAddress", {
        get: function () {
            return this._ethAddress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CrossChainUser.prototype, "loomAddress", {
        get: function () {
            return this._loomAddress;
        },
        enumerable: true,
        configurable: true
    });
    CrossChainUser.prototype.disconnect = function () {
        this.client.disconnect();
    };
    /**
     * Maps the user's ETH address to their DAppChain address. This MUST be called before any interaction with the gateways.
     *
     * @param account The user's account object
     * @param wallet The User's ethers wallet
     */
    CrossChainUser.prototype.mapAccountsAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var walletAddress, ethereumAddress, signer;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._addressMapper === null) {
                            throw new Error("Tried to map accounts with nil address mapper");
                        }
                        return [4 /*yield*/, this._wallet.getAddress()];
                    case 1:
                        walletAddress = _a.sent();
                        ethereumAddress = _1.Address.fromString("eth:" + walletAddress);
                        return [4 /*yield*/, this._addressMapper.hasMappingAsync(this._loomAddress)];
                    case 2:
                        if (_a.sent()) {
                            log(this._loomAddress.toString() + " is already mapped");
                            return [2 /*return*/];
                        }
                        signer = new _1.EthersSigner(this._wallet);
                        return [4 /*yield*/, this._addressMapper.addIdentityMappingAsync(this._loomAddress, ethereumAddress, signer)];
                    case 3:
                        _a.sent();
                        log("Mapped " + this._loomAddress + " to " + ethereumAddress);
                        return [2 /*return*/];
                }
            });
        });
    };
    return CrossChainUser;
}());
exports.CrossChainUser = CrossChainUser;
//# sourceMappingURL=crosschain-user.js.map