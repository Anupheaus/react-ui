# SelectorButton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a compact `SelectorButton` component that shows the current selection as a button label and opens the `Selector` UI in a MUI Popover on click.

**Architecture:** Extract `InternalSelector` from the existing `Selector` — the pure section-rendering logic with no `Field` wrapper, skeleton, or validation. Refactor `Selector` to wrap `InternalSelector` with `Field` + validation (unchanged public API). Build `SelectorButton` as a self-contained component: a `Field`-wrapped `Button` trigger + a MUI `Popover` containing `InternalSelector`.

**Tech Stack:** React 18, MUI Popover (`@mui/material`), `@anupheaus/common` array extensions (`mapMany`, `mapWithoutNull`, `removeMany`, `orderBy`, `filterByIds`), `@storybook/react-webpack5`, Jest + `@testing-library/jest-dom` (jsdom), `storybook/test` for Storybook play functions.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/components/Selector/InternalSelector.tsx` | Pure section rendering, owns selected-IDs state, no Field/skeleton/validation |
| Modify | `src/components/Selector/Selector.tsx` | Thin wrapper: Field + InternalSelector + validation |
| Create | `src/components/Selector/SelectorButtonUtils.ts` | Pure logic: `getButtonLabel`, `isSingleSelect` |
| Create | `src/components/Selector/SelectorButton.tsx` | Button trigger + Popover + InternalSelector |
| Create | `src/components/Selector/SelectorButton.stories.tsx` | Storybook stories with play-function interaction tests |
| Create | `src/components/Selector/SelectorButton.tests.tsx` | Jest unit tests for pure logic in SelectorButtonUtils |
| Modify | `src/components/Selector/index.ts` | Export `SelectorButton` |

---

## Task 1: Create InternalSelector

Extract the core rendering logic out of `Selector.tsx` into a new `InternalSelector.tsx`. `InternalSelector` owns the selected-IDs state, renders sections inside a `Scroller`, and calls `onSelect` on every change. It has no `Field` wrapper, no skeleton, no validation.

**Files:**
- Create: `src/components/Selector/InternalSelector.tsx`

- [ ] **Step 1: Create `InternalSelector.tsx`**

```tsx
import { useMemo } from 'react';
import { createComponent } from '../Component';
import type { SelectorItem, SelectorSubItem } from './selector-models';
import type { SelectorSelectionConfiguration } from './Selector';
import { SelectorSection } from './SelectorSection';
import { Flex } from '../Flex';
import { Scroller } from '../Scroller';
import { useUIState } from '../../providers';
import { useBound, useUpdatableState } from '../../hooks';
import { processSelectedItemsWithSections } from './processSelectedItemsWithSections';

const fakeItems: SelectorItem[] = [
  { id: '1', text: 'Item 1', subItems: [{ id: '1-1', text: 'Sub Item 1' }, { id: '1-2', text: 'Sub Item 2' }] },
  { id: '2', text: 'Item 2', subItems: [{ id: '2-1', text: 'Sub Item 1' }, { id: '2-2', text: 'Sub Item 2' }, { id: '2-3', text: 'Sub Item 3' }] },
];

interface Props {
  items: SelectorItem[];
  selectionConfiguration?: SelectorSelectionConfiguration;
  onSelect?(selectedItems: SelectorSubItem[]): void;
}

