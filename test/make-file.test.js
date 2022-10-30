// @ts-check
import { execa } from "execa";
import fs from "node:fs/promises";
import { deleteAsync } from "del";

const FILES = ["foo.js", "bar.js", "baz.js"];

const LOCATION_FILES = FILES.map((f) => `./dist/${f}`);

describe("makeFile", () => {
	it("runs and has standard out with emoji", async () => {
		try {
			const result = await execa("./cli.js", LOCATION_FILES);
			expect(result.stdout).toContain("🌈");
			expect(result.stdout).toContain("👍");
		} catch (err) {
			console.log(err);
		}
	});

	test("produces files", async () => {
		const files = await fs.readdir("./dist");

		FILES.forEach((f) => expect(files).toContain(f));
	});

	afterAll(async () => await deleteAsync(LOCATION_FILES));
});
