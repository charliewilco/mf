// @ts-check
import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { execa } from "execa";
import fs from "node:fs/promises";
import { deleteAsync } from "del";

const FILES = ["foo.js", "bar.js", "baz.js"];

const LOCATION_FILES = FILES.map((f) => `./dist/${f}`);
let commandResult;

describe("makeFile", () => {
	before(async () => {
		await deleteAsync(LOCATION_FILES);
		commandResult = await execa("./cli.js", LOCATION_FILES);
	});

	test("runs and has standard out with emoji", async () => {
		assert.match(commandResult.stdout, /🌈/u);
		assert.match(commandResult.stdout, /👍/u);
	});

	test("produces files", async () => {
		const files = await fs.readdir("./dist");

		FILES.forEach((f) => assert.ok(files.includes(f)));
	});

	test.todo("ensure file");

	test.todo("make file");

	after(async () => await deleteAsync(LOCATION_FILES));
});
