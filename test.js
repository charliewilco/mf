// @ts-check
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import { ensureFile, hasEmoji } from "./index.js";

const CLI_PATH = fileURLToPath(new URL("./cli.js", import.meta.url));

/**
 * @template T
 * @param {(tempDir: string) => Promise<T>} run
 * @returns {Promise<T>}
 */
async function withTempDir(run) {
	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "mf-"));

	try {
		return await run(tempDir);
	} finally {
		await fs.rm(tempDir, { recursive: true, force: true });
	}
}

describe("hasEmoji", () => {
	/** @type {Array<[string, boolean]>} */
	const cases = [
		["Unicorn 🦄", true],
		["🌈", true],
		["❤️ Heart", true],
		["Ø", false],
		["Cat", false],
	];

	for (const [input, expected] of cases) {
		test(`returns ${expected} for ${JSON.stringify(input)}`, () => {
			assert.equal(hasEmoji(input), expected);
		});
	}
});

describe("ensureFile", () => {
	test("creates nested files recursively", async () => {
		await withTempDir(async (tempDir) => {
			const file = path.join(tempDir, "components", "Button", "index.js");

			await ensureFile(file);

			const stat = await fs.stat(file);
			assert.equal(stat.isFile(), true);
		});
	});

	test("does not overwrite an existing file", async () => {
		await withTempDir(async (tempDir) => {
			const file = path.join(tempDir, "existing.js");

			await fs.writeFile(file, "const preserved = true;\n");
			await ensureFile(file);

			assert.equal(await fs.readFile(file, "utf8"), "const preserved = true;\n");
		});
	});
});

describe("cli", () => {
	test("prints help", async () => {
		const { stdout } = await execa(process.execPath, [CLI_PATH, "--help"]);

		assert.match(stdout, /Usage/u);
		assert.match(stdout, /\$ mf <input>/u);
	});

	test("creates requested files and reports success", async () => {
		await withTempDir(async (tempDir) => {
			const files = ["./dist/foo.js", "./dist/bar.js", "./dist/baz.js"];
			const { stdout } = await execa(process.execPath, [CLI_PATH, ...files], {
				cwd: tempDir,
			});

			const createdFiles = await fs.readdir(path.join(tempDir, "dist"));

			assert.deepEqual(createdFiles.sort(), ["bar.js", "baz.js", "foo.js"]);
			assert.match(stdout, /🌈/u);
			assert.match(stdout, /👍/u);
		});
	});
});
