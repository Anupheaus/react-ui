# Vision docs

Architecture decisions, patterns and coding standards. Each doc is short and covers one topic: scan this index, then open only the docs your task touches. Every folder also has an `index.md` describing what's in it.

These files are maintained by the Architect agent in Forge and synced from there, so edits made here by hand will be overwritten. To change or record a decision, tell any Forge agent; it goes to the Architect.

## [Standards](standards/index.md)

React rules for code using this library: one component per file, no inline JSX callbacks, styles or maps.

- [React standards](standards/react-standards.md): React rules: one component per file, no inline JSX callbacks, styles, maps or object props.

## [Patterns](patterns/index.md)

Component patterns of this library: useFields, Card/Dialog/Window, window parameters, selectors, validation, render helpers.

- [Card, Dialog and Window responsibilities](patterns/card-dialog-window.md): Cards present, Dialogs own ephemeral record state, Windows take an id and fetch, persisting across reloads.
- [Lift JSX-returning helpers into components](patterns/render-helpers.md): A function that returns JSX is a component: define it at module level or in a sibling file, never inside another component.
- [Selector components own their collection](patterns/selector-components.md): A selector takes value and onChange, fetches its own options, and builds list items with useMemo and toListItems.
- [Use useFields for record editing](patterns/use-fields.md): Wire record fields declaratively with useFields and its Field component instead of one useBound callback per field.
- [Keep local state in sync with useUpdatableState](patterns/use-updatable-state.md): useUpdatableState resolves provided, previous then default state and reacts to a prop changing while mounted.
- [Validation and loading states](patterns/validation-and-loading.md): Use useValidation with ValidateSection for input errors, and UIState with isLoading before rendering data-dependent children.
- [Window parameters must be primitives](patterns/window-parameters.md): Window parameters are persisted and deserialised, so pass only primitives and fetch the record by id inside the window.

## [Guides](guides/index.md)

What this repo is, what it depends on and who depends on it.

- [react-ui — repo overview](guides/repo-overview.md): What @anupheaus/react-ui is, what it depends on, and who reads its docs.
