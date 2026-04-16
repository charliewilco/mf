// @ts-check
import fs from "node:fs/promises";
import { dirname } from "node:path";
import { styleText } from "node:util";

/**
 * @param {string} file
 *
 */
export async function ensureFile(file) {
	try {
		const stat = await fs.stat(file);
		if (stat.isFile()) {
			return;
		}
	} catch (err) {
		if (typeof err !== "object" || err === null || !("code" in err) || err.code !== "ENOENT") {
			throw err;
		}
	}

	const dir = dirname(file);

	await fs.mkdir(dir, { recursive: true });

	await fs.writeFile(file, "");
}

const regex = /\p{RGI_Emoji}/v;

/**
 * @param {string} string
 *
 */
export function hasEmoji(string) {
	return regex.test(string);
}

/**
 * @param {string[]} files
 *
 */
export async function makeFile(files) {
	const enabledEmoji = hasEmoji("🌈");

	const msg = enabledEmoji ? "created! 🌈 👍" : "created";

	// Create the file & process the input
	await Promise.all(
		files.map(async (f) => {
			try {
				await ensureFile(f);
				process.stdout.write(`${styleText("yellow", f)} ${msg}\n`);
			} catch (err) {
				const errorMessage = enabledEmoji ? "🚦" : ":(";
				process.stdout.write(styleText("red", `${err} ${errorMessage}`));
				process.exit();
			}
		}),
	);
}
