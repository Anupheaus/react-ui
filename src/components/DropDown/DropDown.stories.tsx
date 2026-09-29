import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { useState } from 'react';
import { DropDown } from './DropDown';
import type { ListItem } from '@anupheaus/common';
import { Text } from '../Text';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';

const meta: Meta<typeof DropDown> = {
  component: DropDown,
};
export default meta;

type Story = StoryObj<typeof DropDown>;

const options: ListItem[] = [
  { id: '1', text: 'One' },
  { id: '2', text: 'Two' },
  { id: '3', text: 'Three' },
  { id: '4', text: 'Four' },
  { id: '5', text: 'Five' },
  { id: '6', text: 'Six' },
];

const config = {
  args: {
    label: 'Label',
  },
  render: (props: React.ComponentProps<typeof DropDown>) => {
    const [value, setValue] = useState<string | undefined>('');
    return (
      <DropDown {...props} value={value} onChange={setValue} values={options} />
    );
  },
} satisfies Story;

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates({ ...config, includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;

const useDarkBackgroundStyles = createStyles({
  darkHeader: {
    backgroundColor: '#2f3a4a',
    color: 'white',
    padding: 16,
  },
});

/** Fields own their colours: on a dark header that sets white text, the value still reads dark on the light field. */
export const OnADarkBackground: Story = {
  render: () => {
    const { css } = useDarkBackgroundStyles();
    const [value, setValue] = useState<string | undefined>('1');
    const [text, setText] = useState('Some text');
    return (
      <Flex className={css.darkHeader} gap={16}>
        <DropDown label="Version" value={value} onChange={setValue} values={options} />
        <Text label="Name" value={text} onChange={setText} />
      </Flex>
    );
  },
};
OnADarkBackground.name = 'On a dark background';
OnADarkBackground.play = waitForStoryReady;
