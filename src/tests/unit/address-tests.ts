import test from 'tape'

import { Address, LocalAddress } from '../../address'

test('Address', t => {
  try {
    const chainId = 'default'
    const localAddrStr = '0x005B17864f3adbF53b1384F2E6f2120c6652F779'
    const localAddr = LocalAddress.fromHexString(localAddrStr)
    const addrStr = 'default:0x005B17864f3adbF53b1384F2E6f2120c6652F779'

    const addr = Address.fromString(addrStr)
    t.equal(addr.chainId, chainId, 'Address.fromString() returns correct chain ID')
    t.deepEqual(addr.local, localAddr, 'Address.fromString() returns correct bytes')
    t.ok(
      addr.equals(new Address(chainId, LocalAddress.fromHexString(localAddrStr))),
      'Address.equals() equality'
    )
    t.notOk(
      addr.equals(new Address('other', LocalAddress.fromHexString(localAddrStr))),
      'Address.equals() inequality'
    )
    // TODO: make this a case sensitive comparison
    t.equal(
      addr.toString(),
      addrStr.toLowerCase(),
      'Address.toString() formats the address correctly'
    )
  } catch (err) {
    t.fail(err)
  }
  t.end()
})
