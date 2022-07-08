import { ComponentProps } from 'react';
import { createStories, StoryConfig } from '../../Storybook';
import { StorybookComponent } from '../../Storybook/StorybookComponent';
import { Flex } from './Flex';

const generateSamples = (additionalProps: Partial<ComponentProps<typeof Flex>> = {}): StoryConfig => ({
  wrapInStorybookComponent: false,
  component: () => (<>
    <StorybookComponent title="Standard">
      <Flex {...additionalProps}>
        <Flex>A</Flex>
        <Flex>B</Flex>
        <Flex>C</Flex>
      </Flex>
    </StorybookComponent>

    <StorybookComponent title="Gap: 8">
      <Flex {...additionalProps} gap={8}>
        <Flex>A</Flex>
        <Flex>B</Flex>
        <Flex>C</Flex>
      </Flex>
    </StorybookComponent>

    <StorybookComponent title="Aligned Centrally">
      <Flex {...additionalProps} size={100} alignCentrally gap={12}>
        <Flex>A</Flex>
        <Flex>B</Flex>
        <Flex>C</Flex>
      </Flex>
    </StorybookComponent>

    <StorybookComponent title="Horizontal Aligned Left, Vertically Aligned Middle">
      <Flex {...additionalProps} size={100} align="left" valign="center" gap={12}>
        <Flex>A</Flex>
        <Flex>B</Flex>
        <Flex>C</Flex>
      </Flex>
    </StorybookComponent>

    <StorybookComponent title="Horizontal Aligned Centrally, Vertically Aligned Top">
      <Flex {...additionalProps} size={100} align="center" valign="top" gap={12}>
        <Flex>A</Flex>
        <Flex>B</Flex>
        <Flex>C</Flex>
      </Flex>
    </StorybookComponent>

    <StorybookComponent title="Horizontal Aligned Right, Vertically Aligned Bottom">
      <Flex {...additionalProps} size={100} align="right" valign="bottom" gap={12}>
        <Flex>A</Flex>
        <Flex>B</Flex>
        <Flex>C</Flex>
      </Flex>
    </StorybookComponent>
  </>),
});

createStories(() => ({
  module,
  name: 'Components/Flex',
  stories: {
    'Horizontal': generateSamples(),
    'Vertical': generateSamples({ isVertical: true }),
  },
}));
