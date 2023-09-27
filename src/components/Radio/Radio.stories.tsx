import { createComponent } from '../Component';
import { useUpdatableState } from '../../hooks/useUpdatableState';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories, StorybookComponent } from '../../Storybook';
import { ComponentProps } from 'react';
import { ReactListItem } from '../../models';
import { generateInternalFieldStories } from '../InternalField/InternalField.stories.utils';
import { Radio } from './Radio';

const values: ReactListItem[] = [
  { id: '1', text: 'One', iconName: 'grid-refresh' },
  { id: '2', text: 'Two' },
  { id: '3', text: 'Three', iconName: 'number-increase' },
  { id: '4', text: 'Four', iconName: 'number-decrease' },
  { id: '5', text: 'Five' },
  { id: '6', text: 'Six' },
];

const EditableRadio = createComponent('EditableRadio', (props: ComponentProps<typeof Radio>) => {
  const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

  return (
    <Radio label={'Label'} {...props} value={value} values={values} onChange={setValue} />
  );
});

createStories(() => ({
  module,
  name: 'Components/Radio',
  stories: {
    ...generateUIStateStories(props => <EditableRadio {...props} />),
    ...generateInternalFieldStories(EditableRadio),
    'Radio': {
      wrapInStorybookComponent: false,
      component: () => {
        return (<>
          <StorybookComponent title="Short Width">
            <Radio label={'Label'} width={90} values={values} value={'3'} />
          </StorybookComponent>

          <StorybookComponent title="Wide Width">
            <Radio label={'Label'} width={300} values={values} value={'3'} />
          </StorybookComponent>

          <StorybookComponent title="Short Width (Horizontal)">
            <Radio label={'Label'} width={90} values={values} value={'3'} isHorizontal />
          </StorybookComponent>

          <StorybookComponent title="Wide Width (Horizontal)">
            <Radio label={'Label'} width={300} values={values} value={'3'} isHorizontal />
          </StorybookComponent>
        </>);
      },
    },
  },
}));
