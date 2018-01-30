import test from 'tape';
import { seal, open } from './secretbox';

test('secret box', (assert) => {
    const msg = new Uint8Array([1, 2, 3, 4]);
    const passphrase = 'my password';
    const box = seal(msg, passphrase);
    assert.deepEquals(open(box, passphrase), msg);
    assert.end();
})
