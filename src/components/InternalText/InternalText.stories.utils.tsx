import { MapOf } from '@anupheaus/common';
import { FunctionComponent } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import { useUpdatableState } from '../../hooks/useUpdatableState';
import { StorybookComponent, StoryConfig } from '../../Storybook';
import { createThemeIcons } from '../../theme';
import { Button } from '../Button';
import { InternalTextProps } from './InternalText';

const icons = createThemeIcons({
  help: FiHelpCircle,
});

interface Props<T = InternalTextProps> extends Partial<InternalTextProps> {
  component: FunctionComponent<T>;
  additionalProps: Partial<T>;
}

function EditableComponent<T extends InternalTextProps>({ component: Component, additionalProps, ...otherProps }: Props<T>) {
  const [value, setValue] = useUpdatableState(() => additionalProps.value, [additionalProps.value]);

  return (<Component width={150} label={'Label'} {...additionalProps} {...otherProps} value={value} onChange={setValue} {...{} as any} />);
}

export function generateInternalTextStories<T extends InternalTextProps>(component: FunctionComponent<T>, additionalProps: Partial<T> = {}): MapOf<StoryConfig> {
  return {
    'Standard Props': {
      wrapInStorybookComponent: false,
      component: () => (<>
        <StorybookComponent title="Normal">
          <EditableComponent component={component} additionalProps={additionalProps} />
        </StorybookComponent>

        <StorybookComponent title="With Button">
          <EditableComponent component={component} additionalProps={additionalProps} endAdornments={[<Button key={'help'} icon={icons.help} />]} />
        </StorybookComponent>

        <StorybookComponent title="Is Optional">
          <EditableComponent component={component} additionalProps={additionalProps} isOptional />
        </StorybookComponent>

        <StorybookComponent title="With Help">
          <EditableComponent component={component} additionalProps={additionalProps} help={<>This is my help</>} />
        </StorybookComponent>

        <StorybookComponent title="With Assistive Help">
          <EditableComponent component={component} additionalProps={additionalProps} assistiveHelp={<>This is my help</>} />
        </StorybookComponent>

        <StorybookComponent title="With Error">
          <EditableComponent component={component} additionalProps={additionalProps} error={<>This is a required field</>} />
        </StorybookComponent>
      </>),
    },
  };
}
