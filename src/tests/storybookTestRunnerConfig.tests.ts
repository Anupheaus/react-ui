import { existsSync } from 'fs';
import { resolve } from 'path';

const storybookConfigDir = resolve(__dirname, '../../.storybook');
const testRunnerConfigFiles = [
  'test-runner.js',
  'test-runner.jsx',
  'test-runner.ts',
  'test-runner.tsx',
  'test-runner.mjs',
  'test-runner.mts',
  'test-runner.mtsx',
  'test-runner.cjs',
  'test-runner.cts',
  'test-runner.ctsx',
].map(fileName => resolve(storybookConfigDir, fileName));

describe('storybook test-runner configuration', () => {
  it('keeps the test-runner config absent so test-storybook does not call Storybook module.register() inside Jest', () => {
    for (const configPath of testRunnerConfigFiles) {
      expect({ configPath, exists: existsSync(configPath) }).toEqual({ configPath, exists: false });
    }
  });
});
