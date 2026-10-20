import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect } from 'storybook/test';
import { AssistiveLabel } from './AssistiveLabel';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { createStory } from '../../Storybook/createStory';
import { Flex } from '../Flex';
import { Text } from '../Text';

const meta: Meta<typeof AssistiveLabel> = {
  component: AssistiveLabel,
};
export default meta;

type Story = StoryObj<typeof AssistiveLabel>;

const config = {
  args: {
    children: 'Label',
  },
  render: (props: React.ComponentProps<typeof AssistiveLabel>) => <AssistiveLabel {...props} />,
} satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

// The width a field would give it: the label wraps to its host's width, so in the harness's shrink-to-fit box it would
// wrap after every character
export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true, width: 200 });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;

/** The narrowest phone a form is used on. */
const PHONE_WIDTH = 320;
const LONG_ERROR = 'This reason is far too long to fit on one line of a small phone, so it must wrap onto several lines '
  + 'inside the field rather than push the form wider than the screen.';
// One unbroken run (a pasted link or code) has nowhere to break, so it must wrap mid-word too
const LONG_UNBROKEN_HINT = 'https://example.com/a-very-long-link-pasted-into-the-notes-without-any-spaces-at-all';

/**
 * A long error and a long unbroken hint under fields on a 320px phone: each message wraps inside its field and nothing
 * scrolls sideways. Sized to its text (`max-content`), the message pushed the form wider than the screen (Vision sc-2955).
 */
export const WrapsLongMessageOnPhone: Story = createStory<typeof AssistiveLabel>({
  width: PHONE_WIDTH,
  render: () => (
    <Flex isVertical gap="fields">
      <Text label="Reason" value="" error={LONG_ERROR} wide />
      <Text label="Link" value="" assistiveHelp={LONG_UNBROKEN_HINT} wide />
    </Flex>
  ),
  play: async ({ canvas, canvasElement }) => {
    await canvas.findByText(LONG_ERROR);
    const content = canvasElement.querySelector<HTMLElement>('storybook-content');
    await expect(content).not.toBeNull();
    await expect(content!.scrollWidth).toBeLessThanOrEqual(content!.clientWidth);
    const labels = Array.from(canvasElement.querySelectorAll<HTMLElement>('assistive-label'));
    await expect(labels).toHaveLength(2);
    const contentRight = content!.getBoundingClientRect().right;
    for (const label of labels) {
      await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
      await expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(contentRight);
      // It wrapped: one line is about one font size tall, so more than one and a half means two lines or more
      const fontSize = parseFloat(getComputedStyle(label).fontSize);
      await expect(label.getBoundingClientRect().height).toBeGreaterThan(fontSize * 1.5);
    }
  },
});
