"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var debug_1 = tslib_1.__importDefault(require("debug"));
var ethers_1 = require("ethers");
var _1 = require(".");
var contracts_1 = require("./contracts");
var helpers_1 = require("./helpers");
var gateway_user_1 = require("./gateway-user");
var solidity_helpers_1 = require("./solidity-helpers");
var log = debug_1.default('dpos-user');
var DPOSUser = /** @class */ (function (_super) {
    tslib_1.__extends(DPOSUser, _super);
    function DPOSUser(wallet, client, loomAddress, ethAddress, gateway, loomToken, vmc, dappchainGateway, dappchainLoom, dappchainDPOS, dappchainMapper, version) {
        if (version === void 0) { version = gateway_user_1.GatewayVersion.SINGLESIG; }
        var _this = _super.call(this, {
            wallet: wallet,
            client: client,
            loomAddress: loomAddress,
            ethAddress: ethAddress,
            gateway: gateway,
            loomToken: loomToken,
            vmc: vmc,
            dappchainGateway: dappchainGateway,
            dappchainLoom: dappchainLoom,
            addressMapper: dappchainMapper,
            version: version
        }) || this;
        _this._dappchainDPOS = dappchainDPOS;
        return _this;
    }
    DPOSUser.createOfflineUserAsync = function (endpoint, privateKey, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, version) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.JsonRpcProvider(endpoint);
                wallet = new ethers_1.ethers.Wallet(privateKey, provider);
                return [2 /*return*/, DPOSUser.createUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, version)];
            });
        });
    };
    DPOSUser.createMetamaskUserAsync = function (web3, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, version) {
        var wallet = solidity_helpers_1.getMetamaskSigner(web3.currentProvider);
        return DPOSUser.createUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, version);
    };
    DPOSUser.createEthSignMetamaskUserAsync = function (web3, dappchainEndpoint, chainId, gatewayAddress, version) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var gatewayUser, dappchainEthAddress, dappchainDPOS;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gateway_user_1.GatewayUser.createEthSignMetamaskGatewayUserAsync({
                            web3: web3,
                            dappchainEndpoint: dappchainEndpoint,
                            chainId: chainId,
                            gatewayAddress: gatewayAddress,
                            version: version ? version : gateway_user_1.GatewayVersion.SINGLESIG
                        })];
                    case 1:
                        gatewayUser = _a.sent();
                        dappchainEthAddress = new _1.Address('eth', _1.LocalAddress.fromHexString(gatewayUser.ethAddress));
                        return [4 /*yield*/, contracts_1.DPOS2.createAsync(gatewayUser.client, dappchainEthAddress)];
                    case 2:
                        dappchainDPOS = _a.sent();
                        log('Connected to dappchain DPOS Contract');
                        return [2 /*return*/, new DPOSUser(gatewayUser.wallet, gatewayUser.client, gatewayUser.loomAddress, gatewayUser.ethAddress, gatewayUser.ethereumGateway, gatewayUser.ethereumLoom, gatewayUser.ethereumVMC, gatewayUser.dappchainGateway, gatewayUser.dappchainLoom, dappchainDPOS, null, version)];
                }
            });
        });
    };
    DPOSUser.createUserAsync = function (wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, version) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var gatewayUser, _a, client, address, dappchainDPOS;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, gateway_user_1.GatewayUser.createGatewayUserAsync({
                            wallet: wallet,
                            dappchainEndpoint: dappchainEndpoint,
                            dappchainPrivateKey: dappchainKey,
                            chainId: chainId,
                            gatewayAddress: gatewayAddress,
                            version: version ? version : gateway_user_1.GatewayVersion.SINGLESIG
                        })];
                    case 1:
                        gatewayUser = _b.sent();
                        _a = helpers_1.createDefaultClient(dappchainKey, dappchainEndpoint, chainId), client = _a.client, address = _a.address;
                        return [4 /*yield*/, contracts_1.DPOS2.createAsync(client, address)];
                    case 2:
                        dappchainDPOS = _b.sent();
                        log('Connected to dappchain DPOS Contract');
                        return [2 /*return*/, new DPOSUser(gatewayUser.wallet, gatewayUser.client, gatewayUser.loomAddress, gatewayUser.ethAddress, gatewayUser.ethereumGateway, gatewayUser.ethereumLoom, gatewayUser.ethereumVMC, gatewayUser.dappchainGateway, gatewayUser.dappchainLoom, dappchainDPOS, gatewayUser.addressMapper, version)];
                }
            });
        });
    };
    Object.defineProperty(DPOSUser.prototype, "dappchainDPOS", {
        get: function () {
            return this._dappchainDPOS;
        },
        enumerable: true,
        configurable: true
    });
    DPOSUser.prototype.listValidatorsAsync = function () {
        return this._dappchainDPOS.getValidatorsAsync();
    };
    DPOSUser.prototype.listCandidatesAsync = function () {
        return this._dappchainDPOS.getCandidatesAsync();
    };
    DPOSUser.prototype.listAllDelegationsAsync = function () {
        return this._dappchainDPOS.getAllDelegations();
    };
    DPOSUser.prototype.listDelegationsAsync = function (candidate) {
        var address = this.prefixAddress(candidate);
        return this._dappchainDPOS.getDelegations(address);
    };
    DPOSUser.prototype.listDelegatorDelegations = function (delegator) {
        var address = delegator ? this.prefixAddress(delegator) : this.loomAddress;
        return this._dappchainDPOS.checkDelegatorDelegations(address);
    };
    DPOSUser.prototype.getTimeUntilElectionsAsync = function () {
        return this._dappchainDPOS.getTimeUntilElectionAsync();
    };
    /**
     * Delegates an amount of LOOM tokens to a candidate/validator
     *
     * @param candidate The candidate's hex address
     * @param amount The amount delegated
     */
    DPOSUser.prototype.delegateAsync = function (candidate, amount, tier) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var address;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = this.prefixAddress(candidate);
                        return [4 /*yield*/, this.dappchainLoom.approveAsync(this._dappchainDPOS.address, amount)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this._dappchainDPOS.delegateAsync(address, amount, tier)];
                }
            });
        });
    };
    /**
     * Redelegates an amount of LOOM tokens from a validator to another
     *
     * @param formerValidator The candidate's hex address
     * @param newValidator The candidate's hex address
     * @param amount The amount delegated
     */
    DPOSUser.prototype.redelegateAsync = function (formerValidator, validator, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var validatorAddress, formerValidatorAddress;
            return tslib_1.__generator(this, function (_a) {
                validatorAddress = this.prefixAddress(validator);
                formerValidatorAddress = this.prefixAddress(formerValidator);
                return [2 /*return*/, this._dappchainDPOS.redelegateAsync(formerValidatorAddress, validatorAddress, amount)];
            });
        });
    };
    /**
     * Undelegates an amount of LOOM tokens from a candidate/validator
     *
     * @param candidate The candidate's hex address
     * @param amount The amount to undelegate
     */
    DPOSUser.prototype.undelegateAsync = function (candidate, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var address;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = this.prefixAddress(candidate);
                        return [4 /*yield*/, this._dappchainDPOS.unbondAsync(address, amount)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DPOSUser.prototype.claimDelegationsAsync = function (withdrawalAddress) {
        var address = withdrawalAddress ? this.prefixAddress(withdrawalAddress) : this.loomAddress;
        return this._dappchainDPOS.claimDistributionAsync(address);
    };
    /**
     * Returns the stake a delegator has delegated to a candidate/validator
     *
     * @param validator The validator's hex address
     * @param delegator The delegator's hex address
     */
    DPOSUser.prototype.checkDelegationsAsync = function (validator, delegator) {
        var validatorAddress = this.prefixAddress(validator);
        var delegatorAddress = delegator ? this.prefixAddress(delegator) : this.loomAddress;
        return this._dappchainDPOS.checkDelegationAsync(validatorAddress, delegatorAddress);
    };
    /**
     * Returns the total stake a delegator has delegated to all validators
     *
     * @param delegator The delegator's hex address. If not supplied, will use the current account as a delegator.
     */
    DPOSUser.prototype.getTotalDelegationAsync = function (delegator) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var delegatorAddress;
            return tslib_1.__generator(this, function (_a) {
                delegatorAddress = delegator ? this.prefixAddress(delegator) : this.loomAddress;
                return [2 /*return*/, this._dappchainDPOS.totalDelegationAsync(delegatorAddress)];
            });
        });
    };
    DPOSUser.prototype.checkRewardsAsync = function (owner) {
        var address = owner ? this.prefixAddress(owner) : this.loomAddress;
        return this._dappchainDPOS.checkDistributionAsync(address);
    };
    return DPOSUser;
}(gateway_user_1.GatewayUser));
exports.DPOSUser = DPOSUser;
//# sourceMappingURL=dpos-user.js.map