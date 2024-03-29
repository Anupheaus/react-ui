import { Meta, StoryObj } from '@storybook/react';
import { AnimatingBorder } from './AnimatingBorder';
import { StorybookComponent } from '../../Storybook';
import { createStyles } from '../../theme';

const useStyles = createStyles({
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
      <StorybookComponent className={css.animatingBorder} showComponentBorders>
        <AnimatingBorder {...props} />
      </StorybookComponent>
    );
  },
} satisfies Story;
