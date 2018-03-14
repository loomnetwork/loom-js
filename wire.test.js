import test from 'tape';

import {
  TypeString,
  TypeVarArray,
  TypeByte,
  TypeStruct,
  Reader,
  Writer,
  readObject,
  writeObject,
  registerType,
 } from './wire';

export default class Actor {
  constructor(address, app = 'sigs', chainId = '') {
    this.chainId = chainId;
    this.app = app;
    this.address = address;
  }
}

test('encode and decode wire', (assert) => {
  registerType(Actor, [
    ['chainId', TypeString],
    ['app', TypeString],
    ['address', TypeVarArray(TypeByte)],
  ], 0x01);

  const actor = new Actor(new Buffer([1, 2, 3]), 'foo', 'bar');

  const w = new Writer();
  writeObject(w, actor);

  const r = new Reader(w.getBuffer());
  const obj = readObject(r, Actor)

  assert.deepEqual(actor, obj);
  assert.end();
})
