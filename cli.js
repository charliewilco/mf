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

let help = `
  Usage
    $ mf <input>

  Examples
    $ mf ./component/Button/index.js
    ./component/Button/index.js created 👍
`;

const app = async () => {
	if (args.values.help) {
		console.log(help);
		return;
	}

	await makeFile(args.positionals);
};

app();
