"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debug_1 = tslib_1.__importDefault(require("debug"));
var ethers_1 = require("ethers");
var helpers_1 = require("./helpers");
var _1 = require(".");
var address_mapper_1 = require("./contracts/address-mapper");
var log = debug_1.default('crosschain');
var CrossChain = /** @class */ (function () {
    function CrossChain(wallet, client, address, ethAddress, dappchainMapper) {
        this._wallet = wallet;
        this._address = address;
        this._ethAddress = ethAddress;
        this._client = client;
        this._dappchainMapper = dappchainMapper;
    }
    CrossChain.createOfflineUserAsync = function (endpoint, privateKey, dappchainEndpoint, dappchainKey, chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.JsonRpcProvider(endpoint);
                wallet = new ethers_1.ethers.Wallet(privateKey, provider);
                return [2 /*return*/, CrossChain.createUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId)];
            });
        });
    };
    CrossChain.createMetamaskUserAsync = function (web3, dappchainEndpoint, dappchainKey, chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.Web3Provider(web3.currentProvider);
                wallet = provider.getSigner();
                return [2 /*return*/, CrossChain.createUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId)];
            });
        });
    };
    CrossChain.createUserAsync = function (wallet, dappchainEndpoint, dappchainKey, chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, client, publicKey, address, ethAddress, dappchainMapper;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = helpers_1.createClient(dappchainKey, dappchainEndpoint, chainId), client = _a.client, publicKey = _a.publicKey;
                        address = new _1.Address(chainId, _1.LocalAddress.fromPublicKey(publicKey));
                        return [4 /*yield*/, wallet.getAddress()];
                    case 1:
                        ethAddress = _b.sent();
                        return [4 /*yield*/, address_mapper_1.AddressMapper.createAsync(client, address)];
                    case 2:
                        dappchainMapper = _b.sent();
                        return [2 /*return*/, new CrossChain(wallet, client, address, ethAddress, dappchainMapper)];
                }
            });
        });
    };
    Object.defineProperty(CrossChain.prototype, "client", {
        get: function () {
            return this._client;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CrossChain.prototype, "wallet", {
        get: function () {
            return this._wallet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CrossChain.prototype, "addressMapper", {
        get: function () {
            return this._dappchainMapper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CrossChain.prototype, "ethAddress", {
        get: function () {
            return this._ethAddress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CrossChain.prototype, "loomAddress", {
        get: function () {
            return this._address;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Maps the user's ETH address to their DAppChain address. This MUST be called before any interaction with the gateways.
     *
     * @param account The user's account object
     * @param wallet The User's ethers wallet
     */
    CrossChain.prototype.mapAccountsAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var walletAddress, ethereumAddress, signer;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._wallet.getAddress()];
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
    return CrossChain;
}());
exports.CrossChain = CrossChain;
//# sourceMappingURL=crosschain.js.map