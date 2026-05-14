# Tabs Vertical Orientation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `orientation?: 'horizontal' | 'vertical'` to the `Tabs` component so tab buttons can appear on the left side with up/down slide animations.

**Architecture:** A single `orientation` prop is added to `TabsProps` and threaded as a direct prop to the internal `TabButton` and `TabContent` components, which each gain an `orientation` prop. Each component uses a pair of CSS classes (`*Horizontal` / `*Vertical`) to switch direction-dependent styles — no context changes required.

**Tech Stack:** React 18, TypeScript, vitest + @testing-library/react, tss-react (`createStyles`), Storybook 10.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/Tabs/Tab/TabContent.tsx` | Modify | Accept `orientation`; add `tabHorizontal`/`tabVertical` CSS classes; add `slide-up`/`slide-down` CSS classes; update direction logic |
| `src/components/Tabs/Tab/TabButton.tsx` | Modify | Accept `orientation`; split `tabButton` into shared + `tabButtonHorizontal` + `tabButtonVertical` CSS classes |
| `src/components/Tabs/Tabs.tsx` | Modify | Accept and default `orientation`; adjust outer `<Flex>` direction; swap button-bar border and flex direction; pass `orientation` to both children memos |
| `src/components/Tabs/useTabs.tests.tsx` | Modify | Add IntersectionObserver mock + four vertical-orientation integration tests |
| `src/components/Tabs/Tabs.stories.tsx` | Create | Four Storybook stories: Horizontal, Vertical, Programmatic Selection, Always Show Tabs |
| `src/components/Tabs/AGENTS.md` | Modify | Add `orientation` prop row to Tabs Props table |

---

## Task 1: Write failing integration tests

**Files:**
- Modify: `src/components/Tabs/useTabs.tests.tsx`

- [ ] **Step 1: Add IntersectionObserver mock and render-based imports to `useTabs.tests.tsx`**

Replace the top of `src/components/Tabs/useTabs.tests.tsx` with:

```tsx
import React from 'react';
import { act, fireEvent, render, renderHook, waitFor } from '@testing-library/react';
import { useTabs } from './useTabs';

class MockIntersectionObserver {
  observe() { return undefined; }
  unobserve() { return undefined; }
  disconnect() { return undefined; }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
});
```

- [ ] **Step 2: Add the four new test cases at the bottom of the `describe('useTabs', ...)` block**

Append inside the `describe('useTabs', () => { ... })` block, after the existing tests:

```tsx
  describe('vertical orientation', () => {
    function VerticalTabs() {
      const { Tabs, Tab } = useTabs();
      return (
        <Tabs orientation="vertical">
          <Tab label="A">Content A</Tab>
          <Tab label="B">Content B</Tab>
        </Tabs>
      );
    }

    it('outer tabs element is horizontal (no is-vertical class) when orientation="vertical"', async () => {
      const { container } = render(<VerticalTabs />);
      await waitFor(() => {
        const tabsEl = container.querySelector('tabs');
        expect(tabsEl).not.toBeNull();
        expect(tabsEl!.className).not.toContain('is-vertical');
      });
    });

    it('tabs-buttons element has is-vertical class when orientation="vertical"', async () => {
      const { container } = render(<VerticalTabs />);
      await waitFor(() => {
        const buttonsEl = container.querySelector('tabs-buttons');
        expect(buttonsEl).not.toBeNull();
        expect(buttonsEl!.className).toContain('is-vertical');
      });
    });

    it('switching tabs in vertical mode applies slide-up to inactive tab content (not slide-left)', async () => {
      function VerticalTabsWithButton() {
        const { Tabs, Tab, selectTab } = useTabs();
        const goToB = React.useCallback(() => selectTab(1), [selectTab]);
        return (
          <div>
            <Tabs orientation="vertical">
              <Tab label="A">Content A</Tab>
              <Tab label="B">Content B</Tab>
            </Tabs>
            <button onClick={goToB}>Go to B</button>
          </div>
        );
      }
      const { container, getByText } = render(<VerticalTabsWithButton />);
      await waitFor(() => expect(container.querySelectorAll('tab').length).toBeGreaterThan(0));

      act(() => { fireEvent.click(getByText('Go to B')); });

      await waitFor(() => {
        const tabEls = container.querySelectorAll('tab');
        expect(tabEls[0].className).toContain('slide-up');
        expect(tabEls[0].className).not.toContain('slide-left');
        expect(tabEls[1].className).toContain('is-visible');
      });
    });

    it('switching tabs in horizontal mode still applies slide-left (no regression)', async () => {
      function HorizontalTabsWithButton() {
        const { Tabs, Tab, selectTab } = useTabs();
        const goToB = React.useCallback(() => selectTab(1), [selectTab]);
        return (
          <div>
            <Tabs>
              <Tab label="A">Content A</Tab>
              <Tab label="B">Content B</Tab>
            </Tabs>
            <button onClick={goToB}>Go to B</button>
          </div>
        );
      }
      const { container, getByText } = render(<HorizontalTabsWithButton />);
      await waitFor(() => expect(container.querySelectorAll('tab').length).toBeGreaterThan(0));

      act(() => { fireEvent.click(getByText('Go to B')); });

      await waitFor(() => {
        const tabEls = container.querySelectorAll('tab');
        expect(tabEls[0].className).toContain('slide-left');
        expect(tabEls[0].className).not.toContain('slide-up');
      });
    });
  });
