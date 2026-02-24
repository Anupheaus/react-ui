import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext, waitForPageReady } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

const customSnapshotsDir = `${process.cwd()}/__image_snapshots__`;

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);
    // Skip when story has parameters.test.skipScreenshot = true (for lazy-loading content, etc.)
    const skipScreenshot = storyContext.parameters?.test?.skipScreenshot === true;

    const storyName = context.id.split('--').pop()?.toLowerCase() ?? '';
    const isLoadingStory = storyName === 'loading' || storyName.startsWith('lazy-load');

    if (skipScreenshot || isLoadingStory) return;

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
