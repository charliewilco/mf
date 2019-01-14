import * as execa from "execa";
import * as fs from "fs";
import * as del from "del"
import { MF } from "./src";

const FILES: string[] = ["foo.js", "bar.js", "baz.js"];

const LOCATION_FILES = FILES.map(f => `./dist/${f}`);

describe("MF", () => {
  it("runs and has standard out with emoji", async () => {
    const result = await execa("./dist/cli.js", LOCATION_FILES);
    expect(result.stdout).toContain("🌈");
    expect(result.stdout).toContain("👍");
  });

  it("produces files", () => {
    const files = fs.readdirSync("./dist");

    FILES.forEach(f => expect(files).toContain(f));
  });

  afterAll(() => del(LOCATION_FILES));
});
