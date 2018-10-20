#!/usr/bin/env node
"use strict";

import { MF } from ".";
import * as mri from "mri";

interface IArguments extends mri.Argv {
  _: string[];
  help: boolean;
  h: boolean;
}

const args = <IArguments>mri(process.argv.slice(2), { boolean: ["h", "help"] });

let help = `
  Usage
    $ mf <input>

  Examples
    $ mf ./component/Button/index.js
    ./component/Button/index.js created 👍
`;

const app = () => (args.help || args.h ? console.log(help) : MF(args._));

app();
