"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bn_js_1 = tslib_1.__importDefault(require("bn.js"));
var plasma_cash_tx_1 = require("./plasma-cash-tx");
var PlasmaCashBlock = /** @class */ (function () {
    function PlasmaCashBlock(params) {
        var txs = params.txs, merkleHash = params.merkleHash;
        this._txs = txs;
        this.merkleHash = merkleHash;
    }
    Object.defineProperty(PlasmaCashBlock.prototype, "txs", {
        get: function () {
            return this._txs;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Finds a tx referencing the given slot.
     * @param slot 64-bit uint identifier of a UTXO.
     */
    PlasmaCashBlock.prototype.findTxWithSlot = function (slot) {
        for (var i = 0; i < this._txs.length; i++) {
            if (this._txs[i].slot.cmp(slot) === 0) {
                return this._txs[i];
            }
        }
        return new plasma_cash_tx_1.PlasmaCashTx({
            slot: new bn_js_1.default(0),
            prevBlockNum: new bn_js_1.default(0),
            denomination: new bn_js_1.default(0),
            newOwner: '0x0'
        });
    };
    return PlasmaCashBlock;
}());
exports.PlasmaCashBlock = PlasmaCashBlock;
function unmarshalPlasmaBlockPB(block) {
    var txs = block.getTransactionsList().map(function (tx) { return plasma_cash_tx_1.unmarshalPlasmaTxPB(tx); });
    // TODO: verify the merkle root
    return new PlasmaCashBlock({ txs: txs, merkleHash: block.getMerkleHash_asU8() });
}
exports.unmarshalPlasmaBlockPB = unmarshalPlasmaBlockPB;
//# sourceMappingURL=plasma-cash-block.js.map