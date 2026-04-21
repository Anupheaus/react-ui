# Spec: Migrate build from webpack to tsup

**Date:** 2026-04-21  
**Repo:** `@anupheaus/react-ui`

## Problem

The current webpack + ts-loader build has three concrete issues:

1. **Broken type declarations.** `"typings": "dist/index"` resolves to `dist/index.d.ts`, which does not exist. Declarations land at `dist/react-ui/src/**/*.d.ts` (an artefact of ts-loader's `declarationDir` behaviour with path aliases). Consumers of the published package get no TypeScript types.
2. **Double type-checking.** ts-loader runs a full type-check on every build. The CI `typecheck` job already does this separately, so build time is wasted.
3. **Complexity without benefit.** webpack, ts-loader, webpack-node-externals, circular-dependency-plugin, source-map-loader, and a TerserPlugin stub are all wired up for what is ultimately a single-entry TypeScript library with no CSS and no browser-specific loaders needed.

## Goal

Replace webpack with tsup. The build must:

- Emit a CJS bundle at `dist/index.js` (preserves `"main"` field)
- Emit an ESM bundle at `dist/index.mjs` (new `"module"` field)
- Emit a single `dist/index.d.ts` (fixes the broken declarations, matches `"typings"` field)
- Emit source maps for both bundles
- Preserve the local `@anupheaus/common` path alias behaviour for local development
- Produce no regressions in the type-checker or test suite

## Architecture

### `tsup.config.ts`

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

All `dependencies` from `package.json` are external by default in tsup (esbuild does not bundle node_modules). `@anupheaus/common` resolves from node_modules in CI (via tsconfig.prod.json empty paths) and from `../common/src` locally (via tsconfig.json path alias) — identical to the existing webpack behaviour.

### `package.json` changes

| Field | Before | After |
|-------|--------|-------|
| `"build"` script | `webpack --mode production` | `tsup` |
| `"main"` | `./dist/index.js` | `./dist/index.js` (unchanged) |
| `"module"` | *(absent)* | `./dist/index.mjs` |
| `"typings"` | `dist/index` | `dist/index` (now resolves correctly) |
| `"exports"` | *(absent)* | See below |

`"exports"` block:
```json
{
  ".": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

### `package.json` devDependency changes

**Remove:**
- `webpack`
- `webpack-cli`
- `webpack-node-externals`
- `ts-loader`
- `circular-dependency-plugin`
- `source-map-loader` (pulled in transitively by ts-loader but not needed standalone)
- `css-loader` (unused — no CSS in src/)
- `terser-webpack-plugin` (commented out in webpack config)

**Add:**
- `tsup`
- `eslint-plugin-import` (for `import/no-cycle` rule)

### Circular dependency detection

`circular-dependency-plugin` ran at build time. Replace with `eslint-plugin-import` rule running at lint time (faster feedback, no build overhead):

```js
// .eslintrc.js
'import/no-cycle': ['warn', { maxDepth: 5 }]
```

### CI pipeline changes

Remove `NODE_OPTIONS: "--max-old-space-size=4096"` from the Publish job. This was required because ts-loader's type-check pass is memory-intensive. tsup's esbuild transpiler has no such overhead.

### Files to delete

- `webpack.config.js`

## Verification checklist

1. `pnpm run build` completes without errors
2. `dist/index.js` exists and is a valid CJS module
3. `dist/index.mjs` exists and is a valid ESM module
4. `dist/index.d.ts` exists and exports all public API surface
5. `dist/index.d.ts` resolves correctly via `"typings": "dist/index"`
6. `pnpm run typecheck` still passes
7. `pnpm run lint` still passes (with `import/no-cycle` active)
8. `pnpm run test:ci` still passes

## Out of scope

- Changing the `peerDependencies` / `dependencies` split (separate concern)
- Migrating Storybook away from webpack5 builder (Storybook has its own webpack config)
- Changing the tsconfig `target` or `lib` (already updated separately)
