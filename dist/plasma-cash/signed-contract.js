"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// Converts any contract to a signed contract
var SignedContract = /** @class */ (function () {
    function SignedContract(web3, abi, address, account) {
        var _this = this;
        // Get the function names from the ABI
        this.web3 = web3;
        this.address = address;
        this.account = account;
        var mutable = abi.filter(function (element) { return element.type === 'function' && !element.constant; });
        var nonMutable = abi.filter(function (element) { return element.type === 'function' && element.constant; });
        var mutableFuncNames = mutable.map(function (f) { return f.name; });
        var nonMutableFuncNames = nonMutable.map(function (f) { return f.name; });
        this.contract = new web3.eth.Contract(abi, address);
        // Create a signed function for each
        mutableFuncNames.map(function (func) { return _this.signedFunc(func); });
        nonMutableFuncNames.map(function (func) {
            _this.wrapConstant(func);
        });
    }
    Object.defineProperty(SignedContract.prototype, "instance", {
        get: function () {
            return this.contract;
        },
        enumerable: true,
        configurable: true
    });
    SignedContract.prototype.wrapConstant = function (func) {
        var _this = this;
        var method = this.contract.methods[func];
        var wrappedNonConstant = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, method.apply(void 0, args).call()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // @ts-ignore
        this.contract[func] = wrappedNonConstant;
    };
    // Will sign the tx
    SignedContract.prototype.signedFunc = function (func) {
        var _this = this;
        var method = this.contract.methods[func];
        var wrappedFunction = function (args, value) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var data, to, nonce, tx, _a, gas, e_1, signedTx;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = method.apply(void 0, args).encodeABI();
                        to = this.address;
                        return [4 /*yield*/, this.web3.eth.getTransactionCount(this.account.address)];
                    case 1:
                        nonce = _b.sent();
                        _a = {
                            to: to,
                            data: data
                        };
                        return [4 /*yield*/, this.web3.eth.net.getId()];
                    case 2:
                        tx = (_a.chainId = _b.sent(),
                            _a.nonce = nonce,
                            _a.value = value ? value : 0,
                            _a);
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, method.apply(void 0, args).estimateGas({ from: this.account.address, value: value })];
                    case 4:
                        gas = _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        gas = 300000; // default gas amount
                        return [3 /*break*/, 6];
                    case 6:
                        tx['gas'] = Math.ceil(gas * 1.25); // give some extra gas and round the decimal
                        return [4 /*yield*/, this.web3.eth.accounts.signTransaction(tx, this.account.privateKey)
                            // @ts-ignore
                            // Bug in ts-types
                        ];
                    case 7:
                        signedTx = _b.sent();
                        // @ts-ignore
                        // Bug in ts-types
                        return [2 /*return*/, this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)];
                }
            });
        }); };
        // @ts-ignore
        this.contract[func] = wrappedFunction;
    };
    return SignedContract;
}());
exports.default = SignedContract;
//# sourceMappingURL=signed-contract.js.map