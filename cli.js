#!/usr/bin/env node
'use strict'

const meow = require('meow')
const MF = require('.')

const cli = meow(`
  Usage
    $ mf <input>

  Examples
    $ mf ./component/Button/index.js
    ./component/Button/index.js created 👍
`)

MF(cli.input)
