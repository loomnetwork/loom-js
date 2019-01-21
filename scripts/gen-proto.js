// This script generates JS classes and TypeScript typings from *.proto files

const shell = require('shelljs')
const os = require('os')
const path = require('path')

shell.mkdir('-p', './dist/proto')

// Array of files to generated and copied
const protoFiles = [
  'loom.proto',
  'evm.proto',
  'plasma_cash.proto',
  'transfer_gateway.proto',
  'address_mapper.proto',
  'coin.proto',
  'dpos.proto',
  'dposv2.proto',
  'karma.proto'
]

// copy the proto so end users can import it from node_modules in their own proto files
protoFiles.forEach(protoFile => {
  shell.cp(`./src/proto/${protoFile}`, `./dist/proto/${protoFile}`)
})

shell.pushd('./src')
try {
  const tsPluginPath = path.join(
    '..',
    'node_modules',
    '.bin',
    os.platform() === 'win32' ? 'protoc-gen-ts.cmd' : 'protoc-gen-ts'
  )

  const jsOutputPath = path.join('..', 'dist')
  const protoFilesWithPath = protoFiles.map(f => `./proto/${f}`).join(' ')

  shell.exec(
    `protoc \
      -I. \
      --plugin=\"protoc-gen-ts=${tsPluginPath}\" \
      --js_out=\"import_style=commonjs,binary:${jsOutputPath}/\" \
      --ts_out=\".\" ${protoFilesWithPath} ./tests/tests.proto`
  )

  protoFiles.forEach(protoFiles => {
    const prefix = protoFiles.split('.').shift()
    shell.cp(`./proto/${prefix}_pb.d.ts`, `../dist/proto/${prefix}_pb.d.ts`)
  })
} catch (err) {
  throw err
} finally {
  shell.popd()
}
