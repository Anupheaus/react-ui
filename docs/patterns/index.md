# Patterns

Component patterns of this library: useFields, Card/Dialog/Window, window parameters, selectors, validation, render helpers.

## Docs

- [Card, Dialog and Window responsibilities](card-dialog-window.md): Cards present, Dialogs own ephemeral record state, Windows take an id and fetch, persisting across reloads.
- [Lift JSX-returning helpers into components](render-helpers.md): A function that returns JSX is a component: define it at module level or in a sibling file, never inside another component.
- [Selector components own their collection](selector-components.md): A selector takes value and onChange, fetches its own options, and builds list items with useMemo and toListItems.
- [Use useFields for record editing](use-fields.md): Wire record fields declaratively with useFields and its Field component instead of one useBound callback per field.
- [Keep local state in sync with useUpdatableState](use-updatable-state.md): useUpdatableState resolves provided, previous then default state and reacts to a prop changing while mounted.
- [Validation and loading states](validation-and-loading.md): Use useValidation with ValidateSection for input errors, and UIState with isLoading before rendering data-dependent children.
- [Window parameters must be primitives](window-parameters.md): Window parameters are persisted and deserialised, so pass only primitives and fetch the record by id inside the window.
