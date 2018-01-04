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

const app = () => (args.help || args.h ? console.log(help) : MF(args._))

app()
