# Repository Guidelines

## Project Structure & Module Organization

This repository is a small Node.js CLI package with a flat layout:

- `index.js`: core file-creation logic exported for programmatic use.
- `cli.js`: executable entrypoint for the `mf` command.
- `test.js`: integration and unit tests using Node's built-in test runner.
- `README.md`: install, usage, and rationale docs.
- `.github/workflows/`: CI and publish automation.

There is no build output directory in normal development. The package ships `cli.js` and `index.js` directly.

## Build, Test, and Development Commands

- `npm test`: runs `node --test test.js`.
- `npm run lint`: checks formatting with Prettier.
- `npm run _bin -- ./path/to/file.js`: exercises the CLI locally without publishing.
- `npm install`: installs dependencies and matches CI setup.

Use Node `>=24`, which is required by `package.json` and the GitHub Actions test workflow.

## Coding Style & Naming Conventions

This project uses modern ESM JavaScript with `// @ts-check` and `jsconfig.json` for static checking, not a TypeScript compile step. Keep code simple and dependency-light.

- Use tabs for indentation.
- Follow the existing Prettier config in `package.json`.
- Prefer double quotes and semicolons, matching current files.
- Export small, focused functions with clear verb-based names like `ensureFile` and `makeFile`.

Keep the top-level layout flat unless there is a strong reason to introduce new directories.

## Testing Guidelines

Tests use `node:test` with `assert/strict`. Cover both library behavior and CLI behavior, especially filesystem edge cases like nested paths and existing files.

- Add new tests in `test.js` unless the suite becomes large enough to justify splitting.
- Name tests by behavior, for example: `creates nested files recursively`.
- Run `npm test` and `npm run lint` before opening a PR.

## Commit & Pull Request Guidelines

Recent history favors short, imperative commit subjects such as `Modernize JS config and reorganize tests` or `Add Dependabot configuration`. Keep commits focused and descriptive.

PRs should include a brief summary, linked issue if applicable, and updated `README.md` examples when CLI behavior changes. If output or UX changes, include a short terminal example in the PR description.
