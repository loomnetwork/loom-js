import test from 'tape';
import Actor from './actor';
import { pubKeyFromPrivKey, pubKeyAddress, sign } from './signature';
import { registerType, Writer, writeObject } from './wire';
import { privKey } from './signature.test';
import { OneSigTx, Signed } from './modules/auth';
import { hexToBytes } from './util';

function signTx(privKey, tx) {
  const writer = new Writer();
  writeObject(writer, tx);

  const sig = sign(new Uint8Array(writer.getBuffer()), privKey);
  const pubKey = pubKeyFromPrivKey(privKey);
  return new OneSigTx(tx, new Signed(sig, pubKey));
}

test('full integration test', (assert) => {
  class CreateAccountTx {
    constructor(owner, username) {
        this.owner = owner;
        this.username = username;
    }
  }
  registerType(CreateAccountTx, ['inner', 'owner', 'username'], 0x40);

  const pubKey = pubKeyFromPrivKey(privKey);
  const owner = new Actor(pubKeyAddress(pubKey));
  const tx = new CreateAccountTx(owner, 'foo');
  const signedTx = signTx(privKey, tx);

  const writer = new Writer();
  writeObject(writer, signedTx);
  const bytes = new Uint8Array(writer.getBuffer());
  assert.deepEquals(
    bytes,
    hexToBytes('1640000001047369677301145178ECAC96511121530C3F6C323A9CA1677CD0120103666F6F0148BE58722B9544243B01E2E81B8B1AC54E85AC45EAD112E83CA9B19EE4EF95E71DEAF2948A597FC4695DF5E82D3CB23C128D25A48FF6580048C081DF8179850301F6AFB046CABDF16F71EEF69012626C449C18559F3CB746711BD93DA128922626'),
  );
  assert.end();
})
