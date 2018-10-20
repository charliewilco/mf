const { createFile } = require("fs-extra");
const { emojify } = require("node-emoji");
const chalk = require("chalk");

function touch(files: string[]) {
  const errorOut = (err: Error) => {
    process.stdout.write(chalk.red(emojify(`${err} :rotating_light:`)));
    process.exit();
  };

  // Response Message Formatting

  const highlight = chalk.yellow;
  const msg = emojify("created :rainbow: :thumbsup:");
  const wr = (f: string) => process.stdout.write(`${highlight(f)} ${msg}\n`);

  // Create the file & process the input

  const fileCreation = (file: string) =>
    createFile(file, (err: Error) => {
      err ? errorOut(err) : wr(file);
    });

  return files.map(f => fileCreation(f));
}

export const MF = (files: string[]) => touch(files);
