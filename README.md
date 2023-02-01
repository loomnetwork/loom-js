# [Loom.js](https://loomx.io) ![Build Status](https://github.com/github/docs/actions/workflows/main.yml/badge.svg?branch=master)

JS library for building browser apps & NodeJS services that interact with Loom DAppChains.

## Install

### NodeJS

```
# NPM
npm install loom-js
# Yarn
yarn add loom-js
```

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/loom-js@1.15.0/dist/loom.umd.js"></script>
```

## Debugging

`loom-js` uses the [`debug`](https://github.com/visionmedia/debug) package for logging.
- To inspect the logs when running in the browser set `localStorage.debug = '*'`
- To inspect the logs when running in NodeJS set the `DEBUG` env var to `*`

See docs for `debug` package if you wish to filter the log messages.

## Development

```shell
# build for Node
yarn build
# build for Browser
yarn build:browser
# build for Node while targeting ES2017 (more readable than ES5)
yarn build:dev
# run unit tests on Node & Browser
yarn test
# auto-format source files
yarn format
# run unit tests in Node
yarn test:node
# run unit tests in Electon
yarn test:browser
# run e2e test in Node (local DAppChain node must be running first)
yarn e2e:node
# run e2e test in Electron (local DAppChain node must be running first)
yarn e2e:browser
```

The e2e test environment can be configured by changing `.env.test` (see `.env.test.example` for
default values).

### Debugging

To debug loom-js while using it another project:
1. Clone the Git repo from https://github.com/loomnetwork/loom-js
2. Inside the loom-js repo run:
   ```bash
   yarn link
   yarn build:dev
   ```
3. In your project repo run `yarn link loom-js`.
4. Debug your project normally.

`yarn build:dev` will compile the TypeScript source to target ES2017, which requires a lot less
transformation of async/await constructs than the ES5 code released on NPM.

### Regenerating Protobufs

Whenever you change `src/proto/loom.proto`, or `src/tests/tests.proto` you will need to regenerate
the corresponding `*_pb.js` by running:

```shell
yarn proto
```

The shell must be able to locate the `protoc` binary, which can be obtained from https://github.com/google/protobuf/releases

### Custom Middlewares

LoomProvider takes a custom function that lets you customize what middlewares it runs. For example, we have an experimental nonce caching middleware that has more advanced nonce tracking. You can add it as such:

```js
const setupMiddlewareFn = function(client, privateKey) {
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
  return [new CachedNonceTxMiddleware(publicKey, client), new SignedTxMiddleware(privateKey)]
}

const loomProviderObj = new LoomProvider(client, privateKey, setupMiddlewareFn)
```

More examples here: https://github.com/loomnetwork/loom-js/blob/master/src/tests/e2e/loom-provider-web3-middlewares-tests.ts

### JSON RPC supported calls

LoomProvider combined with Web3 supports the following `JSON RPC` calls

#### Current implemented

- [x] eth_accounts
- [x] eth_blockNumber
- [x] eth_call
- [x] eth_gasPrice
- [x] eth_getBlockByHash
- [x] eth_getBlockByNumber
- [x] eth_getCode
- [x] eth_getFilterChanges
- [x] eth_getLogs
- [x] eth_getTransactionByHash
- [x] eth_getTransactionReceipt
- [x] eth_newBlockFilter
- [x] eth_newFilter
- [x] eth_newPendingTransactionFilter
- [x] eth_sendTransaction
- [x] eth_subscribe
- [x] eth_uninstallFilter
- [x] eth_unsubscribe
- [x] net_version

#### Should

- [ ] eth_getFilterLogs (Returns an array of all logs matching filter with given id)
- [ ] eth_estimateGas (Currently, it always returns zero)

#### Maybe

- [ ] net_peerCount (Returns the current ethereum protocol version)
- [ ] eth_syncing (Returns an object with data about the sync status or false)
- [ ] eth_coinbase (Returns the client coinbase address)
- [ ] web3_clientVersion (Returns the current client version)
- [ ] eth_getTransactionCount (Returns the number of transactions sent from an address)
- [ ] eth_getBlockTransactionCountByHash (Returns the number of transactions in a block from a block matching the given block hash)
- [ ] eth_getBlockTransactionCountByNumber (Returns the number of transactions in a block matching the given block number)

### Custom Loom provider methods

Sometimes the project requires few functions that aren't provided directly from LoomProvider in this case is possible to add a custom Eth RPC method. You can add it as such:

```js
const loomProviderObj = new LoomProvider(client, privateKey)
loomProviderObj.addCustomMethod('eth_balance', payload => {
  return '0x1'
})
```

The first param should be the Ethereum RPC call method to add on LoomProvider and the second parameter a callback function with the result

### Overwrite Loom provider methods

If the project requires to overwrite a RPC function that already exists on LoomProvider. You can add it as such:

```js
loomProvider.overwriteMethod('eth_estimateGas', payload => {
  return '0x123'
})
```

The first param should be the Ethereum RPC call method to overwrite on LoomProvider and the second parameter a callback function with the result

## License

BSD 3-Clause, see `LICENSE` file for details.
