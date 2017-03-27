const { createFile } = require('fs-extra')
const { emojify } = require('node-emoji')
const chalk = require('chalk')

// TODO:
// use promises... or async / await or something

function touch (files) {
  const errorOut = err => {
    console.log(err)
    process.exit()
  }

  // Response Message Formatting

  const highlight = chalk.yellow
  const msg = emojify('created :thumbsup:')
  const wr = f => process.stdout.write(`${highlight(f)} ${msg}\n`)

  // Create the file & process the input

  const fileCreation = f => createFile(f, err => {
    err ? errorOut(err) : wr(f)
  })

  return files.map(f => fileCreation(f))
}

const MF = x => touch(x)

module.exports = MF
