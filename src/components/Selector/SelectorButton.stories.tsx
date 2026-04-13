import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, within } from 'storybook/test';
import { SelectorButton } from './SelectorButton';
import { UIState } from '../../providers/UIStateProvider';
import { createStory } from '../../Storybook/createStory';
import type { SelectorItem } from './selector-models';

const singleSelectItems: SelectorItem[] = [
  {
    id: '1', text: 'Furniture', subItems: [
      { id: '1-1', text: 'Window', iconName: 'window-maximize' },
      { id: '1-2', text: 'Door', iconName: 'drawer-close' },
      { id: '1-3', text: 'Sofa', iconName: 'calendar' },
    ],
  },
];

const multiSelectItems: SelectorItem[] = [
  {
    id: '1', text: 'Furniture', subItems: [
      { id: '1-1', text: 'Window' },
      { id: '1-2', text: 'Door' },
    ],
  },
  {
    id: '2', text: 'Appliances', subItems: [
      { id: '2-1', text: 'Fridge' },
      { id: '2-2', text: 'Oven' },
    ],
  },
];

const meta: Meta<typeof SelectorButton> = {
  component: SelectorButton,
};
export default meta;

type Story = StoryObj<typeof SelectorButton>;

// Shows "Not Set" when nothing is pre-selected
export const NotSet: Story = createStory<typeof SelectorButton>({
  width: 300,
  render: () => <SelectorButton label="Select an item" items={multiSelectItems} />,
});
NotSet.name = 'Not Set';

// Pre-selected items: button renders the pre-selected text on load
export const PreSelected: Story = createStory<typeof SelectorButton>({
  width: 300,
  render: () => (
    <SelectorButton
      label="Pre-selected item"
      items={[{
        id: '1', text: 'Furniture', subItems: [
          { id: '1-1', text: 'Window', isSelected: true },
          { id: '1-2', text: 'Door' },
        ],
      }]}
    />
  ),
});
PreSelected.name = 'Pre-Selected';

// Single-select: picking an item closes the popover immediately
export const SingleSelect: Story = createStory<typeof SelectorButton>({
  width: 300,
  render: () => (
    <SelectorButton
      label="Select furniture"
      items={singleSelectItems}
      selectionConfiguration={{ totalSelectableItems: 1 }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    // Open the popover
    const button = canvas.getByRole('button');
    await userEvent.click(button);

    // Popover content is in a MUI portal — query from document.body
    const body = within(document.body);
    const windowItem = await body.findByText('Window');
    await userEvent.click(windowItem);

    // Popover should have closed; button label should update
    await expect(button).toHaveTextContent('Window');
    await expect(body.queryByText('Door')).toBeNull();
  },
});
SingleSelect.name = 'Single Select (auto-closes)';

// Multi-select: popover stays open; label updates to "n selected"
export const MultiSelect: Story = createStory<typeof SelectorButton>({
  width: 300,
  render: () => <SelectorButton label="Select items" items={multiSelectItems} />,
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button');
    await userEvent.click(button);

    const body = within(document.body);

    // Select first item — label shows item text
    const windowItem = await body.findByText('Window');
    await userEvent.click(windowItem);
    await expect(button).toHaveTextContent('Window');

    // Select second item — label shows "2 selected", popover still open
    const doorItem = body.getByText('Door');
    await userEvent.click(doorItem);
    await expect(button).toHaveTextContent('2 selected');
    await expect(body.getByText('Fridge')).toBeInTheDocument();
  },
});
MultiSelect.name = 'Multi Select (stays open)';

// Loading state: button shows skeleton, cannot be interacted with
export const Loading: Story = createStory<typeof SelectorButton>({
  width: 300,
  render: () => (
    <UIState isLoading>
      <SelectorButton label="Loading state" items={[]} />
    </UIState>
  ),
});
Loading.name = 'Loading';
