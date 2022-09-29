import { pureFC } from '../../anuxComponents';
import { PropsOf } from '../../extensions';
import { createStories, StoryConfig } from '../../Storybook';
import { StorybookComponent } from '../../Storybook/StorybookComponent';
import { Flex } from './Flex';

const FixedFlex = pureFC<PropsOf<typeof Flex>>()('FixedFlex', props => (
  <Flex {...props} fixedSize />
));

const generateSamples = (additionalProps: Partial<PropsOf<typeof Flex>> = {}): StoryConfig => ({
  wrapInStorybookComponent: false,
  component: () => (<>
    <StorybookComponent title="Standard">
      <Flex {...additionalProps}>
        <FixedFlex>A</FixedFlex>
        <FixedFlex>B</FixedFlex>
        <FixedFlex>C</FixedFlex>
      </Flex>
    </StorybookComponent>

    <StorybookComponent title="Gap: 8">
      <Flex {...additionalProps} gap={8}>
        <FixedFlex>A</FixedFlex>
        <FixedFlex>B</FixedFlex>
        <FixedFlex>C</FixedFlex>
      </Flex>
    </StorybookComponent>

    <StorybookComponent title="Aligned Centrally">
      <Flex {...additionalProps} size={100} alignCentrally gap={12}>
        <FixedFlex>A</FixedFlex>
        <FixedFlex>B</FixedFlex>
        <FixedFlex>C</FixedFlex>
      </Flex>
    </StorybookComponent>

    <StorybookComponent title="Horizontal Aligned Left, Vertically Aligned Middle">
      <Flex {...additionalProps} size={100} align="left" valign="center" gap={12}>
        <FixedFlex>A</FixedFlex>
        <FixedFlex>B</FixedFlex>
        <FixedFlex>C</FixedFlex>
      </Flex>
    </StorybookComponent>

    <StorybookComponent title="Horizontal Aligned Centrally, Vertically Aligned Top">
      <Flex {...additionalProps} size={100} align="center" valign="top" gap={12}>
        <FixedFlex>A</FixedFlex>
        <FixedFlex>B</FixedFlex>
        <FixedFlex>C</FixedFlex>
      </Flex>
    </StorybookComponent>

    <StorybookComponent title="Horizontal Aligned Right, Vertically Aligned Bottom">
      <Flex {...additionalProps} size={100} align="right" valign="bottom" gap={12}>
        <FixedFlex>A</FixedFlex>
        <FixedFlex>B</FixedFlex>
        <FixedFlex>C</FixedFlex>
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
