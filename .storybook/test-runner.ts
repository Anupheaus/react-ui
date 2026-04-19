import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async prepare({ browserContext }) {
    // Seed Math.random to a constant so that skeleton random-widths are
    // deterministic across runs and don't cause snapshot mismatches.
    await browserContext.addInitScript(() => {
      Math.random = () => 0.5;
    });
  },
};

export default config;
