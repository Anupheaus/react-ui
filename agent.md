# Agent instructions

## Before making changes

- **Read**: `c:/code/personal/agents/global-agent.md`

When working in this repository, **read the `agent.md` file at the root of the `@anupheaus/common` package** for information on how to leverage its tools and utilities.

- If the package is installed via the package manager, that file is at **`node_modules/@anupheaus/common/agent.md`**.
- If you are in a monorepo or have the common repo as a sibling, use the root of that repository.

Follow the guidance in that file when using or integrating with `@anupheaus/common` in this codebase.

## Codebase navigation

The codebase is documented through a hierarchy of `README.md` files. Start at [README.md](README.md) and follow links to any section or component. Every component, hook, and provider folder has its own README.

## README freshness

Whenever changes are made to this codebase — new components, hooks, providers, modified APIs, renamed files, changed behaviour — the relevant `README.md` files **must be updated to reflect those changes**. Documentation that contradicts or omits current behaviour is worse than no documentation.

- If you add or remove a prop, update the props table in the component's README.
- If you add a new hook or component, add a README for it and add an entry to the relevant section index README.
- If you change how something works, update the description and examples.
- If you delete something, remove it from all READMEs that reference it.

## Component-specific guidance

- **Windows** (`src/components/Windows/README.md`): Draggable windows, `useWindow`, `createWindow`, persistence.
- **Dialogs** (`src/components/Dialog/README.md`): Modal dialogs, `useDialog`, `createDialog`, `useConfirmationDialog`.

