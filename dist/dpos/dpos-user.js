"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var __1 = require("..");
var json_rpc_client_1 = require("../internal/json-rpc-client");
var ethers_1 = require("ethers");
var contracts_1 = require("../contracts");
var helpers_1 = require("../helpers");
var rpc_client_factory_1 = require("../rpc-client-factory");
var debug_1 = tslib_1.__importDefault(require("debug"));
var log = debug_1.default('dpos-user');
var coinMultiplier = new bn_js_1.default(10).pow(new bn_js_1.default(18));
var ERC20Gateway = require('./contracts/ERC20Gateway.json');
var ERC20 = require('./contracts/ERC20.json');
var DPOSUser = /** @class */ (function () {
    function DPOSUser(wallet, client, address, ethAddress, gatewayAddress, loomAddress, dappchainGateway, dappchainLoom, dappchainDPOS, dappchainMapper) {
        this._wallet = wallet;
        this._address = address;
        this._ethAddress = ethAddress;
        this._client = client;
        this._ethereumGateway = new ethers_1.ethers.Contract(gatewayAddress, ERC20Gateway, wallet);
        this._ethereumLoom = new ethers_1.ethers.Contract(loomAddress, ERC20, wallet);
        this._dappchainGateway = dappchainGateway;
        this._dappchainLoom = dappchainLoom;
        this._dappchainDPOS = dappchainDPOS;
        this._dappchainMapper = dappchainMapper;
    }
    DPOSUser.createOfflineUserAsync = function (endpoint, privateKey, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.JsonRpcProvider(endpoint);
                wallet = new ethers_1.ethers.Wallet(privateKey, provider);
                return [2 /*return*/, DPOSUser.createUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress)];
            });
        });
    };
    DPOSUser.createMetamaskUserAsync = function (web3, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var provider, wallet;
            return tslib_1.__generator(this, function (_a) {
                provider = new ethers_1.ethers.providers.Web3Provider(web3.currentProvider);
                wallet = provider.getSigner();
                return [2 /*return*/, DPOSUser.createUserAsync(wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress)];
            });
        });
    };
    DPOSUser.createUserAsync = function (wallet, dappchainEndpoint, dappchainKey, chainId, gatewayAddress, loomAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var privateKey, publicKey, protocol, writerSuffix, readerSuffix, writer, reader, client, address, ethAddress, dappchainLoom, dappchainDPOS, dappchainGateway, dappchainMapper;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privateKey = __1.CryptoUtils.B64ToUint8Array(dappchainKey);
                        publicKey = __1.CryptoUtils.publicKeyFromPrivateKey(privateKey);
                        protocol = rpc_client_factory_1.selectProtocol(dappchainEndpoint);
                        writerSuffix = protocol == json_rpc_client_1.JSONRPCProtocol.HTTP ? '/rpc' : '/websocket';
                        readerSuffix = protocol == json_rpc_client_1.JSONRPCProtocol.HTTP ? '/query' : '/queryws';
                        writer = __1.createJSONRPCClient({
                            protocols: [{ url: dappchainEndpoint + writerSuffix }]
                        });
                        reader = __1.createJSONRPCClient({
                            protocols: [{ url: dappchainEndpoint + readerSuffix }]
                        });
                        client = new __1.Client(chainId, writer, reader);
                        log('Initialized', dappchainEndpoint);
                        client.txMiddleware = [
                            new __1.NonceTxMiddleware(publicKey, client),
                            new __1.SignedTxMiddleware(privateKey)
                        ];
                        client.on('error', function (msg) {
                            log('PlasmaChain connection error', msg);
                        });
                        address = new __1.Address(chainId, __1.LocalAddress.fromPublicKey(publicKey));
                        return [4 /*yield*/, wallet.getAddress()];
                    case 1:
                        ethAddress = _a.sent();
                        return [4 /*yield*/, contracts_1.Coin.createAsync(client, address)];
                    case 2:
                        dappchainLoom = _a.sent();
                        return [4 /*yield*/, contracts_1.DPOS2.createAsync(client, address)];
                    case 3:
                        dappchainDPOS = _a.sent();
                        return [4 /*yield*/, contracts_1.LoomCoinTransferGateway.createAsync(client, address)];
                    case 4:
                        dappchainGateway = _a.sent();
                        return [4 /*yield*/, contracts_1.AddressMapper.createAsync(client, address)];
                    case 5:
                        dappchainMapper = _a.sent();
                        return [2 /*return*/, new DPOSUser(wallet, client, address, ethAddress, gatewayAddress, loomAddress, dappchainGateway, dappchainLoom, dappchainDPOS, dappchainMapper)];
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
                        ethereumAddress = __1.Address.fromString("eth:" + walletAddress);
                        return [4 /*yield*/, this._dappchainMapper.hasMappingAsync(this._address)];
                    case 2:
                        if (_a.sent()) {
                            log(this._address.toString() + " is already mapped");
                            return [2 /*return*/];
                        }
                        signer = new __1.EthersSigner(this._wallet);
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._dappchainDPOS.getValidatorsAsync()];
            });
        });
    };
    DPOSUser.prototype.listCandidatesAsync = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._dappchainDPOS.getCandidatesAsync()];
            });
        });
    };
    /**
     * Deposits funds from mainnet to the gateway
     */
    DPOSUser.prototype.depositAsync = function (amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentApproval, _a, _b, tx;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = this._ethereumLoom).allowance;
                        return [4 /*yield*/, this._wallet.getAddress()];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                            this._ethereumGateway.address])];
                    case 2:
                        currentApproval = _c.sent();
                        currentApproval = new bn_js_1.default(currentApproval._hex.split('0x')[1], 16); // ugly way to convert the BN
                        log('Current approval:', currentApproval);
                        if (!amount.gt(currentApproval)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._ethereumLoom.approve(this._ethereumGateway.address, amount.sub(currentApproval).toString())];
                    case 3:
                        tx = _c.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 4:
                        _c.sent();
                        log('Approved an extra', amount.sub(currentApproval));
                        _c.label = 5;
                    case 5: return [2 /*return*/, this._ethereumGateway.depositERC20(amount.toString(), this._ethereumLoom.address)];
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
                        signature = __1.CryptoUtils.bytesToHexAddr(receipt.oracleSignature);
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
    DPOSUser.prototype.delegateAsync = function (candidate, amount) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var address;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = this.prefixAddress(candidate);
                        return [4 /*yield*/, this._dappchainLoom.approveAsync(this._dappchainDPOS.address, amount)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this._dappchainDPOS.delegateAsync(address, amount)];
                }
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var address;
            return tslib_1.__generator(this, function (_a) {
                address = withdrawalAddress ? this.prefixAddress(withdrawalAddress) : this._address;
                return [2 /*return*/, this._dappchainDPOS.claimDistributionAsync(address)];
            });
        });
    };
    /**
     * Returns the stake a delegator has delegated to a candidate/validator
     *
     * @param validator The validator's hex address
     * @param delegator The delegator's hex address
     */
    DPOSUser.prototype.checkDelegationsAsync = function (validator, delegator) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var validatorAddress, delegatorAddress;
            return tslib_1.__generator(this, function (_a) {
                validatorAddress = this.prefixAddress(validator);
                delegatorAddress = delegator ? this.prefixAddress(delegator) : this._address;
                return [2 /*return*/, this._dappchainDPOS.checkDelegationAsync(validatorAddress, delegatorAddress)];
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
    /**
     * Retrieves the  DAppChain LoomCoin balance of a user
     * @param address The address to check the balance of. If not provided, it will check the user's balance
     */
    DPOSUser.prototype.getDAppChainBalanceAsync = function (address) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pubKey, callerAddress, balance;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if no address is provided, return our balance
                        if (address === undefined) {
                            return [2 /*return*/, this._dappchainLoom.getBalanceOfAsync(this._address)];
                        }
                        pubKey = __1.CryptoUtils.B64ToUint8Array(address);
                        callerAddress = new __1.Address(this._client.chainId, __1.LocalAddress.fromPublicKey(pubKey));
                        return [4 /*yield*/, this._dappchainLoom.getBalanceOfAsync(callerAddress)];
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
                        ethereumAddress = __1.Address.fromString("eth:" + ethereumAddressStr);
                        _ethereumLoomCoinAddress = __1.Address.fromString("eth:" + this._ethereumLoom.address);
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
                        return [2 /*return*/, __1.CryptoUtils.bytesToHexAddr(signature)];
                }
            });
        });
    };
    DPOSUser.prototype.withdrawCoinFromRinkebyGatewayAsync = function (amount, sig) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this._ethereumGateway.withdrawERC20(amount.toString(), sig, this._ethereumLoom.address)];
            });
        });
    };
    /**
     * Helper function to prefix an address with the chainId to get chainId:address format
     */
    DPOSUser.prototype.prefixAddress = function (address) {
        return __1.Address.fromString(this._client.chainId + ":" + address);
    };
    return DPOSUser;
}());
exports.DPOSUser = DPOSUser;
//# sourceMappingURL=dpos-user.js.map