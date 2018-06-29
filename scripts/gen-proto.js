// This script generates JS classes and TypeScript typings from *.proto files

const shell = require('shelljs')
const os = require('os')
const path = require('path')

shell.mkdir('-p', './dist/proto')
// copy the proto so end users can import it from node_modules in their own proto files
shell.cp('./src/proto/loom.proto', './dist/proto/loom.proto')
shell.cp('./src/proto/plasma_cash.proto', './dist/proto/plasma_cash.proto')
// FIXME: move this to a separate script since it doesn't have anything to do with protobufs
shell.mkdir('-p', './dist/plasma-cash/contracts')
shell.cp('./src/plasma-cash/contracts/plasma-cash-abi.json', './dist/plasma-cash/contracts/plasma-cash-abi.json')
shell.mkdir('-p', './dist/tests/e2e/contracts')
shell.cp('./src/tests/e2e/contracts/cards-abi.json', './dist/tests/e2e/contracts/cards-abi.json')

shell.pushd('./src')
try {
  const tsPluginPath = path.join('..', 'node_modules', '.bin',  os.platform() === 'win32' ? 'protoc-gen-ts.cmd' : 'protoc-gen-ts')
  const jsOutputPath = path.join('..', 'dist')
  shell.exec(`protoc -I. --plugin=\"protoc-gen-ts=${tsPluginPath}\" --js_out=\"import_style=commonjs,binary:${jsOutputPath}/\" --ts_out=\".\" ./proto/loom.proto ./proto/plasma_cash.proto ./tests/tests.proto`)
  shell.cp('./proto/loom_pb.d.ts', '../dist/proto/loom_pb.d.ts')
  shell.cp('./proto/plasma_cash_pb.d.ts', '../dist/proto/plasma_cash_pb.d.ts')
} catch (err) {
  throw err
} finally {
  shell.popd()
}
