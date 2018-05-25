# [Loom.js](https://loomx.io) [![Build Status](https://travis-ci.org/loomnetwork/loom-js.svg?branch=master)](https://travis-ci.org/loomnetwork/loom-js)

JS library for building browser apps & NodeJS services that interact with Loom DAppChains.

This is currently in private beta, please join our Telegram to find out more [https://t.me/loomnetwork](https://t.me/loomnetwork)

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
<script src="https://cdn.jsdelivr.net/npm/loom-js@1.3.0/dist/loom.umd.js"></script>
```

## Development

```shell
# build for Node
yarn build
# build for Browser
yarn build:browser
# run unit tests on Node & Browser
yarn test
# auto-format source files
yarn format
# run unit tests in Node
yarn test:node
# same as above but on Windows
yarn test:node:win
# run unit tests in Electon
yarn test:browser
# same as above but on Windows
yarn test:browser:win
# run e2e test in Node (local DAppChain node must be running first)
yarn e2e:node
# same as above but on Windows
yarn e2e:node:win
# run e2e test in Electron (local DAppChain node must be running first)
yarn e2e:browser
# same as above but on Windows
yarn e2e:browser:win
```

### Regenerating Protobufs

Whenever you change `src/proto/loom.proto`, or `src/tests/tests.proto` you will need to regenerate
the corresponding `*_pb.js` by running:

```shell
# Mac / Linux
yarn proto
# Windows
yarn proto:win
```

The shell must be able to locate the `protoc` binary, which can be obtained from https://github.com/google/protobuf/releases

## License

See `License.md`.