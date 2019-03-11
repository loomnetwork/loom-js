"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var events_1 = tslib_1.__importDefault(require("events"));
var client_1 = require("./client");
var loom_pb_1 = require("./proto/loom_pb");
/**
 * The EvmContract class streamlines interaction with a contract that was
 * deployed on a Loom DAppChain EVM.
 * Each instance of this class is bound to a specific contract, and provides a simple way of calling
 * into and querying that contract.
 *
 * A contract instance can be used to listen to events emitted by the corresponding smart contract,
 * there is currently only one type of event. The event subscription API matches the NodeJS
 * EventEmitter API.
 */
var EvmContract = /** @class */ (function (_super) {
    tslib_1.__extends(EvmContract, _super);
    /**
     * @param params Parameters.
     * @param params.contractAddr Address of a contract on the Loom DAppChain EVM.
     * @param params.callerAddr: Address of the caller, generated from the public key of the tx signer,
     *                           e.g. `new Address(client.chainId, LocalAddress.fromPublicKey(pubKey))`
     * @param params.client: Client to use to communicate with the contract.
     */
    function EvmContract(params) {
        var _this = _super.call(this) || this;
        _this._client = params.client;
        _this.address = params.contractAddr;
        _this.caller = params.callerAddr;
        var emitContractEvent = _this._emitContractEvent.bind(_this);
        _this.on('newListener', function (event) {
            if (event === EvmContract.EVENT && _this.listenerCount(event) === 0) {
                _this._client.on(client_1.ClientEvent.Contract, emitContractEvent);
            }
        });
        _this.on('removeListener', function (event) {
            if (event === EvmContract.EVENT && _this.listenerCount(event) === 0) {
                _this._client.removeListener(client_1.ClientEvent.Contract, emitContractEvent);
            }
        });
        return _this;
    }
    /**
     * Calls a contract method that mutates state.
     * The call into the contract is accomplished by committing a tx to the DAppChain.
     * @param args ABI encoded function signature and input paramters.
     * @returns A promise that will be resolved with return value (if any) of the contract method.
     */
    EvmContract.prototype.callAsync = function (args, output) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ui8InData, callTx, msgTx, tx;
            return tslib_1.__generator(this, function (_a) {
                ui8InData = Uint8Array.from(args);
                callTx = new loom_pb_1.CallTx();
                callTx.setVmType(loom_pb_1.VMType.EVM);
                callTx.setInput(ui8InData);
                msgTx = new loom_pb_1.MessageTx();
                msgTx.setFrom(this.caller.MarshalPB());
                msgTx.setTo(this.address.MarshalPB());
                msgTx.setData(callTx.serializeBinary());
                tx = new loom_pb_1.Transaction();
                tx.setId(2);
                tx.setData(msgTx.serializeBinary());
                return [2 /*return*/, this._client.commitTxAsync(tx)];
            });
        });
    };
    /**
     * Calls a method of a contract running on an EVM that doesn't mutate state.
     * This method is usually used to query the current contract state, it doesn't commit any txs.
     * @param args ABI encoded function signature and input paramters.
     * @returns A promise that will be resolved with the return value of the contract method.
     */
    EvmContract.prototype.staticCallAsync = function (args, output) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ui8InData;
            return tslib_1.__generator(this, function (_a) {
                ui8InData = Uint8Array.from(args);
                return [2 /*return*/, this._client.queryAsync(this.address, ui8InData, loom_pb_1.VMType.EVM, this.caller)];
            });
        });
    };
    EvmContract.prototype._emitContractEvent = function (event) {
        if (event.contractAddress.equals(this.address)) {
            this.emit(EvmContract.EVENT, event);
        }
    };
    EvmContract.EVENT = 'event';
    return EvmContract;
}(events_1.default));
exports.EvmContract = EvmContract;
//# sourceMappingURL=evm-contract.js.map