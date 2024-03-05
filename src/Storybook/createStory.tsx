import { Args, StoryObj } from '@storybook/react';
import { StorybookComponent } from './StorybookComponent2';

type StoryConfig<TMetaOrCmpOrArgs = Args> = StoryObj<TMetaOrCmpOrArgs> & {
  width?: number | string;
  height?: number | string;
};

export function createStory<TMetaOrCmpOrArgs = Args>(config: StoryConfig<TMetaOrCmpOrArgs>): StoryObj<TMetaOrCmpOrArgs> {
  return {
    ...config,
    argTypes: {
      ...config.argTypes,
      showComponentBorders: { type: 'boolean', name: 'Show Test Borders?', defaultValue: true },
    },
    args: {
      ...config.args,
      showComponentBorders: true,
    },
    render: (props: any, context: any) => (
      <StorybookComponent showComponentBorders={props.showComponentBorders} width={config.width} height={config.height}>
        {config.render?.(props, context) ?? null}
      </StorybookComponent>
    ),
  };
}
