import { MapOf } from '@anupheaus/common';
import { ComponentProps, FunctionComponent } from 'react';
import { StorybookComponent, StoryConfig } from '../../Storybook';
import { InternalField, InternalFieldProps } from './InternalField';


interface Props<T = ComponentProps<typeof InternalField>> extends Partial<InternalFieldProps> {
  component: FunctionComponent<T>;
  additionalProps: Partial<T>;
}

function FieldComponent<T extends ComponentProps<typeof InternalField>>({ component: Component, additionalProps, ...otherProps }: Props<T>) {
  return (<Component tagName="div" width={150} label={'Label'} {...additionalProps} {...otherProps} {...{} as any} />);
}

export function generateInternalFieldStories<T extends ComponentProps<typeof InternalField>>(component: FunctionComponent<T>, additionalProps: Partial<T> = {}): MapOf<StoryConfig> {
  return {
    'Standard Props': {
      wrapInStorybookComponent: false,
      component: () => (<>
        <StorybookComponent title="Normal">
          <FieldComponent component={component} additionalProps={additionalProps} />
        </StorybookComponent>

        {/* <StorybookComponent title="With Button">
          <FieldComponent component={component} additionalProps={additionalProps} endAdornments={[<Button key={'help'} icon={icons.help} />]} />
        </StorybookComponent> */}

        <StorybookComponent title="Is Optional">
          <FieldComponent component={component} additionalProps={additionalProps} isOptional />
        </StorybookComponent>

        <StorybookComponent title="With Help">
          <FieldComponent component={component} additionalProps={additionalProps} help={<>This is my help</>} />
        </StorybookComponent>

        <StorybookComponent title="With Assistive Help">
          <FieldComponent component={component} additionalProps={additionalProps} assistiveHelp={<>This is my help</>} />
        </StorybookComponent>

        <StorybookComponent title="With Error">
          <FieldComponent component={component} additionalProps={additionalProps} error={<>This is a required field</>} />
        </StorybookComponent>
      </>),
    },
  };
}