```

- [ ] **Step 3: Run the new tests and verify they all FAIL**

```bash
cd C:/code/personal/react-ui
pnpm test -- --reporter=verbose src/components/Tabs/useTabs.tests.tsx
```

Expected: the four new tests under `vertical orientation` each fail with errors like `TypeError: Cannot read properties of undefined` or assertion failures (orientation prop not yet accepted). The existing five tests must still pass.

---

## Task 2: Implement `TabContent` vertical slides

**Files:**
- Modify: `src/components/Tabs/Tab/TabContent.tsx`

- [ ] **Step 1: Replace the `useStyles` definition in `TabContent.tsx`**

Replace the entire `const useStyles = createStyles(...)` block (lines 10–45) with:

```tsx
const useStyles = createStyles(({ windows: { content: { active: contentActive } } }) => ({
  tab: {
    gridRow: '1 / 1',
    gridColumn: '1 / 1',
    opacity: 0,
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: -1,

    '&.is-visible': {
      opacity: 1,
      pointerEvents: 'all',
      zIndex: 0,
    },

    '&.slide-left': {
      marginLeft: -50,
      marginRight: 50,
    },

    '&.slide-right': {
      marginLeft: 50,
      marginRight: -50,
    },

    '&.slide-up': {
      marginTop: -50,
      marginBottom: 50,
    },

    '&.slide-down': {
      marginTop: 50,
      marginBottom: -50,
    },
  },
  tabHorizontal: {
    transitionProperty: 'opacity, margin-left, margin-right',
  },
  tabVertical: {
    transitionProperty: 'opacity, margin-top, margin-bottom',
  },
  tabContent: {
    padding: contentActive.padding,

    '&.no-padding': {
      padding: 0,
    },
  },
}));
```

- [ ] **Step 2: Add `orientation` to the `Props` interface in `TabContent.tsx`**

Replace:

```tsx
interface Props {
  className?: string;
  tabIndex: number;
  state: DistributedState<number>;
  children: ReactNode;
  noPadding?: boolean;
  contentProps?: FlexProps;
}
```

With:

```tsx
interface Props {
  className?: string;
  tabIndex: number;
  state: DistributedState<number>;
  children: ReactNode;
  noPadding?: boolean;
  contentProps?: FlexProps;
  orientation: 'horizontal' | 'vertical';
}
```

- [ ] **Step 3: Update the `TabContent` component body**

Replace the `export const TabContent = createComponent(...)` block with:

```tsx
export const TabContent = createComponent('Tab', ({
  className,
  tabIndex,
  state,
  children,
  noPadding = false,
  contentProps,
  orientation,
}: Props) => {
  const { onChange, get } = useDistributedState(state);
  const { css, join } = useStyles();
  const [isFocused, setIsFocused] = useState(get() === tabIndex);
  const [direction, setDirection] = useState(orientation === 'vertical' ? 'down' : 'right');
  const batchUpdate = useBatchUpdates();

  onChange(newIndex => batchUpdate(() => {
    if (orientation === 'vertical') {
      setDirection(newIndex > tabIndex ? 'up' : 'down');
    } else {
      setDirection(newIndex > tabIndex ? 'left' : 'right');
    }
    setIsFocused(newIndex === tabIndex);
  }));

  return (
    <Flex tagName="tab" className={join(css.tab, orientation === 'vertical' ? css.tabVertical : css.tabHorizontal, !isFocused && `slide-${direction}`, isFocused && 'is-visible')}>
      <Scroller fullHeight>
        <Flex tagName="tab-content-inner" isVertical className={join(css.tabContent, noPadding && 'no-padding', className)} {...contentProps}>
          {children}
        </Flex>
      </Scroller>
    </Flex>
  );
});
```

---

## Task 3: Implement `TabButton` vertical indicator strip

**Files:**
- Modify: `src/components/Tabs/Tab/TabButton.tsx`

- [ ] **Step 1: Replace the `useStyles` definition in `TabButton.tsx`**

Replace the entire `const useStyles = createStyles(...)` block (lines 9–66) with:

```tsx
const useStyles = createStyles(({ tabs: { button } = {}, buttons: { default: { normal: { backgroundColor: activeButtonBackgroundColor } } }, pseudoClasses }, { toPx, applyTransition }) => {
  const stripColor = button?.stripColor ?? activeButtonBackgroundColor ?? 'rgba(0 0 0 / 5%)';
  const stripWidth = toPx(button?.stripWidth, '2px');
  const borderRadius = toPx(button?.borderRadius, '4px');

  return {
    tabButton: {
      [pseudoClasses.tablet]: {
        padding: '16px 24px !important',

        '&.is-focused': {
          backgroundColor: 'rgba(0 0 0 / 5%)',
        },
      },
    },
    tabButtonHorizontal: {
      borderRadius: `${borderRadius} ${borderRadius} 0 0 !important`,

      '&::after': {
        position: 'absolute',
        content: '""',
        inset: 0,
        borderBottomWidth: stripWidth,
        borderBottomColor: 'transparent',
        borderBottomStyle: 'solid',
        ...applyTransition('border-bottom-color'),
      },

      '&.is-focused::after': {
        borderBottomColor: stripColor,
      },
    },
    tabButtonVertical: {
      borderRadius: `${borderRadius} 0 0 ${borderRadius} !important`,

      '&::after': {
        position: 'absolute',
        content: '""',
        inset: 0,
        borderRightWidth: stripWidth,
        borderRightColor: 'transparent',
        borderRightStyle: 'solid',
        ...applyTransition('border-right-color'),
      },

      '&.is-focused::after': {
        borderRightColor: stripColor,
      },
    },
  };
});
```

- [ ] **Step 2: Add `orientation` to the `Props` interface in `TabButton.tsx`**

Replace:

```tsx
interface Props {
  label: ReactNode;
  state: DistributedState<number>;
  tabIndex: number;
  testId?: string;
}
```

With:

```tsx
interface Props {
  label: ReactNode;
  state: DistributedState<number>;
  tabIndex: number;
  testId?: string;
  orientation: 'horizontal' | 'vertical';
}
```

- [ ] **Step 3: Update the `TabButton` component to destructure and apply orientation**

Replace:

```tsx
export const TabButton = createComponent('TabButton', ({
  label,
  state,
  tabIndex,
  testId,
}: Props) => {
  const { css, join, alterTheme } = useStyles();
```

With:

```tsx
export const TabButton = createComponent('TabButton', ({
  label,
  state,
  tabIndex,
  testId,
  orientation,
}: Props) => {
  const { css, join, alterTheme } = useStyles();
```

- [ ] **Step 4: Update the `TabButton` return statement to apply orientation class**

Replace:

```tsx
  return (
    <ThemeProvider theme={buttonTheme}>
      <Button onSelect={selectTab} variant="hover" className={join(css.tabButton, isFocused && 'is-focused')} testId={testId}>{label}</Button>
    </ThemeProvider>
  );
```

With:

```tsx
  return (
    <ThemeProvider theme={buttonTheme}>
      <Button onSelect={selectTab} variant="hover" className={join(css.tabButton, orientation === 'vertical' ? css.tabButtonVertical : css.tabButtonHorizontal, isFocused && 'is-focused')} testId={testId}>{label}</Button>
    </ThemeProvider>
  );
```

---

## Task 4: Wire `orientation` through `Tabs.tsx`

**Files:**
- Modify: `src/components/Tabs/Tabs.tsx`

- [ ] **Step 1: Add `tabsButtonsVertical` to the `useStyles` definition in `Tabs.tsx`**

The current `useStyles` block defines `hidden`, `tabsButtons`, and `tabsContent`. Replace it entirely with:

```tsx
const useStyles = createStyles(({ tabs: { buttons } = {}, buttons: { default: { normal: { backgroundColor: activeButtonBackgroundColor } } } }) => {
  const stripColor = buttons?.stripColor ?? activeButtonBackgroundColor ?? 'rgba(0 0 0 / 5%)';
  const stripWidth = buttons?.stripWidth ?? 1;

  return {
    hidden: {
      display: 'none',
    },
    tabsButtons: {
      position: 'relative',
      borderBottomStyle: 'solid',
      borderBottomWidth: stripWidth,
      borderBottomColor: stripColor,

      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
      },

      '&.is-hidden': {
        display: 'none',
      },
    },
    tabsButtonsVertical: {
      position: 'relative',
      borderRightStyle: 'solid',
      borderRightWidth: stripWidth,
      borderRightColor: stripColor,

      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
      },

      '&.is-hidden': {
        display: 'none',
      },
    },
    tabsContent: {
      display: 'grid',
      position: 'relative',
      gridTemplateColumns: '1fr',
      flexGrow: 1,
      overflow: 'hidden',
    },
  };
});
```

- [ ] **Step 2: Add `orientation` to the `TabsProps` interface**

Replace:

```tsx
export interface TabsProps {
  className?: string;
  children: ReactNode;
  alwaysShowTabs?: boolean;
  onChange?(index: number): void;
}
```

With:

```tsx
export interface TabsProps {
  className?: string;
  children: ReactNode;
  alwaysShowTabs?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onChange?(index: number): void;
}
```

- [ ] **Step 3: Add `orientation` to the internal `Props` interface and destructure it**

Replace:

```tsx
interface Props extends TabsProps {
  state: DistributedState<number>;
}

export const TabsComponent = createComponent('Tabs', ({
  className,
  state,
  alwaysShowTabs = false,
  children,
  onChange: providedOnChange,
}: Props) => {
```

With:

```tsx
interface Props extends TabsProps {
  state: DistributedState<number>;
}

export const TabsComponent = createComponent('Tabs', ({
  className,
  state,
  alwaysShowTabs = false,
  orientation = 'horizontal',
  children,
  onChange: providedOnChange,
}: Props) => {
```

- [ ] **Step 4: Add `orientation` to both `useMemo` arrays for buttons and content**

Replace:

```tsx
  const renderedTabButtons = useMemo(() => tabs.map(({ id, label, testId }, index) => (
    <TabButton key={id} tabIndex={index} state={state} label={label} testId={testId} />
  )), [tabs]);

  const renderedTabs = useMemo(() => tabs.map(({ id, className: tabContentClassName, children: tabContent, noPadding, contentProps }, index) => (
    <TabContent
      key={id}
      className={tabContentClassName}
      tabIndex={index}
      state={state}
      noPadding={noPadding}
      contentProps={contentProps}
    >{tabContent}</TabContent>
  )), [tabs]);
```

With:

```tsx
  const renderedTabButtons = useMemo(() => tabs.map(({ id, label, testId }, index) => (
    <TabButton key={id} tabIndex={index} state={state} label={label} testId={testId} orientation={orientation} />
  )), [tabs, orientation]);

  const renderedTabs = useMemo(() => tabs.map(({ id, className: tabContentClassName, children: tabContent, noPadding, contentProps }, index) => (
    <TabContent
      key={id}
      className={tabContentClassName}
      tabIndex={index}
      state={state}
      noPadding={noPadding}
      contentProps={contentProps}
      orientation={orientation}
    >{tabContent}</TabContent>
  )), [tabs, orientation]);
```

- [ ] **Step 5: Update the JSX return to apply orientation-based layout**

Replace:

```tsx
  return (
    <Flex tagName="tabs" isVertical className={className} maxHeight>
      <Tag name="hidden" className={css.hidden}>
        <TabsContext.Provider value={context}>
          {children}
        </TabsContext.Provider>
      </Tag>
      <Flex tagName="tabs-buttons" disableGrow className={join(css.tabsButtons, isTabsHidden && 'is-hidden')}>
        <UIState isReadOnly={false}>
          {renderedTabButtons}
        </UIState>
      </Flex>
      <Tag name="tabs-content" className={css.tabsContent}>
        {renderedTabs}
      </Tag>
    </Flex>
  );
```

With:

```tsx
  return (
    <Flex tagName="tabs" isVertical={orientation !== 'vertical'} className={className} maxHeight>
      <Tag name="hidden" className={css.hidden}>
        <TabsContext.Provider value={context}>
          {children}
        </TabsContext.Provider>
      </Tag>
      <Flex tagName="tabs-buttons" isVertical={orientation === 'vertical'} disableGrow className={join(orientation === 'vertical' ? css.tabsButtonsVertical : css.tabsButtons, isTabsHidden && 'is-hidden')}>
        <UIState isReadOnly={false}>
          {renderedTabButtons}
        </UIState>
      </Flex>
      <Tag name="tabs-content" className={css.tabsContent}>
        {renderedTabs}
      </Tag>
    </Flex>
  );
```

- [ ] **Step 6: Run all tests and verify they pass**

```bash
cd C:/code/personal/react-ui
pnpm test -- --reporter=verbose src/components/Tabs/useTabs.tests.tsx
```

Expected: all 9 tests pass (5 existing + 4 new). Zero failures.

- [ ] **Step 7: Commit**

```bash
cd C:/code/personal/react-ui
git add src/components/Tabs/Tab/TabContent.tsx src/components/Tabs/Tab/TabButton.tsx src/components/Tabs/Tabs.tsx src/components/Tabs/useTabs.tests.tsx
git commit -m "feat(Tabs): add vertical orientation with left-side tab strip and up/down slide animation"
```

---

## Task 5: Create Storybook stories

**Files:**
- Create: `src/components/Tabs/Tabs.stories.tsx`

- [ ] **Step 1: Create `src/components/Tabs/Tabs.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useTabs } from './useTabs';
import { createStory } from '../../Storybook/createStory';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { useBound } from '../../hooks';

const meta: Meta = {
  title: 'Navigation/Tabs',
};
export default meta;

type Story = StoryObj;

export const Horizontal: Story = createStory({
  width: 600,
  height: 400,
  render: () => {
    const { Tabs, Tab } = useTabs();
    return (
      <Tabs>
        <Tab label="First">Content for the first tab</Tab>
        <Tab label="Second">Content for the second tab</Tab>
        <Tab label="Third">Content for the third tab</Tab>
      </Tabs>
    );
  },
});
Horizontal.name = 'Horizontal (default)';

export const Vertical: Story = createStory({
  width: 600,
  height: 400,
  render: () => {
    const { Tabs, Tab } = useTabs();
    return (
      <Tabs orientation="vertical">
        <Tab label="First">Content for the first tab</Tab>
        <Tab label="Second">Content for the second tab</Tab>
        <Tab label="Third">Content for the third tab</Tab>
      </Tabs>
    );
  },
});
Vertical.name = 'Vertical';

export const ProgrammaticSelection: Story = createStory({
  width: 600,
  height: 460,
  render: () => {
    const { Tabs, Tab, selectTab } = useTabs();
    const goToFirst = useBound(() => selectTab(0));
    const goToSecond = useBound(() => selectTab(1));
    const goToThird = useBound(() => selectTab(2));
    return (
      <Flex isVertical gap={12}>
        <Flex gap={8} disableGrow>
          <Button onSelect={goToFirst} variant="bordered">First</Button>
          <Button onSelect={goToSecond} variant="bordered">Second</Button>
          <Button onSelect={goToThird} variant="bordered">Third</Button>
        </Flex>
        <Tabs>
          <Tab label="First">Content for the first tab</Tab>
          <Tab label="Second">Content for the second tab</Tab>
          <Tab label="Third">Content for the third tab</Tab>
        </Tabs>
      </Flex>
    );
  },
});
ProgrammaticSelection.name = 'Programmatic Selection';

export const AlwaysShowTabs: Story = createStory({
  width: 600,
  height: 400,
  render: () => {
    const { Tabs, Tab } = useTabs();
    return (
      <Tabs alwaysShowTabs>
        <Tab label="Only Tab">Content for the only tab</Tab>
      </Tabs>
    );
  },
});
AlwaysShowTabs.name = 'Always Show Tabs (single tab)';
```

- [ ] **Step 2: Commit**

```bash
cd C:/code/personal/react-ui
git add src/components/Tabs/Tabs.stories.tsx
git commit -m "feat(Tabs): add Storybook stories for Horizontal, Vertical, Programmatic Selection, and Always Show Tabs"
```

---

## Task 6: Update AGENTS.md

**Files:**
- Modify: `src/components/Tabs/AGENTS.md`

- [ ] **Step 1: Add `orientation` row to the Tabs Props table in `src/components/Tabs/AGENTS.md`**

In the `## Tabs Props` table, add a new row after `alwaysShowTabs`:

```markdown
| `orientation` | `'horizontal' \| 'vertical'` | No | Layout direction: `'horizontal'` places tabs above content (default); `'vertical'` places tabs on the left with up/down slide animation |
```

The full updated table should be:

```markdown
## Tabs Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | `Tab` components to render |
| `className` | `string` | No | Additional CSS class for the container |
| `alwaysShowTabs` | `boolean` | No | Show the tab button bar even when there is only one tab or all tabs lack labels (default: `false`) |
| `orientation` | `'horizontal' \| 'vertical'` | No | Layout direction: `'horizontal'` places tabs above content (default); `'vertical'` places tabs on the left with up/down slide animation |
| `onChange` | `(index: number) => void` | No | Called when the active tab changes |
```

- [ ] **Step 2: Commit**

```bash
cd C:/code/personal/react-ui
git add src/components/Tabs/AGENTS.md
git commit -m "docs(Tabs): document orientation prop in AGENTS.md"
```

---

## Self-Review Checklist

- [x] All spec requirements have corresponding tasks
- [x] No TBD/TODO placeholders
- [x] Types consistent: `orientation: 'horizontal' | 'vertical'` used consistently across `TabsProps`, `TabButton Props`, `TabContent Props`
- [x] `tabsButtonsVertical` / `tabButtonHorizontal` / `tabButtonVertical` / `tabHorizontal` / `tabVertical` class names used consistently between definition (Tasks 2–4) and application sites
- [x] `orientation` added to both `useMemo` dependency arrays (`[tabs, orientation]`)
- [x] Four test cases cover: outer layout, button bar direction, slide direction (vertical), no-regression (horizontal)
