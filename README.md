# [Loom.js](https://loomx.io)

JS library for building browser apps & NodeJS services that interact with Loom DAppChains.

This is currently in private beta, please join our Telegram to find out more [https://t.me/loomnetwork](https://t.me/loomnetwork)

NOTE: Vault key store functionality currently only works in browsers (this will be fixed soon).

## Install

TBD: npm/yarn/CDN instructions

## Development

```shell
# build for Node
yarn build
# build for Browser
yarn build:browser
# run tests on Node & Browser
yarn test
# auto-format source files
yarn format
# run tests in Node
yarn test:node
# same as above but on Windows
yarn test:node:win
# run tests in Electon
yarn test:browser
# same as above but on Windows
yarn test:browser:win
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