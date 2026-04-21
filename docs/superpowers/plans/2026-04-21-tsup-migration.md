# tsup Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace webpack + ts-loader with tsup to fix broken type declaration output and speed up the library build.

**Architecture:** tsup wraps esbuild for fast CJS+ESM JS output and rollup-plugin-dts for a single `dist/index.d.ts` that correctly satisfies `"typings": "dist/index"`. `webpack.config.js` is deleted. Circular dependency detection moves from build-time (circular-dependency-plugin) to lint-time (eslint-plugin-import/no-cycle).

**Tech Stack:** tsup 8.x, esbuild (via tsup), eslint-plugin-import, pnpm

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `tsup.config.ts` | Replaces `webpack.config.js` |
| Modify | `package.json` | Build script, `module`/`exports` fields, devDeps |
| Modify | `.eslintrc.js` | Add `import` plugin + `no-cycle` rule |
| Modify | `.github/workflows/publish.yml` | Remove `NODE_OPTIONS` from Publish job |
| Delete | `webpack.config.js` | No longer needed |

---

### Task 1: Install tsup and eslint-plugin-import; remove old build deps

**Files:**
- Modify: `package.json` (pnpm updates this automatically)

- [ ] **Step 1: Add tsup and eslint-plugin-import**

Run from the repo root (`C:/code/personal/react-ui`):
```bash
pnpm add -D tsup eslint-plugin-import
```

Expected: both packages appear in `devDependencies` in `package.json`.

- [ ] **Step 2: Remove webpack-related devDependencies**

```bash
pnpm remove webpack webpack-cli webpack-node-externals ts-loader circular-dependency-plugin terser-webpack-plugin
```

Expected: all six packages removed from `devDependencies`. `node_modules` updated. `pnpm-lock.yaml` updated. No errors.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "build: swap webpack for tsup, add eslint-plugin-import"
```

---

### Task 2: Create tsup.config.ts

**Files:**
- Create: `tsup.config.ts`

- [ ] **Step 1: Create the config**

Write `tsup.config.ts` at the repo root:

```ts
import { defineConfig } from 'tsup';
import { existsSync } from 'fs';
import { resolve } from 'path';

const useLocalCommon = existsSync(resolve(__dirname, '../common/src'));

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  tsconfig: useLocalCommon ? 'tsconfig.json' : 'tsconfig.prod.json',
});
```

**What each option does:**
- `format: ['cjs', 'esm']` → emits `dist/index.js` (CJS) and `dist/index.mjs` (ESM)
- `dts: true` → bundles all declarations into `dist/index.d.ts` via rollup-plugin-dts
- `sourcemap: true` → emits `dist/index.js.map` and `dist/index.mjs.map`
- `clean: true` → deletes `dist/` before each build
- `tsconfig` → uses `tsconfig.prod.json` (empty path aliases, resolves `@anupheaus/common` from node_modules) in CI/prod; uses `tsconfig.json` (local path alias) when `../common/src` exists locally

- [ ] **Step 2: Commit**

```bash
git add tsup.config.ts
git commit -m "build: add tsup.config.ts"
```

---

### Task 3: Update package.json build fields

**Files:**
- Modify: `package.json`

The current `package.json` has:
```json
"main": "./dist/index.js",
"typings": "dist/index",
```
and `"build": "webpack --mode production"`.

There is no `"module"` or `"exports"` field.

- [ ] **Step 1: Update the build script and output fields**

Edit `package.json`. Make these changes (keep everything else unchanged):

Change the `"build"` script:
```json
"build": "tsup",
```

Add `"module"` immediately after `"main"`:
```json
"main": "./dist/index.js",
"module": "./dist/index.mjs",
```

Add an `"exports"` field immediately after `"typings"`:
```json
"typings": "dist/index",
"exports": {
  ".": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
},
```

- [ ] **Step 2: Commit**

```bash
git add package.json
git commit -m "build: add module/exports fields, update build script to tsup"
```

---

### Task 4: Delete webpack.config.js

**Files:**
- Delete: `webpack.config.js`

- [ ] **Step 1: Delete the file**

```bash
rm webpack.config.js
```

- [ ] **Step 2: Commit**

```bash
git add webpack.config.js
git commit -m "build: remove webpack.config.js"
```

---

### Task 5: Add import/no-cycle to ESLint config

**Files:**
- Modify: `.eslintrc.js`

The current `.eslintrc.js` has `settings['import/resolver']` already (partial setup from a previous change), but no `import` plugin in the `plugins` array and no `import/no-cycle` rule.

- [ ] **Step 1: Add the import plugin to the plugins array**

In `.eslintrc.js`, change the `plugins` array from:
```js
plugins: [
  '@typescript-eslint/eslint-plugin',
  'eslint-plugin-react',
  'react-hooks'
],
```
to:
```js
plugins: [
  '@typescript-eslint/eslint-plugin',
  'eslint-plugin-react',
  'react-hooks',
  'import'
],
```

- [ ] **Step 2: Add the no-cycle rule**

In the `rules` object, add after `'no-console': 'warn',`:
```js
'import/no-cycle': ['warn', { maxDepth: 5 }],
```

- [ ] **Step 3: Commit**

```bash
git add .eslintrc.js
git commit -m "lint: add import/no-cycle rule (replaces circular-dependency-plugin)"
```

---

### Task 6: Remove NODE_OPTIONS from CI

**Files:**
- Modify: `.github/workflows/publish.yml`

- [ ] **Step 1: Remove the env block from the Build step**

In the Publish job, the Build step currently reads:
```yaml
      - name: Build
        run: pnpm run build
        env:
          NODE_OPTIONS: "--max-old-space-size=4096"
