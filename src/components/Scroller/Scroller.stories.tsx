import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Scroller } from './Scroller';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';

const useStyles = createStyles({
  scroller: {
    backgroundColor: 'white',
  },
});

const meta: Meta<typeof Scroller> = {
  component: Scroller,
};
export default meta;

type Story = StoryObj<typeof Scroller>;

export const defaultStory: Story = {
  name: 'Default',
  args: {},
  render: (props: React.ComponentProps<typeof Scroller>) => (
    <Flex width={500} height={500}>
      <Scroller {...props}>
        <Flex width={1000}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet diam velit. Pellentesque lobortis at lectus eget tincidunt. Curabitur feugiat lacus a est tincidunt consequat. Nulla quis faucibus erat. Ut ex augue, aliquam sed lorem et, efficitur faucibus tortor. Duis pulvinar libero eu massa molestie bibendum. Etiam laoreet nibh nec porttitor fringilla. Nulla malesuada ut felis vitae pulvinar. Maecenas urna ex, pulvinar nec mattis quis, faucibus nec quam. Suspendisse semper, dui quis convallis eleifend, ante erat tempus velit, quis ullamcorper dolor eros et leo. Quisque dapibus fermentum aliquam. Donec dictum maximus leo, vitae sagittis nulla consequat non. Donec venenatis ipsum at tortor vestibulum egestas.
        </Flex>
      </Scroller>
    </Flex>
  ),
};

export const smallerContent: Story = {
  name: 'Smaller content',
  args: {},
  render: (props: React.ComponentProps<typeof Scroller>) => {
    const { css } = useStyles();
    return (
      <Flex width={500} height={500} style={{ backgroundColor: 'red' }}>
        <Scroller {...props} className={css.scroller}>
          <Flex width={1000}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla dapibus, nisl in congue egestas, justo lectus varius lorem, ut gravida nisi dui in sapien. Aenean blandit orci quam, at venenatis mauris vestibulum in. Pellentesque sit amet felis eget lacus placerat consequat id tempus turpis. Vestibulum ante nibh, porttitor eget risus sit amet, bibendum convallis nunc. Pellentesque eu maximus diam. Cras ac elit vitae purus vulputate ullamcorper et in libero. Integer at fringilla nibh, vitae convallis nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi et quam arcu. Nunc venenatis mauris non consectetur tincidunt. Mauris elit sem, viverra id dictum ac, vulputate a enim. Morbi eu luctus ligula. Donec gravida, felis semper hendrerit porttitor, velit elit tincidunt nisi, vel pharetra est metus eget purus. Suspendisse consequat sodales odio vitae gravida.
          </Flex>
        </Scroller>
      </Flex>
    );
  },
};

export const smallerContentWithMinFullHeightStory: Story = {
  name: 'Smaller content with full height',
  args: {},
  render: (props: React.ComponentProps<typeof Scroller>) => {
    const { css } = useStyles();
    return (
      <Flex width={500} height={500} style={{ backgroundColor: 'red' }}>
        <Scroller {...props} className={css.scroller} fullHeight>
          <Flex width={1000}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla dapibus, nisl in congue egestas, justo lectus varius lorem, ut gravida nisi dui in sapien. Aenean blandit orci quam, at venenatis mauris vestibulum in. Pellentesque sit amet felis eget lacus placerat consequat id tempus turpis. Vestibulum ante nibh, porttitor eget risus sit amet, bibendum convallis nunc. Pellentesque eu maximus diam. Cras ac elit vitae purus vulputate ullamcorper et in libero. Integer at fringilla nibh, vitae convallis nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi et quam arcu. Nunc venenatis mauris non consectetur tincidunt. Mauris elit sem, viverra id dictum ac, vulputate a enim. Morbi eu luctus ligula. Donec gravida, felis semper hendrerit porttitor, velit elit tincidunt nisi, vel pharetra est metus eget purus. Suspendisse consequat sodales odio vitae gravida.
          </Flex>
        </Scroller>
      </Flex>
    );
  },
};
