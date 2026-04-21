# Agent instructions

## Before making changes

- **Read**: `c:/code/personal/agents/global-agent.md`

When working in this repository, **read the `agent.md` file at the root of the `@anupheaus/common` package** for information on how to leverage its tools and utilities.

- If the package is installed via the package manager, that file is at **`node_modules/@anupheaus/common/agent.md`**.
- If you are in a monorepo or have the common repo as a sibling, use the root of that repository.

Follow the guidance in that file when using or integrating with `@anupheaus/common` in this codebase.

## Codebase navigation

The codebase is documented through a hierarchy of `AGENTS.md` files. Start here and follow links to any section or component.

| Directory | AGENTS.md | What's inside |
|-----------|-----------|---------------|
| `src/components/` | [AGENTS.md](src/components/AGENTS.md) | All UI components, grouped by category |
| `src/hooks/` | [AGENTS.md](src/hooks/AGENTS.md) | React hooks for state, async, DOM, and utilities |
| `src/providers/` | [AGENTS.md](src/providers/AGENTS.md) | Context providers for API, locale, validation, and more |
| `src/theme/` | [AGENTS.md](src/theme/AGENTS.md) | Theming system — `createStyles`, `ThemesProvider`, `useTheme` |
| `src/errors/` | [AGENTS.md](src/errors/AGENTS.md) | Error boundaries, display components, and `useErrors` |
| `src/models/` | [AGENTS.md](src/models/AGENTS.md) | `ReactListItem` — the core item type for all list/table/grid components |
| `src/extensions/` | [AGENTS.md](src/extensions/AGENTS.md) | Global prototype extensions for `HTMLElement`/`Document` and React `is` predicates |
| `types/` | _(inline)_ | TypeScript declaration stubs for `anux-chai`, `anux-react`, `anux-theme` |

## AGENTS.md freshness

Whenever changes are made to this codebase — new components, hooks, providers, modified APIs, renamed files, changed behaviour — the relevant `AGENTS.md` files **must be updated to reflect those changes**. Documentation that contradicts or omits current behaviour is worse than no documentation.

- If you add or remove a prop, update the props table in the component's AGENTS.md.
- If you add a new hook or component, add an AGENTS.md for it and add an entry to the relevant section index AGENTS.md.
- If you change how something works, update the description and examples.
- If you delete something, remove it from all AGENTS.md files that reference it.

## Styling

Always use `createStyles` and `className` to apply styles to elements. Never use inline `style` props to set CSS values. Define all styles in a `useStyles = createStyles({...})` hook at the top of the file and apply them via `className={css.myClass}`.

## Component-specific guidance

- **Windows** (`src/components/Windows/AGENTS.md`): Draggable windows, `useWindow`, `createWindow`, persistence.
- **Dialogs** (`src/components/Dialog/AGENTS.md`): Modal dialogs, `useDialog`, `createDialog`, `useConfirmationDialog`.

