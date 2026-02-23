import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { StorybookComponent } from '../../Storybook/StorybookComponent2';
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
  render: (props: React.ComponentProps<typeof DrawerComponent>) => {
    const { css } = useStyles();
    const { Drawer, openDrawer } = useDrawer();
    return (
      <StorybookComponent className={css.animatingBorder} showComponentBorders>
        <Button onClick={openDrawer}>Open</Button>
        <Drawer {...props}>
          Hey
        </Drawer>
      </StorybookComponent>
    );
  },
};
