# react-ui — repo overview

> What @anupheaus/react-ui is, what it depends on, and who reads its docs.
>
> Status: accepted · Version 1

## What it is

The shared React component library and hook set (`@anupheaus/react-ui`), built on `common`: `useFields` and `Field`, Card, Dialog and Window, selectors, `useUpdatableState`, validation and `UIState`. Every component has its own `AGENTS.md` guide beside it, and the library ships Storybook.

## Depends on

`common`.

## Who depends on it

`nexus`, `mxdb` and `vision`. Changing a component's props or a hook's return shape opens the docs of those repos in the same change.

## Docs held here

- [React standards](../standards/react-standards.md) — the rules for code that uses this library.
- `docs/patterns/` — the component patterns: `useFields`, [Card, Dialog and Window](../patterns/card-dialog-window.md), [window parameters](../patterns/window-parameters.md), [useUpdatableState](../patterns/use-updatable-state.md), [selectors](../patterns/selector-components.md), [validation and loading](../patterns/validation-and-loading.md) and [render helpers](../patterns/render-helpers.md). These moved here from the `agents` repo because they describe this library.
