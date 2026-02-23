import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStory } from '../../Storybook/createStory';
import { Fader } from './Fader';
import { FaderProvider } from './FaderProvider';
import { useMemo, useState } from 'react';
import { createComponent } from '../Component';
import { createStyles } from '../../theme';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { useBound } from '../../hooks';

const meta: Meta<typeof Fader> = {
  component: Fader,
};
export default meta;

type Story = StoryObj<typeof Fader>;

const useStyles = createStyles({
  testFader: {
    border: '1px solid black',
    padding: 12,
    borderRadius: 4,
    backgroundColor: 'lightblue',
  },
});

const TestFader = createComponent('TestFader', () => {
  const { css } = useStyles();
  return (
    <Fader>
      <Flex className={css.testFader} disableGrow>
        Hey there!
      </Flex>
    </Fader>
  );
});

export const Loading: Story = createStory({
  width: 1100,
  height: 200,
  render: () => {
    const [isVisible, setIsVisible] = useState(false);

    const content = useMemo(() => {
      if (isVisible) return <TestFader />;
      return null;
    }, [isVisible]);

    const onClick = useBound(() => { setIsVisible(v => !v); });

    return (
      <Flex gap={12} isVertical>
        <Flex disableGrow>
          <Button onClick={onClick}>Toggle Visibility</Button>
        </Flex>
        <FaderProvider duration={5000}>
          {content}
        </FaderProvider>
      </Flex>
    );
  },
});
