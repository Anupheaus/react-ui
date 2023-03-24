import { createComponent } from '../Component';
import { useUpdatableState } from '../../hooks/useUpdatableState';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { createStories, StorybookComponent } from '../../Storybook';
import { ComponentProps } from 'react';
import { DropDown } from './DropDown';
import { ReactListItem } from '../../models';
import { generateInternalFieldStories } from '../InternalField/InternalField.stories.utils';

const values: ReactListItem[] = [
  { id: '1', text: 'One', iconName: 'grid-refresh' },
  { id: '2', text: 'Two' },
  { id: '3', text: 'Three', iconName: 'number-increase' },
  { id: '4', text: 'Four', iconName: 'number-decrease' },
  { id: '5', text: 'Five' },
  { id: '6', text: 'Six' },
];

const EditableDropDown = createComponent('EditableDropDown', (props: ComponentProps<typeof DropDown>) => {
  const [value, setValue] = useUpdatableState(() => props.value, [props.value]);

  return (
    <DropDown label={'Label'} {...props} value={value} values={values} onChange={setValue} />
  );
});

createStories(() => ({
  module,
  name: 'Components/DropDown',
  stories: {
    ...generateUIStateStories(props => <EditableDropDown {...props} />),
    ...generateInternalFieldStories(EditableDropDown),
    'DropDown': {
      wrapInStorybookComponent: false,
      component: () => {
        return (<>
          <StorybookComponent title="Short Width">
            <DropDown label={'Label'} width={90} values={values} value={'3'} />
          </StorybookComponent>

          <StorybookComponent title="Wide Width">
            <DropDown label={'Label'} width={300} values={values} value={'3'} />
          </StorybookComponent>
        </>);
      },
    },
  },
}));
