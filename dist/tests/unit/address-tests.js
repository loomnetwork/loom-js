"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tape_1 = tslib_1.__importDefault(require("tape"));
var address_1 = require("../../address");
tape_1.default('Address', function (t) {
    try {
        var chainId = 'default';
        var localAddrStr = '0x005B17864f3adbF53b1384F2E6f2120c6652F779';
        var localAddr = address_1.LocalAddress.fromHexString(localAddrStr);
        var addrStr = 'default:0x005B17864f3adbF53b1384F2E6f2120c6652F779';
        var addr = address_1.Address.fromString(addrStr);
        t.equal(addr.chainId, chainId, 'Address.fromString() returns correct chain ID');
        t.deepEqual(addr.local, localAddr, 'Address.fromString() returns correct bytes');
        t.ok(addr.equals(new address_1.Address(chainId, address_1.LocalAddress.fromHexString(localAddrStr))), 'Address.equals() equality');
        t.notOk(addr.equals(new address_1.Address('other', address_1.LocalAddress.fromHexString(localAddrStr))), 'Address.equals() inequality');
        // TODO: make this a case sensitive comparison
        t.equal(addr.toString(), addrStr.toLowerCase(), 'Address.toString() formats the address correctly');
    }
    catch (err) {
        console.log(err);
    }
    t.end();
});
//# sourceMappingURL=address-tests.js.map