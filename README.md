# [Loom.js](https://loomx.io) [![Build Status](https://travis-ci.org/loomnetwork/loom-js.svg?branch=master)](https://travis-ci.org/loomnetwork/loom-js)

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
<script src="https://cdn.jsdelivr.net/npm/loom-js@1.12.2/dist/loom.umd.js"></script>
```

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

## License

BSD 3-Clause, see `LICENSE` file for details.
