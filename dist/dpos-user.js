"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var debug_1 = tslib_1.__importDefault(require("debug"));
var ethers_1 = require("ethers");
var _1 = require(".");
var contracts_1 = require("./contracts");
var helpers_1 = require("./helpers");
var log = debug_1.default('dpos-user');
var coinMultiplier = new bn_js_1.default(10).pow(new bn_js_1.default(18));
var V2_GATEWAYS = ['oracle-dev', 'asia1'];
var ERC20ABI = require('./mainnet-contracts/ERC20.json');
var ERC20GatewayABI = require('./mainnet-contracts/ERC20Gateway.json');
var ERC20GatewayABI_v2 = require('./mainnet-contracts/ERC20Gateway_v2.json');
var DPOSUser = /** @class */ (function () {
    function DPOSUser(wallet, client, address, ethAddress, gatewayAddress, loomAddress, dappchainGateway, dappchainLoom, dappchainDPOS, dappchainMapper, version) {
        if (version === void 0) { version = 1; }
        this._version = version;
        this._wallet = wallet;
        this._address = address;
        this._ethAddress = ethAddress;
        this._client = client;
        var gatewayABI = version == 2 ? ERC20GatewayABI_v2 : ERC20GatewayABI;
        // @ts-ignore
        this._ethereumGateway = new ethers_1.ethers.Contract(gatewayAddress, gatewayABI, wallet);
        // @ts-ignore
        this._ethereumLoom = new ethers_1.ethers.Contract(loomAddress, ERC20ABI, wallet);
        this._dappchainGateway = dappchainGateway;
        this._dappchainLoom = dappchainLoom;
        this._dappchainDPOS = dappchainDPOS;
        this._dappchainMapper = dappchainMapper;
    }
    DPOSUser.createOfflineUserAsync = function (endpoint, privateKey, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress, version) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.JsonRpcProvider(endpoint);
                wallet = new ethers_1.ethers.Wallet(privateKey, provider);
                return [2 /*return*/, DPOSUser.createUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress, version)];
            });
        });
    };
    DPOSUser.createMetamaskUserAsync = function (web3, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress, version) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.Web3Provider(web3.currentProvider);
                wallet = provider.getSigner();
                return [2 /*return*/, DPOSUser.createUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress, version)];
            });
        });
    };
    DPOSUser.createUserAsync = function (wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress, version) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var chainName, _i, V2_GATEWAYS_1, chainPrefix, _a, client, address, ethAddress, dappchainLoom, dappchainGateway, dappchainMapper, dappchainDPOS;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // If no gateway version is provided, pick based on the chain URL prefix
                        if (version === undefined) {
                            chainName = dappchainEndpoint.split('.')[0];
                            for (_i = 0, V2_GATEWAYS_1 = V2_GATEWAYS; _i < V2_GATEWAYS_1.length; _i++) {
                                chainPrefix = V2_GATEWAYS_1[_i];
                                if (chainName.indexOf(chainPrefix) != -1) {
                                    version = 2;
                                }
                            }
                        }
                        _a = helpers_1.createDefaultClient(dappchainKey, dappchainEndpoint, chainId), client = _a.client, address = _a.address;
                        return [4 /*yield*/, wallet.getAddress()];
                    case 1:
                        ethAddress = _b.sent();
                        return [4 /*yield*/, contracts_1.Coin.createAsync(client, address)];
                    case 2:
                        dappchainLoom = _b.sent();
                        log('Connected to dappchain Loom Token');
                        return [4 /*yield*/, contracts_1.LoomCoinTransferGateway.createAsync(client, address)];
                    case 3:
                        dappchainGateway = _b.sent();
                        log('Connected to dappchain Gateway Contract');
                        return [4 /*yield*/, contracts_1.AddressMapper.createAsync(client, address)];
                    case 4:
                        dappchainMapper = _b.sent();
                        log('Connected to dappchain Address Mapoper contract');
                        return [4 /*yield*/, contracts_1.DPOS2.createAsync(client, address)];
                    case 5:
                        dappchainDPOS = _b.sent();
                        log('Connected to dappchain DPOS Contract');
                        return [2 /*return*/, new DPOSUser(wallet, client, address, ethAddress, gatewayAddress, loomAddress, dappchainGateway, dappchainLoom, dappchainDPOS, dappchainMapper, version)];
                }
            });
        });
    };
    Object.defineProperty(DPOSUser.prototype, "ethereumGateway", {
        get: function () {
            return this._ethereumGateway;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DPOSUser.prototype, "ethereumLoom", {
        get: function () {
            return this._ethereumLoom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DPOSUser.prototype, "dappchainLoom", {
        get: function () {
            return this._dappchainLoom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DPOSUser.prototype, "dappchainGateway", {
        get: function () {
            return this._dappchainGateway;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DPOSUser.prototype, "dappchainDPOS", {
        get: function () {
            return this._dappchainDPOS;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DPOSUser.prototype, "addressMapper", {
        get: function () {
            return this._dappchainMapper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DPOSUser.prototype, "ethAddress", {
        get: function () {
            return this._ethAddress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DPOSUser.prototype, "loomAddress", {
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
    DPOSUser.prototype.mapAccountsAsync = function () {
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
        var address = delegator ? this.prefixAddress(delegator) : this._address;
        return this._dappchainDPOS.checkDelegatorDelegations(address);
    };
    DPOSUser.prototype.getTimeUntilElectionsAsync = function () {
        return this._dappchainDPOS.getTimeUntilElectionAsync();
    };
    /**
     * Deposits funds from mainnet to the gateway
     */
    DPOSUser.prototype.depositAsync = function (amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentApproval, _a, _b, currentApprovalBN, tx;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = this._ethereumLoom.functions).allowance;
                        return [4 /*yield*/, this._wallet.getAddress()];
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
    DPOSUser.prototype.withdrawAsync = function (amount) {
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
    DPOSUser.prototype.resumeWithdrawalAsync = function () {
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
                        log('Got receipt:', receipt);
                        signature = _1.CryptoUtils.bytesToHexAddr(receipt.oracleSignature);
                        amount = receipt.tokenAmount;
                        return [2 /*return*/, this.withdrawCoinFromRinkebyGatewayAsync(amount, signature)];
                }
            });
        });
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
                        return [4 /*yield*/, this._dappchainLoom.approveAsync(this._dappchainDPOS.address, amount)];
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
        var address = withdrawalAddress ? this.prefixAddress(withdrawalAddress) : this._address;
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
        var delegatorAddress = delegator ? this.prefixAddress(delegator) : this._address;
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
                delegatorAddress = delegator ? this.prefixAddress(delegator) : this._address;
                return [2 /*return*/, this._dappchainDPOS.totalDelegationAsync(delegatorAddress)];
            });
        });
    };
    DPOSUser.prototype.getPendingWithdrawalReceiptAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._dappchainGateway.withdrawalReceiptAsync(this._address)];
            });
        });
    };
    DPOSUser.prototype.checkRewardsAsync = function () {
        return this._dappchainDPOS.checkDistributionAsync();
    };
    /**
     * Retrieves the  DAppChain LoomCoin balance of a user
     * @param address The address to check the balance of. If not provided, it will check the user's balance
     */
    DPOSUser.prototype.getDAppChainBalanceAsync = function (address) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var addr, balance;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if no address is provided, return our balance
                        if (address === undefined) {
                            return [2 /*return*/, this._dappchainLoom.getBalanceOfAsync(this._address)];
                        }
                        addr = this.prefixAddress(address);
                        return [4 /*yield*/, this._dappchainLoom.getBalanceOfAsync(addr)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, balance];
                }
            });
        });
    };
    DPOSUser.prototype.disconnect = function () {
        this._client.disconnect();
    };
    /**
     * Deposits an amount of LOOM tokens to the dappchain gateway and return a signature which can be used to withdraw the same amount from the mainnet gateway.
     *
     * @param amount The amount that will be deposited to the DAppChain Gateway (and will be possible to withdraw from the mainnet)
     */
    DPOSUser.prototype.depositCoinToDAppChainGatewayAsync = function (amount) {
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
                        return [4 /*yield*/, this._wallet.getAddress()];
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
                        log('Got receipt', pendingReceipt);
                        return [2 /*return*/, _1.CryptoUtils.bytesToHexAddr(signature)];
                }
            });
        });
    };
    DPOSUser.prototype.withdrawCoinFromRinkebyGatewayAsync = function (amount, sig) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var hash, sign, signer, valIndexes;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createWithdrawalHash(amount)];
                    case 1:
                        hash = _a.sent();
                        log('Receipt hash:', hash);
                        if (this._version === 2) {
                            // Ugly hack to extract the 'mode' bit from the old signature format - if it's still used (68 = 66 + 2, where 2 is the 0x)
                            sig = sig.length === 134 ? '0x' + sig.slice(4) : sig;
                            sign = ethers_1.ethers.utils.splitSignature(sig);
                            signer = ethers_1.ethers.utils.recoverAddress(ethers_1.ethers.utils.arrayify(ethers_1.ethers.utils.hashMessage(ethers_1.ethers.utils.arrayify(hash))), sign);
                            log('Receipt was signed by:', signer);
                            valIndexes = [0];
                            return [2 /*return*/, this._ethereumGateway.functions.withdrawERC20(amount.toString(), this._ethereumLoom.address, valIndexes, [sign.v], [sign.r], [sign.s])];
                        }
                        // @ts-ignore
                        return [2 /*return*/, this._ethereumGateway.functions.withdrawERC20(amount.toString(), sig, this._ethereumLoom.address)];
                }
            });
        });
    };
    DPOSUser.prototype.createWithdrawalHash = function (amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nonce, amountHashed, msg;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ethereumGateway.functions.nonces(this.ethAddress)];
                    case 1:
                        nonce = _a.sent();
                        amountHashed = ethers_1.ethers.utils.solidityKeccak256(['uint256', 'address'], [amount.toString(), this.ethereumLoom.address]);
                        msg = ethers_1.ethers.utils.solidityKeccak256(['address', 'uint256', 'address', 'bytes32'], [this.ethAddress, nonce, this.ethereumGateway.address, amountHashed]);
                        return [2 /*return*/, msg];
                }
            });
        });
    };
    /**
     * Helper function to prefix an address with the chainId to get chainId:address format
     */
    DPOSUser.prototype.prefixAddress = function (address) {
        return _1.Address.fromString(this._client.chainId + ":" + address);
    };
    return DPOSUser;
}());
exports.DPOSUser = DPOSUser;
//# sourceMappingURL=dpos-user.js.map