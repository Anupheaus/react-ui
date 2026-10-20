import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect } from 'storybook/test';
import { AssistiveLabel } from './AssistiveLabel';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { createStory } from '../../Storybook/createStory';
import { Flex } from '../Flex';
import { AssistiveLabelPhoneForm, LONG_ERROR } from './AssistiveLabelPhoneForm';

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

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;

async function expectMessagesWrapInsidePhone(phone: HTMLElement): Promise<void> {
  await expect(phone.scrollWidth).toBeLessThanOrEqual(phone.clientWidth);
  const phoneRight = phone.getBoundingClientRect().right;
  const labels = Array.from(phone.querySelectorAll<HTMLElement>('assistive-label'));
  await expect(labels).toHaveLength(3);
  for (const label of labels) {
    await expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(phoneRight);
    // It wrapped: one line is about one font size tall, so more than one and a half means two lines or more
    const fontSize = parseFloat(getComputedStyle(label).fontSize);
    await expect(label.getBoundingClientRect().height).toBeGreaterThan(fontSize * 1.5);
  }
}

/**
 * Long messages under fields on 320, 360 and 375px phones: a long error and a long unbroken hint in a form's column, and
 * a long error under a field in a shrink-to-fit box. Each wraps inside the phone and nothing scrolls sideways. Sized to
 * its text (`max-content`), the message pushed the form wider than the screen (Vision sc-2955).
 */
export const WrapsLongMessageOnPhone: Story = createStory<typeof AssistiveLabel>({
  render: () => (
    <Flex gap={24} valign="top" disableGrow>
      <AssistiveLabelPhoneForm width={320} />
      <AssistiveLabelPhoneForm width={360} />
      <AssistiveLabelPhoneForm width={375} />
    </Flex>
  ),
  play: async ({ canvas, canvasElement }) => {
    await canvas.findAllByText(LONG_ERROR);
    const phones = Array.from(canvasElement.querySelectorAll<HTMLElement>('phone-screen'));
    await expect(phones).toHaveLength(3);
    for (const phone of phones) await expectMessagesWrapInsidePhone(phone);
  },
});