export const InternalSelector = createComponent('InternalSelector', ({
  items,
  selectionConfiguration,
  onSelect,
}: Props) => {
  const { isLoading } = useUIState();
  const [ids, setIds] = useUpdatableState<string[]>(
    () => items.mapMany(item => item.subItems.mapWithoutNull(subItem => subItem?.isSelected ? subItem.id : undefined)),
    [items],
  );

  const onSelected = useBound((addId: string | undefined, removeIds: string[]) => {
    let newIds = ids.slice().removeMany([...removeIds, ...(addId != null ? [addId] : [])]);
    if (addId != null) newIds = newIds.concat(addId);
    if (selectionConfiguration != null) {
      const { totalSelectableItems, maxSectionsWithSelectableItems } = selectionConfiguration;
      if (totalSelectableItems != null && newIds.length > totalSelectableItems) newIds = newIds.slice(newIds.length - totalSelectableItems);
      if (maxSectionsWithSelectableItems != null) newIds = processSelectedItemsWithSections(newIds, maxSectionsWithSelectableItems, items);
    }
    setIds(newIds);
    onSelect?.(items.mapMany(item => item.subItems).filterByIds(newIds));
  });

  const sections = useMemo(() => {
    const itemsToRender = isLoading && items.length === 0 ? fakeItems : items;
    return itemsToRender.orderBy('ordinal').map(item => {
      const selectedIds = ids.filter(id => item.subItems.findById(id) != null);
      return (
        <SelectorSection key={item.id} item={item} hideHeader={items.length === 1} selectedIds={selectedIds} onSelect={onSelected} />
      );
    });
  }, [items, isLoading, ids]);

  return (
    <Scroller>
      <Flex tagName="selector-items" isVertical gap="fields">
        {sections}
      </Flex>
    </Scroller>
  );
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Selector/InternalSelector.tsx
git commit -m "feat(selector): add InternalSelector — pure rendering without Field/validation"
```

---

## Task 2: Refactor Selector to wrap InternalSelector

Replace the body of `Selector.tsx` with a thin wrapper that delegates rendering to `InternalSelector` and handles only `Field` + validation concerns. The public API (`SelectorSelectionConfiguration`, `Selector` component props) stays identical.

**Files:**
- Modify: `src/components/Selector/Selector.tsx`

- [ ] **Step 1: Replace `Selector.tsx` with the thin wrapper**

```tsx
import { createComponent } from '../Component';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import type { SelectorItem, SelectorSubItem } from './selector-models';
import { Flex } from '../Flex';
import { useValidation } from '../../providers';
import { useBound, useUpdatableState } from '../../hooks';
import { useListStyles } from '../List/ListStyles';
import { InternalSelector } from './InternalSelector';

export interface SelectorSelectionConfiguration {
  totalSelectableItems?: number;
  maxSectionsWithSelectableItems?: number;
}

interface Props extends FieldProps {
  items: SelectorItem[];
  selectionConfiguration?: SelectorSelectionConfiguration;
  height?: string | number;
  fullHeight?: boolean;
  onSelect?(selectedItems: SelectorSubItem[]): void;
}

export const Selector = createComponent('Selector', ({
  items,
  selectionConfiguration,
  isOptional,
  requiredMessage,
  height,
  fullHeight,
  onSelect,
  ...props
}: Props) => {
  const { css } = useListStyles();
  const [selectedCount, setSelectedCount] = useUpdatableState<number>(
    () => items.mapMany(item => item.subItems).filter(si => si.isSelected === true).length,
    [items],
  );
  const { validate } = useValidation();

  const { error, enableErrors } = validate(({ validateRequired }) =>
    validateRequired(selectedCount > 0 ? 1 : undefined, isOptional !== true, requiredMessage ?? 'Please select at least one item'),
  );

  const handleSelect = useBound((selectedItems: SelectorSubItem[]) => {
    setSelectedCount(selectedItems.length);
    onSelect?.(selectedItems);
    enableErrors();
  });

  return (
    <Field
      tagName="selector"
      disableRipple
      skeleton="outlineOnly"
      {...props}
      disableOverflow
      height={height}
      className={css.list}
      containerClassName={css.listContainer}
      error={error ?? props.error}
    >
      <Flex tagName="selector-items" isVertical gap="fields">
        <InternalSelector items={items} selectionConfiguration={selectionConfiguration} onSelect={handleSelect} />
      </Flex>
    </Field>
  );
});
```

- [ ] **Step 2: Run Storybook to visually verify Selector stories still work**

Start Storybook with `pnpm start` and check the Selector stories (`Loading`, `WithData`, `WithOneSectionOfData`). The selector should look and behave exactly as before. Stop Storybook when done.

- [ ] **Step 3: Commit**

```bash
git add src/components/Selector/Selector.tsx
git commit -m "refactor(selector): delegate rendering to InternalSelector"
```

---

## Task 3: Create SelectorButtonUtils + Jest tests

Extract the two pure logic functions (`getButtonLabel`, `isSingleSelect`) into a testable utility file. Write and pass all unit tests before implementing `SelectorButton`.

**Files:**
- Create: `src/components/Selector/SelectorButtonUtils.ts`
- Create: `src/components/Selector/SelectorButton.tests.tsx`

- [ ] **Step 1: Write the failing tests first**

Create `src/components/Selector/SelectorButton.tests.tsx`:

```tsx
import { getButtonLabel, isSingleSelect } from './SelectorButtonUtils';
import type { SelectorItem } from './selector-models';

describe('getButtonLabel', () => {
  it('returns "Not Set" when no items are selected', () => {
    expect(getButtonLabel([])).toBe('Not Set');
  });

  it('returns the item text when one item is selected', () => {
    expect(getButtonLabel([{ id: '1', text: 'Window' }])).toBe('Window');
  });

  it('prefers label over text when one item is selected and label is a string', () => {
    expect(getButtonLabel([{ id: '1', text: 'Window', label: 'A Window' }])).toBe('A Window');
  });

  it('returns "2 selected" when two items are selected', () => {
    expect(getButtonLabel([{ id: '1', text: 'A' }, { id: '2', text: 'B' }])).toBe('2 selected');
  });

  it('returns "n selected" for any count greater than 1', () => {
    expect(getButtonLabel([
      { id: '1', text: 'A' },
      { id: '2', text: 'B' },
      { id: '3', text: 'C' },
    ])).toBe('3 selected');
  });
});

describe('isSingleSelect', () => {
  it('returns true when totalSelectableItems is 1', () => {
    expect(isSingleSelect([], { totalSelectableItems: 1 })).toBe(true);
  });

  it('returns false when totalSelectableItems is greater than 1', () => {
    expect(isSingleSelect([], { totalSelectableItems: 2 })).toBe(false);
  });

  it('returns true when there is exactly one section with maxSelectableItems of 1', () => {
    const items: SelectorItem[] = [
      { id: '1', text: 'Category', maxSelectableItems: 1, subItems: [] },
    ];
    expect(isSingleSelect(items)).toBe(true);
  });

  it('returns false when there are multiple sections even if one has maxSelectableItems of 1', () => {
    const items: SelectorItem[] = [
      { id: '1', text: 'Category A', maxSelectableItems: 1, subItems: [] },
      { id: '2', text: 'Category B', subItems: [] },
    ];
    expect(isSingleSelect(items)).toBe(false);
  });

  it('returns false when one section has no maxSelectableItems restriction', () => {
    const items: SelectorItem[] = [
      { id: '1', text: 'Category', subItems: [] },
    ];
    expect(isSingleSelect(items)).toBe(false);
  });

  it('returns false when no config and multiple sections', () => {
    const items: SelectorItem[] = [
      { id: '1', text: 'A', subItems: [] },
      { id: '2', text: 'B', subItems: [] },
    ];
    expect(isSingleSelect(items)).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail (module not found)**

```bash
pnpm test-ci 2>&1 | tail -30
```

Expected: FAIL — `Cannot find module './SelectorButtonUtils'`

- [ ] **Step 3: Create `SelectorButtonUtils.ts`**

```ts
import type { ReactNode } from 'react';
import type { SelectorItem, SelectorSubItem } from './selector-models';
import type { SelectorSelectionConfiguration } from './Selector';

export function getButtonLabel(selectedItems: SelectorSubItem[]): ReactNode {
  if (selectedItems.length === 0) return 'Not Set';
  if (selectedItems.length === 1) return selectedItems[0].label ?? selectedItems[0].text;
  return `${selectedItems.length} selected`;
}

export function isSingleSelect(items: SelectorItem[], config?: SelectorSelectionConfiguration): boolean {
  if (config?.totalSelectableItems === 1) return true;
  if (items.length === 1 && items[0].maxSelectableItems === 1) return true;
  return false;
}
```

- [ ] **Step 4: Run tests to verify they all pass**

```bash
pnpm test-ci 2>&1 | tail -30
```

Expected: All `getButtonLabel` and `isSingleSelect` tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Selector/SelectorButtonUtils.ts src/components/Selector/SelectorButton.tests.tsx
git commit -m "feat(selector): add SelectorButtonUtils with unit tests"
```

---

## Task 4: Implement SelectorButton

Build the `SelectorButton` component: a `Field`-wrapped `Button` trigger that opens a MUI `Popover` containing `InternalSelector`. The button label reflects selection state. In single-select mode the popover auto-closes on pick.

**Files:**
- Create: `src/components/Selector/SelectorButton.tsx`

- [ ] **Step 1: Create `SelectorButton.tsx`**

```tsx
import { useRef, useState } from 'react';
import { Popover } from '@mui/material';
import { createComponent } from '../Component';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { Button } from '../Button';
import type { SelectorItem, SelectorSubItem } from './selector-models';
import type { SelectorSelectionConfiguration } from './Selector';
import { InternalSelector } from './InternalSelector';
import { getButtonLabel, isSingleSelect } from './SelectorButtonUtils';
import { useBound, useUpdatableState } from '../../hooks';

interface Props extends FieldProps {
  items: SelectorItem[];
  selectionConfiguration?: SelectorSelectionConfiguration;
  onSelect?(selectedItems: SelectorSubItem[]): void;
}

export const SelectorButton = createComponent('SelectorButton', ({
  items,
  selectionConfiguration,
  onSelect,
  ...props
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [selectedItems, setSelectedItems] = useUpdatableState<SelectorSubItem[]>(
    () => items.mapMany(item => item.subItems.filter(si => si.isSelected === true)),
    [items],
  );

  const openPopover = useBound(() => setIsOpen(true));
  const closePopover = useBound(() => setIsOpen(false));

  const handleSelect = useBound((newSelectedItems: SelectorSubItem[]) => {
    setSelectedItems(newSelectedItems);
    onSelect?.(newSelectedItems);
    if (isSingleSelect(items, selectionConfiguration)) setIsOpen(false);
  });

  const label = getButtonLabel(selectedItems);

  return (
    <>
      <Field tagName="selector-button" {...props}>
        <Button ref={buttonRef} onClick={openPopover} align="left">
          {label}
        </Button>
      </Field>
      <Popover
        open={isOpen}
        anchorEl={buttonRef.current}
        onClose={closePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <InternalSelector items={items} selectionConfiguration={selectionConfiguration} onSelect={handleSelect} />
      </Popover>
    </>
  );
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Selector/SelectorButton.tsx
git commit -m "feat(selector): implement SelectorButton with popover and auto-close"
```

---

## Task 5: Export SelectorButton

Add `SelectorButton` to the Selector barrel export.

**Files:**
- Modify: `src/components/Selector/index.ts`

- [ ] **Step 1: Update `index.ts`**

```ts
export * from './Selector';
export * from './SelectorButton';
export * from './selector-models';
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Selector/index.ts
git commit -m "chore(selector): export SelectorButton"
```

---

## Task 6: Create SelectorButton Storybook stories

Create stories covering the five scenarios. The interaction stories use `play` functions with `storybook/test`. Because MUI `Popover` renders in a portal appended to `document.body`, popover content must be queried from `within(document.body)`, not from `canvas`.

**Files:**
- Create: `src/components/Selector/SelectorButton.stories.tsx`

- [ ] **Step 1: Create `SelectorButton.stories.tsx`**

```tsx
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
```

- [ ] **Step 2: Run Storybook and verify all five stories render correctly**

Start Storybook: `pnpm start`. Check each story:
- **Not Set** — button displays "Not Set"
- **Pre-Selected** — button displays "Window"
- **Single Select** — run the play function via the Interactions panel; confirm button shows "Window" and popover closes
- **Multi Select** — run the play function; confirm "Window" → "2 selected" and popover stays open
- **Loading** — button shows skeleton

Stop Storybook when satisfied.

- [ ] **Step 3: Commit**

```bash
git add src/components/Selector/SelectorButton.stories.tsx
git commit -m "feat(selector): add SelectorButton Storybook stories with play-function interaction tests"
```

---

## Task 7: Final verification

Run all tests and confirm everything is green.

- [ ] **Step 1: Run Jest tests**

```bash
pnpm test-ci 2>&1 | tail -20
```

Expected: All `getButtonLabel` and `isSingleSelect` tests PASS. No regressions.

- [ ] **Step 2: Confirm no TypeScript errors**

```bash
pnpm findDeclarationErrors 2>&1 | tail -20
```

Expected: No errors.

- [ ] **Step 3: Done**

The implementation is complete. The public surface added:
- `SelectorButton` component (exported from `src/components/Selector/index.ts`)
- `InternalSelector` (internal, not exported)
- `SelectorButtonUtils` (internal, not exported)
