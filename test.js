import test from 'ava'
import execa from 'execa'
import fs from 'fs'
import MF from '.'

const cli = execa('./cli.js', ['./dist/foo.js', './dist/bar.js', './dist/baz.js'])

// const fs = require('fs')
// const files = fs.readdir('./dist').length

// describe('create a file', () => {
//   it('should be called', () => {
//     let mffun = jest.fn()
//
//     MF(mffun, 'file.py')
//     expect(MF).toHaveBeenCalled()
//   })
//
//   it('should\'ve made files', () => {
//     expect(cli).toHaveBeenCalledWith('cli', ['./dist/foo.js'])
//   })
// })
//

test('file', async t => {
  const { stdout } = await execa('./cli.js', ['test.js'])
  t.true(stdout.length > 0)
})

// test('stdin', async t => {
//   const { stdout } = await cli, {
//     input: fs.createReadStream('test.js')
//   })
//
//   t.is(parseInt(stdout, 10), gzipSize.sync(a))
// })
