#!/usr/bin/env node
"use strict";
// @ts-check

import { makeFile } from "./index.js";
import { parseArgs } from "node:util";

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
let help = `
  Usage
    $ mf <input>

  Examples
    $ mf ./component/Button/index.js
    ./component/Button/index.js created 👍
`;

if (args.values.help) {
	console.log(help);
} else {
	// Forward raw positional paths directly to the library entrypoint.
	await makeFile(args.positionals);
}
