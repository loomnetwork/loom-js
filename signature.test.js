import test from 'tape';
import { hexToBytes } from './util';
import { pubKeyFromPrivKey, pubKeyAddress } from './signature';

// Private key fixture
export const privKey = hexToBytes(
  '803C882EDE831304913A7901C821346326F1E9D8E15D46B9066A8BB06C010441F6AFB046CABDF16F71EEF69012626C449C18559F3CB746711BD93DA128922626',
);

test('public key address', (assert) => {
    const pubKey = pubKeyFromPrivKey(privKey);
    assert.deepEquals(
        pubKeyAddress(pubKey),
        hexToBytes('5178ECAC96511121530C3F6C323A9CA1677CD012'),
    );

    assert.end();
})
