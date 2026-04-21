# @anupheaus/react-ui

[![Publish Package](https://github.com/Anupheaus/react-ui/actions/workflows/publish.yml/badge.svg)](https://github.com/Anupheaus/react-ui/actions/workflows/publish.yml)
[![Coverage](https://codecov.io/gh/Anupheaus/react-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/Anupheaus/react-ui)
[![Version](https://img.shields.io/github/v/tag/Anupheaus/react-ui?label=version)](https://github.com/Anupheaus/react-ui/releases)
[![License](https://img.shields.io/github/license/Anupheaus/react-ui)](LICENSE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

React component library built on MUI, Emotion, and `@anupheaus/common`. Provides draggable windows, modal dialogs, forms, tables, configurators, and UI primitives.

## Codebase navigation

Browse documentation by section — each README links further down to individual components, hooks, and providers:

| Section | Description |
|---------|-------------|
| [Components](src/components/AGENTS.md) | All UI components, grouped by category |
| [Hooks](src/hooks/AGENTS.md) | React hooks for state, async, DOM, and utilities |
| [Providers](src/providers/AGENTS.md) | Context providers for API, locale, validation, and more |
| [Theme](src/theme/AGENTS.md) | Theming system — createTheme, createStyles, ThemesProvider |
| [Errors](src/errors/AGENTS.md) | Error boundaries, hooks, and display components |
| [Models](src/models/AGENTS.md) | `ReactListItem` — core item type for all list/table/grid components |
| [Extensions](src/extensions/AGENTS.md) | Global `HTMLElement`/`Document` extensions and React `is` predicates |

## Development

```bash
pnpm install
pnpm start          # Storybook on port 6006
pnpm run build      # Production build
pnpm run test-ci    # Run tests
```

## Known limitations and non-goals

- **React 18 only** — no React 17 or 19 support.
- **Browser-only** — `src/extensions/` patches browser globals; SSR is not supported.
- **MUI v5** — pinned to `@mui/material ^5.x`. MUI v6/v7 will require a breaking upgrade.
- **No virtualisation for Configurator** — unlike `List` and `Table`, `Configurator` renders all rows. Avoid passing large datasets.
- **`simulateEvent` on `Document`** — only mouse events are supported; keyboard/pointer/touch events are silently ignored.

## Related repos

| Repo | Role |
|------|------|
| [`@anupheaus/common`](https://github.com/Anupheaus/common) | Utility library this package depends on: `is`, `ListItem`, `DataPagination`, `Object.extendPrototype`, and more |
| [`socket-api`](https://github.com/Anupheaus/socket-api) | WebSocket server used with `ApiProvider` for real-time data |

## Troubleshooting

**Components render without styles / unstyled flash**
Ensure `ThemesProvider` wraps your app. `createStyles` depends on the theme context; without it styles are empty.

**`onRequest` is called repeatedly / infinite loop**
The `onRequest` callback must be stable (wrap in `useCallback`). A new function reference on each render triggers a re-request.

**List / Table shows stale data after a mutation**
Call `actions.refresh()` via the `actions` prop after writing. The components do not subscribe to external state.

**Draggable windows lose position on remount**
Position persistence requires `UIStateProvider` to be mounted with a `storageKey`. Without it, window positions are in-memory only and reset on unmount.

**`is.theme` returns false for a custom theme**
`LegacyTheme` requires `{ id, definition, createVariant }`. If your theme object is missing `createVariant` (a function), the predicate returns false.

## Agent instructions

See [AGENTS.md](AGENTS.md) for instructions on working in this codebase.

## License

Apache-2.0
