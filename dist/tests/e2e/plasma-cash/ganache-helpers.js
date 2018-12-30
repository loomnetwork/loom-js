"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
/**
 * @returns The time of the last mined block in seconds.
 */
function latestBlockTime(web3) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var block;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.getBlock('latest')];
                case 1:
                    block = _a.sent();
                    return [2 /*return*/, block.timestamp];
            }
        });
    });
}
exports.latestBlockTime = latestBlockTime;
function sendAsync(web3, method, id, params) {
    return new Promise(function (resolve, reject) {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: id
        }, function (error, response) {
            if (error) {
                reject(error);
            }
            else {
                resolve(response.result);
            }
        });
    });
}
function increaseTime(web3, duration) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var id, adj;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = Date.now();
                    return [4 /*yield*/, sendAsync(web3, 'evm_increaseTime', id, [duration])];
                case 1:
                    adj = _a.sent();
                    return [2 /*return*/, sendAsync(web3, 'evm_mine', id + 1)];
            }
        });
    });
}
exports.increaseTime = increaseTime;
/**
 * Beware that due to the need of calling two separate ganache methods and rpc calls overhead
 * it's hard to increase time precisely to a target point so design your test to tolerate
 * small fluctuations from time to time.
 *
 * @param target Time in seconds
 */
function increaseTimeTo(web3, target) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var now, diff;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, latestBlockTime(web3)];
                case 1:
                    now = _a.sent();
                    if (target < now) {
                        throw Error("Cannot increase current time (" + now + ") to a moment in the past (" + target + ")");
                    }
                    diff = target - now;
                    increaseTime(web3, diff);
                    return [2 /*return*/];
            }
        });
    });
}
exports.increaseTimeTo = increaseTimeTo;
/**
 * Retrieves the ETH balance of a particular Ethereum address.
 *
 * @param address Hex-encoded Ethereum address.
 */
function getEthBalanceAtAddress(web3, address) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var balance;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.getBalance(address)];
                case 1:
                    balance = _a.sent();
                    return [2 /*return*/, new bn_js_1.default(balance)];
            }
        });
    });
}
exports.getEthBalanceAtAddress = getEthBalanceAtAddress;
//# sourceMappingURL=ganache-helpers.js.map