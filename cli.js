#!/usr/bin/env node
"use strict";
// @ts-check

import { makeFile } from "./index.js";
import arg from "arg";

const args = arg({
  "--help": Boolean,
  "-h": "--help",
});

let help = `
  Usage
    $ mf <input>

  Examples
    $ mf ./component/Button/index.js
    ./component/Button/index.js created 👍
`;

const app = async () => {
  if (args["--help"] || args["-h"]) {
    console.log(help);
    return;
  }

  await makeFile(args._);
};

app();
