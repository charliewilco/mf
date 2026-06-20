#!/usr/bin/env node
"use strict";
// @ts-check

import { hasEmoji, makeFile } from "./index.js";
import { parseArgs, styleText } from "node:util";

const args = parseArgs({
	allowPositionals: true,
	options: {
		help: {
			type: "boolean",
			short: "h",
		},
	},
});

// Keep help text inline with the CLI so usage changes stay close to the parser config.
const help = `
  Usage
    $ mf <input>

  Examples
    $ mf ./component/Button/index.js
    ./component/Button/index.js created 👍
`;

if (args.values.help) {
	console.log(help);
} else if (args.positionals.length === 0) {
	console.error(help);
	process.exitCode = 1;
} else {
	try {
		await makeFile(args.positionals);

		const enabledEmoji = hasEmoji("🌈");
		const message = enabledEmoji ? "created! 🌈 👍" : "created";

		for (const file of args.positionals) {
			process.stdout.write(`${styleText("yellow", file)} ${message}\n`);
		}
	} catch (err) {
		const enabledEmoji = hasEmoji("🌈");
		const errorMessage = enabledEmoji ? "🚦" : ":(";

		process.stderr.write(styleText("red", `${err} ${errorMessage}\n`));
		process.exitCode = 1;
	}
}
