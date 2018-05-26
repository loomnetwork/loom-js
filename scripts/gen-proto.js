// This script generates JS classes and TypeScript typings from *.proto files

const shell = require('shelljs')
const os = require('os')
const path = require('path')

shell.mkdir('-p', 'dist')
shell.cd('src')

const tsPluginPath = path.join('..', 'node_modules', '.bin',  os.platform() === 'win32' ? 'protoc-gen-ts.cmd' : 'protoc-gen-ts')
const jsOutputPath = path.join('..', 'dist')
shell.exec(`protoc --plugin=\"protoc-gen-ts=${tsPluginPath}\" --js_out=\"import_style=commonjs,binary:${jsOutputPath}/\" --ts_out=\".\" ./proto/loom.proto ./tests/tests.proto`)
