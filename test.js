// @ts-check
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import { ensureFile, hasEmoji, makeFile } from "./index.js";

const CLI_PATH = fileURLToPath(new URL("./cli.js", import.meta.url));

/**
 * @param {string[]} args
 * @param {{ cwd?: string }} [options]
 * @returns {Promise<{ code: number, stdout: string, stderr: string }>}
 */
async function runCli(args, options = {}) {
	return await new Promise((resolve) => {
		execFile(process.execPath, [CLI_PATH, ...args], options, (error, stdout, stderr) => {
			resolve({
				code: typeof error?.code === "number" ? error.code : 0,
				stdout,
				stderr,
			});
		});
	});
}

/**
 * Run filesystem tests in an isolated temp directory and always clean up afterward.
 *
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
	test("creates files in the current directory", async () => {
		await withTempDir(async (tempDir) => {
			const file = path.join(tempDir, "index.js");

			await ensureFile(file);

			const stat = await fs.stat(file);
			assert.equal(stat.isFile(), true);
		});
	});

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

	test("rejects when the target path is an existing directory", async () => {
		await withTempDir(async (tempDir) => {
			const directory = path.join(tempDir, "existing-directory");
			await fs.mkdir(directory);

			await assert.rejects(ensureFile(directory), { code: "EISDIR" });
		});
	});
});

describe("makeFile", () => {
	test("creates every requested file", async () => {
		await withTempDir(async (tempDir) => {
			const files = [
				path.join(tempDir, "src", "index.js"),
				path.join(tempDir, "src", "components", "Button.js"),
				path.join(tempDir, "test", "index.test.js"),
			];

			await makeFile(files);

			for (const file of files) {
				const stat = await fs.stat(file);
				assert.equal(stat.isFile(), true);
			}
		});
	});

	test("rejects filesystem errors", async () => {
		await withTempDir(async (tempDir) => {
			const blocker = path.join(tempDir, "blocker");
			await fs.writeFile(blocker, "");

			await assert.rejects(makeFile([path.join(blocker, "child.js")]), { code: "ENOTDIR" });
		});
	});
});

describe("cli", () => {
	test("prints help", async () => {
		const { code, stdout, stderr } = await runCli(["--help"]);

		assert.equal(code, 0);
		assert.match(stdout, /Usage/u);
		assert.match(stdout, /\$ mf <input>/u);
		assert.equal(stderr, "");
	});

	test("creates requested files and reports success", async () => {
		await withTempDir(async (tempDir) => {
			// Use relative paths here to exercise the same workflow as a real CLI invocation.
			const files = ["./dist/foo.js", "./dist/bar.js", "./dist/baz.js"];
			const { code, stdout, stderr } = await runCli(files, {
				cwd: tempDir,
			});

			const createdFiles = await fs.readdir(path.join(tempDir, "dist"));

			assert.equal(code, 0);
			assert.equal(stderr, "");
			assert.deepEqual(createdFiles.sort(), ["bar.js", "baz.js", "foo.js"]);
			for (const file of files) {
				assert.equal(stdout.includes(`${file} created!`), true);
			}
			assert.match(stdout, /🌈/u);
			assert.match(stdout, /👍/u);
		});
	});

	test("prints help and exits nonzero when no file is provided", async () => {
		const { code, stdout, stderr } = await runCli([]);

		assert.equal(code, 1);
		assert.equal(stdout, "");
		assert.match(stderr, /Usage/u);
		assert.match(stderr, /\$ mf <input>/u);
	});

	test("prints filesystem errors to stderr and exits nonzero", async () => {
		await withTempDir(async (tempDir) => {
			const blocker = path.join(tempDir, "blocker");
			await fs.writeFile(blocker, "");

			const { code, stdout, stderr } = await runCli([path.join(blocker, "child.js")]);

			assert.equal(code, 1);
			assert.equal(stdout, "");
			assert.match(stderr, /ENOTDIR/u);
			assert.match(stderr, /🚦/u);
		});
	});

	test("does not print success output when a requested file fails", async () => {
		await withTempDir(async (tempDir) => {
			const blocker = path.join(tempDir, "blocker");
			await fs.writeFile(blocker, "");

			const { code, stdout, stderr } = await runCli(
				["./valid.js", path.join(blocker, "child.js")],
				{
					cwd: tempDir,
				},
			);

			assert.equal(code, 1);
			assert.equal(stdout, "");
			assert.match(stderr, /ENOTDIR/u);
		});
	});
});
