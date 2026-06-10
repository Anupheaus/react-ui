import type { Meta, StoryObj } from '@storybook/react-webpack5';
import type { ReactListItem } from '../../models';
import type { FieldProps } from '../Field';
import { createStorybookComponentStates } from '../../Storybook/createStorybookComponentStates';
import { useUpdatableState } from '../../hooks';
import { ToggleButtonGroup } from './ToggleButtonGroup';

const meta: Meta<typeof ToggleButtonGroup> = {
  component: ToggleButtonGroup,
};
export default meta;

// Flat story props: ToggleButtonGroup's real props are a single/multi discriminated union, which Storybook's
// StoryObj distributes into an awkward union of annotations. The render functions below hand the component the
// correctly-typed value/onChange, so the stories only need a flat shape to drive args.
interface StoryProps extends FieldProps {
  items?: ReactListItem[];
  value?: string | string[];
  onChange?(value: string | string[]): void;
}

type Story = StoryObj<StoryProps>;

const items: ReactListItem[] = [
  { id: 'list', text: 'List' },
  { id: 'grid', text: 'Grid' },
  { id: 'table', text: 'Table' },
];

const singleConfig = (additionalProps: Partial<StoryProps> = {}): Story => ({
  args: {
    label: 'View',
    value: 'grid',
  },
  render: (props: StoryProps) => {
    const [value, setValue] = useUpdatableState<string | undefined>(() => props.value as string | undefined, [props.value]);
    return (
      <ToggleButtonGroup {...props} {...additionalProps} value={value} onChange={setValue} items={items} />
    );
  },
});

const multiConfig = (additionalProps: Partial<StoryProps> = {}): Story => ({
  args: {
    label: 'Views',
    value: ['grid', 'table'],
  },
  render: (props: StoryProps) => {
    const [value, setValue] = useUpdatableState<string[]>(() => (props.value as string[] | undefined) ?? [], [props.value]);
    return (
      <ToggleButtonGroup {...props} {...additionalProps} value={value} onChange={setValue} items={items} />
    );
  },
});

const emptyConfig = (): Story => ({
  args: {
    label: 'View',
    isOptional: true,
  },
  // value/onChange are irrelevant with no items; drop them so the props resolve to the single-select branch.
  render: ({ value: _value, onChange: _onChange, ...props }: StoryProps) => (
    <ToggleButtonGroup {...props} items={[]} />
  ),
});

const waitForStoryReady = async () => {
  await new Promise(r => setTimeout(r, 200));
};

export const UIStates: Story = createStorybookComponentStates<StoryProps>({ ...singleConfig(), includeError: true });
UIStates.name = 'UI States';
UIStates.play = waitForStoryReady;

export const UIStatesWide: Story = createStorybookComponentStates<StoryProps>({ ...singleConfig({ wide: true }), includeError: true });
UIStatesWide.name = 'UI States (Wide)';
UIStatesWide.play = waitForStoryReady;

export const MultiSelect: Story = createStorybookComponentStates<StoryProps>({ ...multiConfig(), includeError: true });
MultiSelect.name = 'Multi Select';
MultiSelect.play = waitForStoryReady;

// No items (e.g. while the items are still being fetched). The loading state shows the field content skeleton.
export const Empty: Story = createStorybookComponentStates<StoryProps>({ ...emptyConfig(), includeError: true });
Empty.name = 'Empty';
Empty.play = waitForStoryReady;
