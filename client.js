import { Client as RPCClient } from 'rpc-websockets';
import { Writer, writeObject } from './wire';
import { hexToBytes } from './util';

function encodeBytes(bytes) {
  return bytes.toString('base64');
}

export default class Client {
  constructor(nodeUrl, proxyUrl) {
    this.nodeUrl = nodeUrl;
    this.proxyUrl = proxyUrl;
    this.rpcId = 0;
    this.openPromise = null;
    this.rpcClient = new RPCClient(nodeUrl, {
      autoconnect: true,
      reconnect: true,
      reconnect_interval: 1000,
      max_reconnects: 5,
    }, this._nextRequestId.bind(this));
  }

  _nextRequestId() {
    return (++this.rpcId).toString();
  }

  broadcastTxAsync(tx) {
    return this._broadcastTx('async', tx);
  }

  broadcastTxSync(tx) {
    return this._broadcastTx('sync', tx);
  }

  broadcastTxCommit(tx) {
    return this._broadcastTx('commit', tx);
  }

  _connect() {
    const rpc = this.rpcClient;
    if (rpc.ready) {
      return Promise.resolve();
    }
    if (!this.openPromise) {
      this.openPromise = new Promise((resolve, reject) => {
        rpc.on('open', () => {
          resolve();
        });
      });
    }
    return this.openPromise;
  }

  async _call() {
    await this._connect();
    const rpc = this.rpcClient;
    return await rpc.call.apply(rpc, arguments);
  }

  _broadcastTx(asyncMode, tx) {
    console.log(tx);
    const method = 'broadcast_tx_' + asyncMode;
    const writer = new Writer();
    const bytes = writeObject(writer, tx).getBuffer();
    console.log(bytes.toString('hex'));
    return this._call(method, [encodeBytes(bytes)]);
  }

  async nonce(addr) {
    const hexAddr = addr.toString('hex');
    const res = await this._proxyReq(`/query/nonce/${hexAddr}`);
    return res.data;
  }

  async state(key) {
    const encKey = encodeURIComponent(encodeBytes(key));
    const resp = await this._proxyReq(`/state/${encKey}`);
    const error = resp.error;
    if (error && error.startsWith('empty data for key')) {
      return undefined;
    }
    return hexToBytes(resp.data);
  }

  async _proxyReq(path) {
    const url = `${this.proxyUrl}${path}`;
    const resp = await fetch(url);
    return await resp.json();
  }

}
