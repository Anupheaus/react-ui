import { Meta, StoryObj } from '@storybook/react';
import { StorybookComponent2 } from '../../Storybook';
import { createStyles } from '../../theme';
import { Drawer as DrawerComponent } from './Drawer';
import { useDrawer } from './useDrawer';
import { Button } from '../Button';

const useStyles = createStyles({
  animatingBorder: {
    width: 200,
    height: 50,
  },
});

const meta: Meta<typeof DrawerComponent> = {
  component: DrawerComponent,
  argTypes: {
    title: { type: 'string', name: 'Title' },
  },
};
export default meta;

type Story = StoryObj<typeof DrawerComponent>;

export const Default: Story = {
  args: {
    title: 'My Title',
  },
  render: props => {
    const { css } = useStyles();
    const { Drawer, openDrawer } = useDrawer();

    return (
      <StorybookComponent2 className={css.animatingBorder} showComponentBorders>
        <Button onClick={openDrawer}>Open</Button>
        <Drawer {...props}>
          Hey
        </Drawer>
      </StorybookComponent2>
    );
  },
} satisfies Story;
