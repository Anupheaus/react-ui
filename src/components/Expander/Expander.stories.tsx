import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStory } from '../../Storybook/createStory';
import { Expander } from './Expander';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { useBound } from '../../hooks';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Tag } from '../Tag';

const meta: Meta<typeof Expander> = {
  component: Expander,
  title: 'Components/Expander',
};
export default meta;

type Story = StoryObj<typeof Expander>;

const sampleContent = (
  <Flex style={{ padding: 16, backgroundColor: 'var(--list-normal-background-color, #f5f5f5)', borderRadius: 4 }} isVertical gap={8} disableGrow>
    <span>First line of content inside the expander.</span>
    <span>Second line with a bit more text to show height change.</span>
    <span>Third line so the expanded state is clearly visible.</span>
  </Flex>
);

const ColouredBackground = ({ children }: { children: ReactNode }) => (
  <Tag name="coloured-background" style={{ backgroundColor: '#9a9a9a' }}>
    {children}
  </Tag>
);

export const Collapsed: Story = createStory<typeof Expander>({
  args: {
    isExpanded: false,
  },
  width: 360,
  height: 240,
  render: (props: React.ComponentProps<typeof Expander>) => (
    <ColouredBackground>
      <Expander {...props}>
        {sampleContent}
      </Expander>
    </ColouredBackground>
  ),
});

export const Expanded: Story = createStory<typeof Expander>({
  args: {
    isExpanded: true,
  },
  width: 360,
  height: 240,
  render: (props: React.ComponentProps<typeof Expander>) => (
    <ColouredBackground>
      <Expander {...props}>
        {sampleContent}
      </Expander>
    </ColouredBackground>
  ),
});

export const Toggle: Story = createStory<typeof Expander>({
  args: {
    isExpanded: false,
  },
  width: 360,
  height: 240,
  render: (props: React.ComponentProps<typeof Expander>) => {
    const [isExpanded, setExpanded] = useState(props.isExpanded ?? false);
    const toggle = useBound(() => setExpanded(prev => !prev));
    return (
      <ColouredBackground>
        <Button onSelect={toggle}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
        <Expander {...props} isExpanded={isExpanded}>
          {sampleContent}
        </Expander>
      </ColouredBackground>
    );
  },
});

export const NestedExpanders: Story = createStory<typeof Expander>({
  width: 360,
  height: 320,
  render: () => {
    const [outerOpen, setOuterOpen] = useState(true);
    const [innerOpen, setInnerOpen] = useState(false);
    return (
      <ColouredBackground>
        <Button onSelect={useBound(() => setOuterOpen(v => !v))}>
          {outerOpen ? 'Collapse outer' : 'Expand outer'}
        </Button>
        <Expander isExpanded={outerOpen} debug>
          <Flex isVertical gap={8} style={{ padding: 12, backgroundColor: '#eee', borderRadius: 4 }}>
            <span>Outer expander content</span>
            <Button size="small" onSelect={useBound(() => setInnerOpen(v => !v))}>
              {innerOpen ? 'Collapse inner' : 'Expand inner'}
            </Button>
            <Expander isExpanded={innerOpen}>
              <Flex style={{ padding: 12, backgroundColor: '#ddd', borderRadius: 4 }}>
                Inner expander content
              </Flex>
            </Expander>
          </Flex>
        </Expander>
      </ColouredBackground>
    );
  },
});
