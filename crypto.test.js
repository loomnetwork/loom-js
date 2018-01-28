import test from 'tape';
import { pubKeyFromPrivKey, pubKeyAddress } from './crypto';

// https://gist.github.com/tauzen/3d18825ae41ff3fc8981
function bytesToHex(uint8arr) {
    if (!uint8arr) {
      return '';
    }
    
    var hexStr = '';
    for (var i = 0; i < uint8arr.length; i++) {
      var hex = (uint8arr[i] & 0xff).toString(16);
      hex = (hex.length === 1) ? '0' + hex : hex;
      hexStr += hex;
    }
    
    return hexStr.toUpperCase();
  }

function hexToBytes(str) {
    if (!str) {
      return new Uint8Array();
    }
    
    var a = [];
    for (var i = 0, len = str.length; i < len; i+=2) {
      a.push(parseInt(str.substr(i, 2), 16));
    }
    
    return new Uint8Array(a);
}

const privKey = hexToBytes(
    '803C882EDE831304913A7901C821346326F1E9D8E15D46B9066A8BB06C010441F6AFB046CABDF16F71EEF69012626C449C18559F3CB746711BD93DA128922626',
);

test('public key address', (assert) => {
    const keyPair = pubKeyFromPrivKey(privKey);
    assert.deepEquals(
        pubKeyAddress(keyPair.publicKey),
        hexToBytes('5178ECAC96511121530C3F6C323A9CA1677CD012'),
    );

    assert.end();
})
