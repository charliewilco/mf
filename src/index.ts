import fs from "fs/promises";
import path from "path";
import hasEmoji from "has-emoji";
import makeDir from "make-dir";
import pc from "picocolors";

async function ensureFile(file: string) {
  try {
    const stat = await fs.stat(file);
    if (stat.isFile()) {
      return;
    }
  } catch (err) {}

  const dir = path.dirname(file);

  try {
    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) {
      // parent is not a directory
      // This is just to cause an internal ENOTDIR error to be thrown
      await fs.readdir(dir);
    }
  } catch (err) {
    if (err && err.code === "ENOENT") {
      await makeDir(dir);
    } else {
      throw new Error(err);
    }
  }

  fs.writeFile(file, "");
}

export async function makeFile(files: string[]) {
  const { red, yellow } = pc.createColors();
  const enabledEmoji = hasEmoji("🌈");

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
