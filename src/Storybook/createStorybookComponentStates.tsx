import { AnyObject } from '@anupheaus/common';
import { StoryContext, StoryObj } from '@storybook/react';
import { UIState } from '../providers';
import { StorybookComponent } from './StorybookComponent2';
import { Flex } from '../components';
import { ReactNode } from 'react';

const states = {
  'Normal': {},
  'Loading': { isLoading: true },
  'Read Only': { isReadOnly: true },
  'Loading Read Only': { isLoading: true, isReadOnly: true },
  'Compact': { isCompact: true },
  'Loading Compact': { isLoading: true, isCompact: true },
  'Read Only Compact': { isReadOnly: true, isCompact: true },
  'Loading Read Only Compact': { isLoading: true, isReadOnly: true, isCompact: true },
};

interface GenerateStatesProps {
  props: AnyObject;
  context: AnyObject;
  render(props: AnyObject, context: any): ReactNode;
  nameSuffix?: string;
  width?: string | number;
  height?: string | number;
}

function generateStates({ props, context, render, nameSuffix, width, height }: GenerateStatesProps) {
  return Object.entries(states).map(([name, state], index) => (
    <StorybookComponent key={index} {...props} width={width} height={height} title={`${[name, nameSuffix].removeNull().join(' ')}`}>
      <UIState {...state}>
        {render(props, context)}
      </UIState>
    </StorybookComponent>
  ));
}

type NewStoryObj<P extends AnyObject> = StoryObj<P> & {
  includeError?: boolean;
  width?: string | number;
  height?: string | number;
};

export function createStorybookComponentStates<P extends AnyObject>(story: NewStoryObj<P>) {
  const { includeError, width, height } = story;
  story.args = {
    ...story.args,

    showComponentBorders: true,
  };
  story.argTypes = {
    ...story.argTypes,
    showComponentBorders: {
      type: 'boolean',
      name: 'Show Component Borders?',
    },
  };
  const config = {
    ...story,
    render: (props: P, context: StoryContext) => {
      const render = story.render ?? (() => null);
      const withoutErrors = generateStates({ props, context, render, width, height });
      const withErrors = includeError === true ? generateStates({
        props: { ...props, error: 'This is an error!' }, context, render,
        nameSuffix: ' with Error', width, height
      }) : null;

      return (
        <Flex tagName="multiple-components" isVertical gap={24} disableGrow width="min-content">
          {withoutErrors}
          {withErrors}
        </Flex>
      );
    },
  } as StoryObj<P>;
  config.storyName = story.storyName ?? 'UI States';
  return config;
}