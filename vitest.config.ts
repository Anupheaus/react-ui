import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
    include: ['src/**/*.tests.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: [
        'src/**/*.stories.*',
        'src/**/*.tests.*',
        'src/**/index.ts',
        'src/**/index.tsx',
        'src/Storybook/**',
      ],
      reportsDirectory: 'coverage/vitest',
    },
  },
});
