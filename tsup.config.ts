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
