"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var contract_1 = require("../contract");
var address_1 = require("../address");
var user_deployer_whitelist_pb_1 = require("../proto/user_deployer_whitelist_pb");
var big_uint_1 = require("../big-uint");
/**
 * Provides self-service deployer account management for users that wish to deploy EVM contracts
 * to the DAppChain.
 */
var UserDeployerWhitelist = /** @class */ (function (_super) {
    tslib_1.__extends(UserDeployerWhitelist, _super);
    function UserDeployerWhitelist(params) {
        return _super.call(this, params) || this;
    }
    UserDeployerWhitelist.createAsync = function (client, callerAddr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contractAddr;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.getContractAddressAsync('user-deployer-whitelist')];
                    case 1:
                        contractAddr = _a.sent();
                        if (!contractAddr) {
                            throw Error('Failed to resolve contract address');
                        }
                        return [2 /*return*/, new UserDeployerWhitelist({ contractAddr: contractAddr, callerAddr: callerAddr, client: client })];
                }
            });
        });
    };
    /**
     * Authorizes an account to deploy EVM contracts on behalf of the caller. In order to authorize
     * an account the caller must approve the contract to withdraw the fee for whitelisting
     * (charged in LOOM coin) before calling this method, the fee will be deducted from the caller if
     * the requested account is successfuly authorized.
     *
     * @param deployer Deployer account address.
     * @param tierId
     */
    UserDeployerWhitelist.prototype.addDeployerAsync = function (deployer, tierId) {
        var req = new user_deployer_whitelist_pb_1.WhitelistUserDeployerRequest();
        req.setDeployerAddr(deployer.MarshalPB());
        req.setTierId(tierId ? tierId : user_deployer_whitelist_pb_1.TierID.DEFAULT);
        return this.callAsync('AddUserDeployer', req);
    };
    /**
     * Removes whitelisted deployer
     * @param deployer Deployer account address.
     */
    UserDeployerWhitelist.prototype.removeDeployerAsync = function (deployer) {
        var req = new user_deployer_whitelist_pb_1.RemoveUserDeployerRequest();
        req.setDeployerAddr(deployer.MarshalPB());
        return this.callAsync('RemoveUserDeployer', req);
    };
    /**
     * @param user User account address.
     * @returns List of accounts authorized to deploy EVM contracts on behalf of the specified user.
     */
    UserDeployerWhitelist.prototype.getDeployersAsync = function (user) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var req, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = new user_deployer_whitelist_pb_1.GetUserDeployersRequest();
                        req.setUserAddr(user.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('GetUserDeployers', req, new user_deployer_whitelist_pb_1.GetUserDeployersResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getDeployersList().map(function (userDeployerState) { return ({
                                address: address_1.Address.UnmarshalPB(userDeployerState.getAddress()),
                                contracts: userDeployerState.getContractsList().map(function (deployerContract) { return ({
                                    address: address_1.Address.UnmarshalPB(deployerContract.getContractAddress())
                                }); }),
                                tierId: userDeployerState.getTierId(),
                                inactive: userDeployerState.getInactive()
                            }); })];
                }
            });
        });
    };
    /**
     * @param deployer Deployer account address.
     * @returns Array of EVM contracts deployed by a particular deployer account.
     */
    UserDeployerWhitelist.prototype.getDeployedContractsAsync = function (deployer) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var req, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = new user_deployer_whitelist_pb_1.GetDeployedContractsRequest();
                        req.setDeployerAddr(deployer.MarshalPB());
                        return [4 /*yield*/, this.staticCallAsync('GetDeployedContracts', req, new user_deployer_whitelist_pb_1.GetDeployedContractsResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.getContractAddressesList().map(function (deployerContract) { return ({
                                address: address_1.Address.UnmarshalPB(deployerContract.getContractAddress())
                            }); })];
                }
            });
        });
    };
    /**
     * @param tierId ID of tier.
     * @returns Tier details.
     */
    UserDeployerWhitelist.prototype.getTierInfoAsync = function (tierId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var req, result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = new user_deployer_whitelist_pb_1.GetTierInfoRequest();
                        req.setId(tierId);
                        return [4 /*yield*/, this.staticCallAsync('GetTierInfo', req, new user_deployer_whitelist_pb_1.GetTierInfoResponse())];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                tierId: result.getTier().getTierId(),
                                fee: big_uint_1.unmarshalBigUIntPB(result.getTier().getFee()),
                                name: result.getTier().getName()
                            }];
                }
            });
        });
    };
    /**
     * Set tier details, can only be called by the UserDeployerWhitelist contract owner.
     *
     * @param tier Tier details.
     */
    UserDeployerWhitelist.prototype.setTierInfoAsync = function (tier) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var req;
            return tslib_1.__generator(this, function (_a) {
                req = new user_deployer_whitelist_pb_1.SetTierInfoRequest();
                if (tier.fee.cmp(new bn_js_1.default(0)) <= 0) {
                    throw Error('fee must be greater than zero');
                }
                req.setFee(big_uint_1.marshalBigUIntPB(tier.fee));
                req.setId(tier.tierId);
                req.setName(tier.name);
                return [2 /*return*/, this.callAsync('SetTierInfo', req)];
            });
        });
    };
    return UserDeployerWhitelist;
}(contract_1.Contract));
exports.UserDeployerWhitelist = UserDeployerWhitelist;
//# sourceMappingURL=user-deployer-whitelist.js.map