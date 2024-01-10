import { Meta, StoryObj } from '@storybook/react';
import { AnimatingBorder } from './AnimatingBorder';
import { StorybookComponent2 } from '../../Storybook';
import { createStyles2 } from '../../theme';

const useStyles = createStyles2({
  animatingBorder: {
    width: 200,
    height: 50,
  },
});

const meta: Meta<typeof AnimatingBorder> = {
  component: AnimatingBorder,
};
export default meta;

type Story = StoryObj<typeof AnimatingBorder>;

export const Default: Story = {
  args: {
    isEnabled: true,
  },
  render: props => {
    const { css } = useStyles();
    return (
      <StorybookComponent2 className={css.animatingBorder} showComponentBorders>
        <AnimatingBorder {...props} />
      </StorybookComponent2>
    );
  },
} satisfies Story;
