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
| [Components](src/components/README.md) | All UI components, grouped by category |
| [Hooks](src/hooks/README.md) | React hooks for state, async, DOM, and utilities |
| [Providers](src/providers/README.md) | Context providers for API, locale, validation, and more |
| [Theme](src/theme/README.md) | Theming system — createTheme, createStyles, ThemesProvider |
| [Errors](src/errors/README.md) | Error boundaries, hooks, and display components |

`src/models/` exports `ReactListItem` and related types used throughout the library. `src/extensions/` provides polyfills and global extensions.

## Development

```bash
pnpm install
pnpm start          # Storybook on port 6006
pnpm run build      # Production build
pnpm run test-ci    # Run tests
```

## Agent instructions

See [agent.md](agent.md) for instructions on working in this codebase, including the README freshness rule.

## License

Apache-2.0
