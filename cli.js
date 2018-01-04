#!/usr/bin/env node
'use strict'


const MF = require('.')
const mri = require('mri')


const args = mri(process.argv.slice(2), { boolean: ['h', 'help'] })

let help = `
  Usage
    $ mf <input>

  Examples
    $ mf ./component/Button/index.js
    ./component/Button/index.js created 👍
`

console.log(args)

if (args.help || args.h) {
	return console.log(help)
} else {
	return MF(args._)

}
