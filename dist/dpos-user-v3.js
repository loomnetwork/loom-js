"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var debug_1 = tslib_1.__importDefault(require("debug"));
var ethers_1 = require("ethers");
var _1 = require(".");
var contracts_1 = require("./contracts");
var gateway_user_1 = require("./gateway-user");
var solidity_helpers_1 = require("./solidity-helpers");
var dposv3_pb_1 = require("./proto/dposv3_pb");
var log = debug_1.default('dpos3-user');
var DPOSUserV3 = /** @class */ (function (_super) {
    tslib_1.__extends(DPOSUserV3, _super);
    function DPOSUserV3(params) {
        var _this = _super.call(this, params) || this;
        _this._dappchainDPOS = params.dappchainDPOS;
        return _this;
    }
    DPOSUserV3.createOfflineUserAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.JsonRpcProvider(params.ethEndpoint);
                wallet = new ethers_1.ethers.Wallet(params.ethereumPrivateKey, provider);
                return [2 /*return*/, DPOSUserV3.createUserAsync(tslib_1.__assign({ wallet: wallet }, params))];
            });
        });
    };
    DPOSUserV3.createMetamaskUserAsync = function (params) {
        var wallet = solidity_helpers_1.getMetamaskSigner(params.web3.currentProvider);
        return DPOSUserV3.createUserAsync(tslib_1.__assign({ wallet: wallet }, params));
    };
    DPOSUserV3.createEthSignMetamaskUserAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var gatewayUser, dappchainEthAddress, dappchainDPOS;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gateway_user_1.GatewayUser.createEthSignMetamaskGatewayUserAsync(params)];
                    case 1:
                        gatewayUser = _a.sent();
                        dappchainEthAddress = new _1.Address('eth', _1.LocalAddress.fromHexString(gatewayUser.ethAddress));
                        return [4 /*yield*/, contracts_1.DPOS3.createAsync(gatewayUser.client, dappchainEthAddress)];
                    case 2:
                        dappchainDPOS = _a.sent();
                        log('Connected to dappchain DPOS Contract');
                        return [2 /*return*/, new DPOSUserV3({
                                wallet: gatewayUser.wallet,
                                client: gatewayUser.client,
                                loomAddress: gatewayUser.loomAddress,
                                ethAddress: gatewayUser.ethAddress,
                                gateway: gatewayUser.ethereumGateway,
                                loomToken: gatewayUser.ethereumLoom,
                                vmc: gatewayUser.ethereumVMC,
                                dappchainGateway: gatewayUser.dappchainGateway,
                                dappchainLoom: gatewayUser.dappchainLoom,
                                dappchainDPOS: dappchainDPOS,
                                version: params.version
                            })];
                }
            });
        });
    };
    DPOSUserV3.createUserAsync = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var gatewayUser, dappchainEthAddress, dappchainDPOS;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gateway_user_1.GatewayUser.createGatewayUserAsync(params)];
                    case 1:
                        gatewayUser = _a.sent();
                        dappchainEthAddress = new _1.Address('eth', _1.LocalAddress.fromHexString(gatewayUser.ethAddress));
                        return [4 /*yield*/, contracts_1.DPOS3.createAsync(gatewayUser.client, dappchainEthAddress)];
                    case 2:
                        dappchainDPOS = _a.sent();
                        log('Connected to dappchain DPOS Contract');
                        return [2 /*return*/, new DPOSUserV3({
                                wallet: gatewayUser.wallet,
                                client: gatewayUser.client,
                                loomAddress: gatewayUser.loomAddress,
                                ethAddress: gatewayUser.ethAddress,
                                gateway: gatewayUser.ethereumGateway,
                                loomToken: gatewayUser.ethereumLoom,
                                vmc: gatewayUser.ethereumVMC,
                                dappchainGateway: gatewayUser.dappchainGateway,
                                dappchainLoom: gatewayUser.dappchainLoom,
                                addressMapper: gatewayUser.addressMapper,
                                dappchainDPOS: dappchainDPOS,
                                version: params.version
                            })];
                }
            });
        });
    };
    Object.defineProperty(DPOSUserV3.prototype, "dappchainDPOS", {
        get: function () {
            return this._dappchainDPOS;
        },
        enumerable: true,
        configurable: true
    });
    DPOSUserV3.prototype.listValidatorsAsync = function () {
        return this._dappchainDPOS.getValidatorsAsync();
    };
    DPOSUserV3.prototype.listCandidatesAsync = function () {
        return this._dappchainDPOS.getCandidatesAsync();
    };
    DPOSUserV3.prototype.listAllDelegationsAsync = function () {
        return this._dappchainDPOS.getAllDelegations();
    };
    DPOSUserV3.prototype.listDelegationsAsync = function (candidate) {
        var address = this.prefixAddress(candidate);
        return this._dappchainDPOS.getDelegations(address);
    };
    DPOSUserV3.prototype.checkAllDelegationsAsync = function (delegator) {
        var address = delegator ? this.prefixAddress(delegator) : this.loomAddress;
        return this._dappchainDPOS.checkAllDelegationsAsync(address);
    };
    DPOSUserV3.prototype.getTimeUntilElectionsAsync = function () {
        return this._dappchainDPOS.getTimeUntilElectionAsync();
    };
    /**
     * Delegates an amount of LOOM tokens to a candidate/validator
     *
     * @param candidate The candidate's hex address
     * @param amount The amount delegated
     */
    DPOSUserV3.prototype.delegateAsync = function (candidate, amount, tier, referrer) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var address;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = this.prefixAddress(candidate);
                        return [4 /*yield*/, this.dappchainLoom.approveAsync(this._dappchainDPOS.address, amount)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this._dappchainDPOS.delegateAsync(address, amount, tier, referrer)];
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
    DPOSUserV3.prototype.redelegateAsync = function (formerValidator, validator, amount, index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var validatorAddress, formerValidatorAddress;
            return tslib_1.__generator(this, function (_a) {
                validatorAddress = this.prefixAddress(validator);
                formerValidatorAddress = this.prefixAddress(formerValidator);
                return [2 /*return*/, this._dappchainDPOS.redelegateAsync(formerValidatorAddress, validatorAddress, amount, index)];
            });
        });
    };
    /**
     * Undelegates an amount of LOOM tokens from a candidate/validator
     *
     * @param candidate The candidate's hex address
     * @param amount The amount to undelegate
     */
    DPOSUserV3.prototype.undelegateAsync = function (candidate, amount, index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var address;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = this.prefixAddress(candidate);
                        return [4 /*yield*/, this._dappchainDPOS.unbondAsync(address, amount, index)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the stake a delegator has delegated to a candidate/validator
     *
     * @param validator The validator's hex address
     * @param delegator The delegator's hex address
     */
    DPOSUserV3.prototype.checkDelegationsAsync = function (validator, delegator) {
        var validatorAddress = this.prefixAddress(validator);
        var delegatorAddress = delegator ? this.prefixAddress(delegator) : this.loomAddress;
        return this._dappchainDPOS.checkDelegationAsync(validatorAddress, delegatorAddress);
    };
    // Iterates over all the delegator's reward delegations and unbonds the ones it can unbond
    DPOSUserV3.prototype.claimRewardsAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var delegations, total, _i, _a, d;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._dappchainDPOS.checkAllDelegationsAsync(this.loomAddress)];
                    case 1:
                        delegations = _b.sent();
                        total = new bn_js_1.default(0);
                        _i = 0, _a = delegations.delegationsArray;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        d = _a[_i];
                        if (!(d.index === 0 && d.state == dposv3_pb_1.DelegationState.BONDED)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.dappchainDPOS.unbondAsync(d.validator, 0, 0)];
                    case 3:
                        _b.sent();
                        total = total.add(d.amount);
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, total];
                }
            });
        });
    };
    // Iterates over all delegator delegations and returns 1 amount
    DPOSUserV3.prototype.checkRewardsAsync = function (owner) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var address, delegations, total, _i, _a, d;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        address = owner ? this.prefixAddress(owner) : this.loomAddress;
                        return [4 /*yield*/, this._dappchainDPOS.checkAllDelegationsAsync(address)
                            // get the 0th of each
                        ];
                    case 1:
                        delegations = _b.sent();
                        total = new bn_js_1.default(0);
                        for (_i = 0, _a = delegations.delegationsArray; _i < _a.length; _i++) {
                            d = _a[_i];
                            // if it's the rewards delegation and it's already bonded
                            if (d.index === 0 && d.state == dposv3_pb_1.DelegationState.BONDED) {
                                total = total.add(d.amount);
                            }
                        }
                        return [2 /*return*/, total];
                }
            });
        });
    };
    return DPOSUserV3;
}(gateway_user_1.GatewayUser));
exports.DPOSUserV3 = DPOSUserV3;
//# sourceMappingURL=dpos-user-v3.js.map