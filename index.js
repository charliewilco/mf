const { createFile } = require('fs-extra')
const chalk = require('chalk')
const { emojify } = require('node-emoji')

// TODO:
// use promises... or async / await or something

function touch (files) {
  const errorOut = err => {
    console.log(err)
    process.exit()
  }

  // Response Message

  const highlight = chalk.yellow
  const msg = emojify('created :thumbsup:')
  const wr = f => process.stdout.write(`${highlight(f)} ${msg}\n`)

  // Create the file & process the input

  const touch = f => createFile(f, err => {
    err ? errorOut(err) : wr(f)
  })

  return files.map(f => touch(f))
}

const MF = x => touch(x)

module.exports = MF
