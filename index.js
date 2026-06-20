// @ts-check
import fs from "node:fs/promises";
import { dirname } from "node:path";

/**
 * @param {string} file
 *
 */
export async function ensureFile(file) {
	try {
		const stat = await fs.stat(file);
		if (stat.isFile()) {
			// Preserve existing files so `mf` behaves like a safe "ensure exists" command.
			return;
		}
	} catch (err) {
		// Ignore missing paths; anything else is a real filesystem error we should surface.
		if (typeof err !== "object" || err === null || !("code" in err) || err.code !== "ENOENT") {
			throw err;
		}
	}

	const dir = dirname(file);

	// Match editor behavior by creating the parent directory tree on demand.
	await fs.mkdir(dir, { recursive: true });

	await fs.writeFile(file, "");
}

// Use the Unicode RGI emoji set so terminal capability detection handles composed emoji too.
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
	await Promise.all(files.map(ensureFile));
}
