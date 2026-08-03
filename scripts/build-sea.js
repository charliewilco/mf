// @ts-check
import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const distDir = join(projectRoot, "dist");
const seaEntry = join(distDir, "mf-sea.mjs");
const seaConfig = join(distDir, "sea-config.json");
const executable = join(distDir, process.platform === "win32" ? "mf.exe" : "mf");

function assertBuildSeaSupport() {
	const [major = 0, minor = 0] = process.versions.node.split(".").map(Number);

	if (major > 25 || (major === 25 && minor >= 5)) {
		return;
	}

	throw new Error(
		`Node ${process.versions.node} cannot build single executable apps with --build-sea. Use Node >=25.5 for npm run build:sea.`,
	);
}

/**
 * @param {string} source
 * @returns {string[]}
 */
function getImports(source) {
	return [...source.matchAll(/^import .+;$/gmu)].map(([line]) => line);
}

/**
 * @param {string} source
 */
function removeImports(source) {
	return source.replace(/^import .+;\n/gmu, "");
}

/**
 * @param {string} source
 */
function prepareIndexSource(source) {
	return removeImports(source)
		.replace(/^\/\/ @ts-check\n/u, "")
		.replaceAll("export async function", "async function")
		.replaceAll("export function", "function");
}

/**
 * @param {string} source
 */
function prepareCliSource(source) {
	return removeImports(source)
		.replace(/^#!.+\n/u, "")
		.replace(/^"use strict";\n/u, "")
		.replace(/^\/\/ @ts-check\n/u, "");
}

/**
 * @param {string} command
 * @param {string[]} args
 */
async function run(command, args) {
	await new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			cwd: projectRoot,
			stdio: "inherit",
		});

		child.on("error", reject);
		child.on("exit", (code) => {
			if (code === 0) {
				resolve(undefined);
				return;
			}

			reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
		});
	});
}

async function build() {
	assertBuildSeaSupport();

	const [indexSource, cliSource] = await Promise.all([
		readFile(join(projectRoot, "index.js"), "utf8"),
		readFile(join(projectRoot, "cli.js"), "utf8"),
	]);

	const imports = [...new Set([...getImports(indexSource), ...getImports(cliSource)])]
		.filter((line) => !line.includes('"./index.js"'))
		.join("\n");

	const entry = `${imports}

${prepareIndexSource(indexSource)}

${prepareCliSource(cliSource)}
`;

	await rm(distDir, { recursive: true, force: true });
	await mkdir(distDir, { recursive: true });
	await writeFile(seaEntry, entry);
	await writeFile(
		seaConfig,
		`${JSON.stringify(
			{
				main: seaEntry,
				mainFormat: "module",
				output: executable,
				disableExperimentalSEAWarning: true,
				useCodeCache: false,
				useSnapshot: false,
			},
			null,
			"\t",
		)}\n`,
	);

	await run(process.execPath, ["--build-sea", seaConfig]);

	if (process.platform === "darwin") {
		await run("codesign", ["--sign", "-", executable]);
	}

	await chmod(executable, 0o755);
	console.log(`Built ${executable}`);
}

try {
	await build();
} catch (err) {
	console.error(err instanceof Error ? err.message : err);
	process.exitCode = 1;
}
