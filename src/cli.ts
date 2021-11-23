#!/usr/bin/env node
"use strict";

import { makeFile } from ".";
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

const app = () => {
  if (args["--help"] || args["-h"]) {
    console.log(help);
    return;
  }

  makeFile(args._);
};

app();
