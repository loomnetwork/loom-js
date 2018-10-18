// This script cleanups the db directory

const shell = require('shelljs')

shell.rm('-rf', './db')
