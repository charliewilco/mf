const execa = require('execa')
const fs = require('fs')
const del = require('del')
const MF = require('.')

describe('MF', () => {
	const cli = execa('./cli.js', ['./dist/foo.js', './dist/bar.js', './dist/baz.js'])

	it('runs and has standard out with emoji', () => {
		cli.then(r => expect(r.stdout).toContain('👍'))
	})

	it('produces files', () => {
		fs.readdir('./dist', (err, files) => expect(files).toHaveLength(3))
	})

	afterAll(() => del(['dist/']))
})