```

Change it to:
```yaml
      - name: Build
        run: pnpm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/publish.yml
git commit -m "ci: remove NODE_OPTIONS from build step (not needed with tsup/esbuild)"
```

---

### Task 7: Run build and verify output

**Files:** (read-only verification)

- [ ] **Step 1: Run the build**

```bash
pnpm run build
```

Expected output: tsup prints something like:
```
CJS dist/index.js     XXX KB
ESM dist/index.mjs    XXX KB
DTS dist/index.d.ts
```
Build completes with no errors.

- [ ] **Step 2: Verify CJS output exists**

```bash
ls dist/index.js dist/index.js.map
```

Expected: both files exist.

- [ ] **Step 3: Verify ESM output exists**

```bash
ls dist/index.mjs dist/index.mjs.map
```

Expected: both files exist.

- [ ] **Step 4: Verify declaration file exists at the correct path**

```bash
ls dist/index.d.ts
```

Expected: file exists. This is the path that `"typings": "dist/index"` resolves to.

- [ ] **Step 5: Verify the declaration file exports the public API**

```bash
grep -c "^export" dist/index.d.ts
```

Expected: a positive number (at least 10+). If the count is 0, the declaration bundling failed — see the fallback note below.

**Fallback if dts fails:** If `dist/index.d.ts` is missing or has 0 exports, tsup's declaration bundler hit a circular type or complex generic issue. Switch to a two-step approach:

1. In `tsup.config.ts`, change `dts: true` to `dts: false`
2. In `package.json`, change the build script to: `"build": "tsup && tsc -p tsconfig.prod.json --emitDeclarationOnly"`
3. In `tsconfig.prod.json`, ensure `"declarationDir": "./dist"` and `"outDir": "./dist"` are set (the existing config already has `declarationDir`)
4. Re-run `pnpm run build` and verify `dist/index.d.ts` appears

---

### Task 8: Run all checks

- [ ] **Step 1: Type-check**

```bash
pnpm run typecheck
```

Expected: exits 0 with no errors.

- [ ] **Step 2: Lint**

```bash
pnpm run lint
```

Expected: exits 0 (or only existing warnings — no new errors). If `import/no-cycle` surfaces circular dependency warnings, these are pre-existing — note them but do not fail the migration on them.

- [ ] **Step 3: Unit tests**

```bash
pnpm run test:ci
```

Expected: all tests pass.

---

### Task 9: Final verification commit

- [ ] **Step 1: Verify git status is clean**

```bash
git status
```

Expected: working tree clean (or only `dist/` changes which are not tracked).

- [ ] **Step 2: Tag the migration complete**

```bash
git log --oneline -8
```

Review the last 8 commits to confirm all tasks landed cleanly.
