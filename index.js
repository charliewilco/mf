// @ts-check
import fs from "fs/promises";
import { dirname } from "path";
import pc from "picocolors";

/**
 * @param {string} file
 *
 */
async function ensureFile(file) {
  try {
    const stat = await fs.stat(file);
    if (stat.isFile()) {
      return;
    }
  } catch (err) {}

  const dir = dirname(file);

  try {
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) {
      // parent is not a directory
      // This is just to cause an internal ENOTDIR error to be thrown
      await fs.readdir(dir);
    }
  } catch (err) {
    if (err && err.code === "ENOENT") {
      const { default: makeDir } = await import("make-dir");
      await makeDir(dir);
    } else {
      throw new Error(err);
    }
  }

  fs.writeFile(file, "");
}

/**
 * @param {string[]} files
 *
 */
export async function makeFile(files) {
  const { red, yellow } = pc.createColors();
  const hasEmoji = await import("has-emoji");
  const enabledEmoji = hasEmoji.default("🌈");

  const msg = enabledEmoji ? "created! 🌈 👍" : "created";

  // Create the file & process the input
  await Promise.all(
    files.map(async (f) => {
      try {
        await ensureFile(f);
        process.stdout.write(`${yellow(f)} ${msg}\n`);
      } catch (err) {
        const errorMessage = enabledEmoji ? "🚦" : ":(";
        process.stdout.write(red(`${err} ${errorMessage}`));
        process.exit();
      }
    })
  );
}
