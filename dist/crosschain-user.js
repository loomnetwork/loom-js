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
    function CrossChainUser(wallet, client, address, ethAddress, dappchainMapper) {
        this._wallet = wallet;
        this._address = address;
        this._ethAddress = ethAddress;
        this._client = client;
        this._dappchainMapper = dappchainMapper;
    }
    CrossChainUser.createOfflineCrossChainUserAsync = function (endpoint, privateKey, dappchainEndpoint, dappchainKey, chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.JsonRpcProvider(endpoint);
                wallet = new ethers_1.ethers.Wallet(privateKey, provider);
                return [2 /*return*/, CrossChainUser.createCrossChainUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId)];
            });
        });
    };
    CrossChainUser.createMetamaskCrossChainUserAsync = function (web3, dappchainEndpoint, dappchainKey, chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.Web3Provider(web3.currentProvider);
                wallet = provider.getSigner();
                return [2 /*return*/, CrossChainUser.createCrossChainUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId)];
            });
        });
    };
    CrossChainUser.createEthSignMetamaskCrossChainUserAsync = function (web3, dappchainEndpoint, chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var wallet, _a, client, callerAddress, ethAddress, mapper, mapping, dappchainAddress;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        wallet = solidity_helpers_1.getMetamaskSigner(web3.currentProvider);
                        return [4 /*yield*/, helpers_1.createDefaultEthSignClientAsync(dappchainEndpoint, chainId, wallet)];
                    case 1:
                        _a = _b.sent(), client = _a.client, callerAddress = _a.callerAddress;
                        ethAddress = callerAddress.local.toString();
                        return [4 /*yield*/, address_mapper_1.AddressMapper.createAsync(client, callerAddress)];
                    case 2:
                        mapper = _b.sent();
                        return [4 /*yield*/, mapper.getMappingAsync(callerAddress)];
                    case 3:
                        mapping = _b.sent();
                        dappchainAddress = mapping.to;
                        return [2 /*return*/, new CrossChainUser(wallet, client, dappchainAddress, ethAddress, null)];
                }
            });
        });
    };
    CrossChainUser.createCrossChainUserAsync = function (wallet, dappchainEndpoint, dappchainKey, chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, client, publicKey, dappchainAddress, ethAddress, dappchainMapper;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = helpers_1.createDefaultClient(dappchainKey, dappchainEndpoint, chainId), client = _a.client, publicKey = _a.publicKey;
                        dappchainAddress = new _1.Address(chainId, _1.LocalAddress.fromPublicKey(publicKey));
                        return [4 /*yield*/, wallet.getAddress()];
                    case 1:
                        ethAddress = _b.sent();
                        return [4 /*yield*/, address_mapper_1.AddressMapper.createAsync(client, dappchainAddress)];
                    case 2:
                        dappchainMapper = _b.sent();
                        return [2 /*return*/, new CrossChainUser(wallet, client, dappchainAddress, ethAddress, dappchainMapper)];
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
            return this._dappchainMapper;
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
            return this._address;
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
                        if (this._dappchainMapper === null) {
                            throw new Error("Tried to map accounts with nil address mapper");
                        }
                        return [4 /*yield*/, this._wallet.getAddress()];
                    case 1:
                        walletAddress = _a.sent();
                        ethereumAddress = _1.Address.fromString("eth:" + walletAddress);
                        return [4 /*yield*/, this._dappchainMapper.hasMappingAsync(this._address)];
                    case 2:
                        if (_a.sent()) {
                            log(this._address.toString() + " is already mapped");
                            return [2 /*return*/];
                        }
                        signer = new _1.EthersSigner(this._wallet);
                        return [4 /*yield*/, this._dappchainMapper.addIdentityMappingAsync(this._address, ethereumAddress, signer)];
                    case 3:
                        _a.sent();
                        log("Mapped " + this._address + " to " + ethereumAddress);
                        return [2 /*return*/];
                }
            });
        });
    };
    return CrossChainUser;
}());
exports.CrossChainUser = CrossChainUser;
//# sourceMappingURL=crosschain-user.js.map