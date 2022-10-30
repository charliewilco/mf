# mf (make file)

![example workflow](https://github.com/charliewilco/mf/actions/workflows/node.yml/badge.svg)

Nicer `touch` utility

## Installation & Usage

```sh
npm install --global @charliewilco/mf-cli
```

Call the command `mf` and pass a single argument to it, the name and path of the file(s) you'd like create

```sh
mf ./src/components/Button.js ./src/actions/index.js
```

Output:

```sh
./src/components/Button.js created 👍
./src/actions/index.js created 👍
```

### Using `npx`

```sh
npx @charliewilco/mf-cli hello.ts
```

## Rationale

One command line thing I need to do all the time is make a file. In Atom when you make a new file, it'll make a new directory if it doesn't exist. For example if you're in Atom and make `src/components/Button.js` and the `components` directory doesn't exist, it'll just create it by default.

But on the command line, to do this, you'd need to `mkdir src/components && touch components/Button.js` to make that happen. It's a little thing, but when you do a little thing 20 or 30 times a day, it becomes annoying. It's even worse in Vim; and honestly it's one huge thing I feel is lacking in Vim.

What I'm attempting to do here is to make a little CLI utility to do something like `mf ./src/components/Button.js`

## License

The Unlicense
