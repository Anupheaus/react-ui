import type { TestRunnerConfig } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { waitForPageReady } from '@storybook/test-runner';

const customSnapshotsDir = `${process.cwd()}/__image_snapshots__`;

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    await waitForPageReady(page);

    const element = page.locator('#storybook-root');
    const image = await element.screenshot();

    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id.replace(/[^a-z0-9-]/gi, '-'),
      failureThreshold: 0.02,
      failureThresholdType: 'percent',
    });
  },
};

export default config;
