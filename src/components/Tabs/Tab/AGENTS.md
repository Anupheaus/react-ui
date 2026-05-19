# Tab (internal registration components)

The internal components that implement the `Tab` registration-and-rendering pattern used by `Tabs`. Do not import from this directory directly — use `useTabs()` from the parent module.

## Overview

`Tab` uses a declarative JSX registration pattern: the `<Tab>` element is written as a child of `<Tabs>`, but it **renders nothing** — it exists solely to register its `label`, `children`, and layout props with `TabsContext`. `Tabs` then reads the registered data and renders the actual tab buttons and content panels itself. This keeps the consumer API clean (JSX children) while giving `Tabs` full control over the DOM structure.

## Contents

- `Tab.tsx` — the `<Tab>` component. On mount, calls `upsertTab` via `TabsContext` to register its props (label, children, className, ordinalPosition, etc.). **Returns `null`** — it produces no DOM output. On unmount, calls `removeTab` to deregister. Re-registers whenever `children`, `label`, or `className` change.
- `TabButton.tsx` — renders the clickable tab button in the button bar. Receives `orientation` to apply either a bottom-strip (horizontal) or right-strip (vertical) active indicator. Not rendered by `Tab` — rendered by `Tabs` from the registered data.
- `TabContent.tsx` — renders the tab content panel. Hidden when not active; applies left/right slide (horizontal) or up/down slide (vertical) CSS transitions. Not rendered by `Tab` — rendered by `Tabs` from the registered data.
- `index.ts` — re-exports `TabComponent` as `Tab`, and exports `TabProps`, `TabButtonProps`, `TabContentProps`.

## Decision rationale

**Why does `Tab` return `null`?**

The registration pattern decouples the *declaration* of a tab from its *rendering*. If `Tab` rendered its own button and content, `Tabs` would have no way to control the tab bar layout (e.g. animated indicator, orientation, `alwaysShowTabs` logic) without complex ref-based coordination. By having `Tab` register data into context and `Tabs` render everything, the rendering logic is centralised in one place.

This also means `ordinalPosition` works naturally — `Tabs` sorts the registered tabs before rendering, which would be impossible if each `Tab` rendered itself at its own DOM position.

## Ambiguities and gotchas

- **`<Tab>` renders `null`** — if you inspect the DOM, you will not find a `tab` element corresponding to `<Tab>`. The rendered output (button + content panel) comes from `Tabs`, not from `Tab`.
- **`Tab` must be a direct child of `Tabs`** — `Tab` reads `TabsContext` and throws `'Tab must be a child of Tabs'` if the context is not valid (`isValid === false`). Wrapping `Tab` in an intermediate component that does not forward the context will cause this error.
- **Children are re-registered on every change** — `Tab` calls `upsertTab` in a `useLayoutEffect` that depends on `[children, label, className]`. If `children` is an inline JSX expression that creates a new reference on every render, `upsertTab` will fire on every parent render. Memoising the children passed to `Tab` prevents unnecessary re-registrations.
- **`ordinalPosition` overrides DOM order** — the tabs are sorted by `ordinalPosition` (if provided) before rendering. A tab declared third in JSX order with `ordinalPosition={0}` will render first. If `ordinalPosition` is not set, insertion order is preserved.

## Related

- [../AGENTS.md](../AGENTS.md) — parent Tabs component: `useTabs` hook, `Tabs` component, full architecture description

---

[← Back to Tabs](../AGENTS.md)
