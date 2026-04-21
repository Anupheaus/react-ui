# README Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a complete, navigable README hierarchy so any component, hook, or provider can be understood by following links from the root README downward.

**Architecture:** Tasks 1–8 are structural files written sequentially. Tasks 9–18 are independent batches that can run in parallel once structural tasks are done. Task 19 is a final consistency pass. All READMEs link up to their parent index; all indexes link down to their children.

**Tech Stack:** Markdown only. No source code changes. All existing AGENTS.md files are replaced by AGENTS.md equivalents.

---

## Shared templates (reference these in every batch task)

### Component README template

```markdown
# ComponentName

One-to-three sentence description of what this component does and when to use it.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `propName` | `type` | Yes/No | What it does. |

## Usage

```tsx
import { ComponentName } from '@anupheaus/react-ui';

<ComponentName prop="value" />
```

## Architecture *(include only for complex components with multiple sub-files)*

Brief explanation of how the internal pieces fit together.

| File | Role |
|------|------|
| `ComponentName.tsx` | Root component |

---

[← Back to Components](../AGENTS.md)
```

### Hook README template

```markdown
# hookName

One-to-two sentence description of what this hook does.

## Signature

```ts
function hookName(param: ParamType): ReturnType
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param` | `ParamType` | Yes | What it is. |

## Returns

Description of what is returned (or a table of returned properties if an object).

## Usage

```tsx
import { hookName } from '@anupheaus/react-ui';

const result = hookName(param);
```

---

[← Back to Hooks](../AGENTS.md)
```

### Provider README template

```markdown
# ProviderName

One-to-two sentence description of what this provider supplies and when to mount it.

## When to mount

Where in the component tree this should be placed and any ordering requirements.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `prop` | `type` | Yes/No | What it does. |

## Consuming

How to access the provided value (hook name, context name, etc.).

```tsx
import { useProviderHook } from '@anupheaus/react-ui';

const value = useProviderHook();
```

---

[← Back to Providers](../AGENTS.md)
```

---

## Task 1: Update root AGENTS.md

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Replace the contents of AGENTS.md with the following**

```markdown
# @anupheaus/react-ui

[![Publish Package](https://github.com/Anupheaus/react-ui/actions/workflows/publish.yml/badge.svg)](https://github.com/Anupheaus/react-ui/actions/workflows/publish.yml)

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
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: update root README to link to section READMEs"
```

---

## Task 2: Write src/components/AGENTS.md

**Files:**
- Create: `src/components/AGENTS.md`

- [ ] **Step 1: Write src/components/AGENTS.md with the following content**

```markdown
# Components

All UI components in this library, grouped by category. Each component name links to its own README.

[← Back to root](../../AGENTS.md)

---

## Layout

| Component | Description |
|-----------|-------------|
| [Flex](Flex/AGENTS.md) | Flexbox layout wrapper with theme-aware gap and direction props |
| [Grid](Grid/AGENTS.md) | CSS grid layout wrapper |
| [Section](Section/AGENTS.md) | Titled content section with optional collapsing |
| [Scroller](Scroller/AGENTS.md) | Scrollable container with optional shadow indicators |
| [StickyHideHeader](StickyHideHeader/AGENTS.md) | Header that sticks to top and hides on scroll down |
| [Expander](Expander/AGENTS.md) | Animated expand/collapse container |
| [Fader](Fader/AGENTS.md) | Fades content in/out based on a visible prop |
| [AnimatingBorder](AnimatingBorder/AGENTS.md) | Animated glowing border effect |
| [Ripple](Ripple/AGENTS.md) | Material-style ripple effect for clickable elements |
| [Component](Component/AGENTS.md) | Base component wrapper with common style utilities |

## Windows & Dialogs

| Component | Description |
|-----------|-------------|
| [Windows](Windows/AGENTS.md) | Draggable, resizable application windows with persistence |
| [Dialog](Dialog/AGENTS.md) | Modal dialogs with createDialog / useDialog / useConfirmationDialog |

## Forms & Inputs

| Component | Description |
|-----------|-------------|
| [Form](Form/AGENTS.md) | Form container with validation, dirty tracking, and useForm hook |
| [Field](Field/AGENTS.md) | Form field wrapper providing label, error, and assistive text |
| [Text](Text/AGENTS.md) | Text input |
| [Password](Password/AGENTS.md) | Password input with show/hide toggle |
| [Number](Number/AGENTS.md) | Numeric input with formatting |
| [Email](Email/AGENTS.md) | Email address input |
| [PhoneNumber](PhoneNumber/AGENTS.md) | Phone number input with formatting |
| [PIN](PIN/AGENTS.md) | PIN / OTP digit-by-digit input |
| [Checkbox](Checkbox/AGENTS.md) | Checkbox input |
| [Radio](Radio/AGENTS.md) | Radio button input |
| [Switch](Switch/AGENTS.md) | Toggle switch input |
| [ToggleButtonGroup](ToggleButtonGroup/AGENTS.md) | Group of mutually exclusive toggle buttons |
| [InternalText](InternalText/AGENTS.md) | Internal base text input used by Text, Password, Email, etc. |

## Pickers & Selectors

| Component | Description |
|-----------|-------------|
| [Autocomplete](Autocomplete/AGENTS.md) | Searchable dropdown with async item loading |
| [DropDown](DropDown/AGENTS.md) | Standard dropdown/select |
| [InternalDropDown](InternalDropDown/AGENTS.md) | Internal base dropdown used by DropDown, Autocomplete, etc. |
| [Selector](Selector/AGENTS.md) | SelectorButton popover picker for selecting from a list |
| [DatePicker](DatePicker/AGENTS.md) | Date picker with calendar popover |
| [Calendar](Calendar/AGENTS.md) | Standalone calendar component |

## Data Display

| Component | Description |
|-----------|-------------|
| [Table](Table/AGENTS.md) | Request-based data table with sortable columns and row actions |
| [Configurator](Configurator/AGENTS.md) | Hierarchical data-grid with expandable rows and slice columns |
| [List](List/AGENTS.md) | Virtualised list of ReactListItems |
| [InternalList](InternalList/AGENTS.md) | Internal request-based list engine used by Table and List |
| [SimpleList](SimpleList/AGENTS.md) | Non-virtualised simple list |
| [Matrix](Matrix/AGENTS.md) | Two-dimensional matrix/grid display |
| [ReadOnlyValue](ReadOnlyValue/AGENTS.md) | Formatted read-only display of a single value |

## Navigation

| Component | Description |
|-----------|-------------|
| [Tabs](Tabs/AGENTS.md) | Tab bar with animated tab indicator |
| [Menu](Menu/AGENTS.md) | Popup context menu |
| [Drawer](Drawer/AGENTS.md) | Slide-in side drawer |
| [Toolbar](Toolbar/AGENTS.md) | Horizontal toolbar container |
| [ActionsToolbar](ActionsToolbar/AGENTS.md) | Toolbar for primary/secondary action buttons |
| [Titlebar](Titlebar/AGENTS.md) | Application title bar |
| [UserProfileMenu](UserProfileMenu/AGENTS.md) | User avatar button with profile dropdown menu |

## Feedback

| Component | Description |
|-----------|-------------|
| [Button](Button/AGENTS.md) | Primary action button with variants and loading state |
| [Busy](Busy/AGENTS.md) | Loading overlay / spinner |
| [Skeleton](Skeleton/AGENTS.md) | Placeholder skeleton for loading states |
| [Tooltip](Tooltip/AGENTS.md) | Hover tooltip |
| [HelpInfo](HelpInfo/AGENTS.md) | Help icon with tooltip/popover |
| [Notifications](Notifications/AGENTS.md) | Toast notification system |
| [ModalLoader](ModalLoader/AGENTS.md) | Full-screen modal loading indicator |
| [SplashScreen](SplashScreen/AGENTS.md) | Application splash/loading screen |
| [FloatingActionButton](FloatingActionButton/AGENTS.md) | Floating action button (FAB) |
| [Countdown](Countdown/AGENTS.md) | Animated countdown display |

## Surfaces

| Component | Description |
|-----------|-------------|
| [Avatar](Avatar/AGENTS.md) | User avatar image or initials |
| [Badge](Badge/AGENTS.md) | Numeric badge overlay |
| [Tag](Tag/AGENTS.md) | Coloured tag/label chip |
| [Chips](Chips/AGENTS.md) | Set of removable chip inputs |
| [Image](Image/AGENTS.md) | Image with loading and error states |
| [Icon](Icon/AGENTS.md) | Icon component using the built-in icon set |

## Typography & Misc

| Component | Description |
|-----------|-------------|
| [Label](Label/AGENTS.md) | Styled text label |
| [AssistiveLabel](AssistiveLabel/AGENTS.md) | Assistive/helper text below inputs |
| [Typography](Typography/AGENTS.md) | Text with theme-driven variant styles |
| [Carousel](Carousel/AGENTS.md) | Horizontally scrolling carousel |
| [ParallaxScrollers](ParallaxScrollers/AGENTS.md) | Parallax scrolling effect container |
| [DragAndDrop](DragAndDrop/AGENTS.md) | Drag-and-drop list reordering |
| [SignInDialog](SignInDialog/AGENTS.md) | Pre-built sign-in dialog with reCAPTCHA |
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AGENTS.md
git commit -m "docs: add components section index README"
```

---

## Task 3: Write src/hooks/AGENTS.md

**Files:**
- Create: `src/hooks/AGENTS.md`
- Read before writing: each hook's `index.ts` or main `.ts` file for a one-line summary

- [ ] **Step 1: Read the following files to gather one-line descriptions for each hook**

For each folder under `src/hooks/`, read the main hook file (the `.ts` file matching the folder name, e.g. `src/hooks/useAsync/useAsync.ts` or `src/hooks/useAsync/index.ts`). Extract what the hook does in one sentence.

Folders to read:
`useActions`, `useAPIGridRequest`, `useAsync`, `useBatchUpdates`, `useBooleanState`, `useBound`, `useBrowserInfo`, `useCallbacks`, `useDebounce`, `useDistributedState`, `useDOMRef`, `useDrag`, `useDragAndDrop`, `useEventIsolator`, `useFileUploader`, `useForceUpdate`, `useId`, `useInterval`, `useItems`, `useMap`, `useObservable`, `useObserver`, `useOnChange`, `useOnDOMChange`, `useOnMount`, `useOnResize`, `useOnUnmount`, `usePromise`, `useRecaptcha`, `useRef`, `useSet`, `useStorage`, `useSyncState`, `useTimeout`, `useToggleState`, `useUpdatableState`

- [ ] **Step 2: Write src/hooks/AGENTS.md**

Use this structure, filling in accurate one-line descriptions from the source files read above:

```markdown
# Hooks

All React hooks exported by this library. Each hook name links to its own README.

[← Back to root](../../AGENTS.md)

---

## State

| Hook | Description |
|------|-------------|
| [useBooleanState](useBooleanState/AGENTS.md) | *one-line description from source* |
| [useToggleState](useToggleState/AGENTS.md) | *one-line description* |
| [useUpdatableState](useUpdatableState/AGENTS.md) | *one-line description* |
| [useSyncState](useSyncState/AGENTS.md) | *one-line description* |
| [useDistributedState](useDistributedState/AGENTS.md) | *one-line description* |
| [useSet](useSet/AGENTS.md) | *one-line description* |
| [useMap](useMap/AGENTS.md) | *one-line description* |

## Async & Data

| Hook | Description |
|------|-------------|
| [useAsync](useAsync/AGENTS.md) | *one-line description* |
| [usePromise](usePromise/AGENTS.md) | *one-line description* |
| [useItems](useItems/AGENTS.md) | *one-line description* |
| [useAPIGridRequest](useAPIGridRequest/AGENTS.md) | *one-line description* |
| [useStorage](useStorage/AGENTS.md) | *one-line description* |
| [useObservable](useObservable/AGENTS.md) | *one-line description* |
| [useObserver](useObserver/AGENTS.md) | *one-line description* |

## DOM & Layout

| Hook | Description |
|------|-------------|
| [useRef](useRef/AGENTS.md) | *one-line description* |
| [useDOMRef](useDOMRef/AGENTS.md) | *one-line description* |
| [useOnResize](useOnResize/AGENTS.md) | *one-line description* |
| [useOnDOMChange](useOnDOMChange/AGENTS.md) | *one-line description* |

## Lifecycle

| Hook | Description |
|------|-------------|
| [useOnMount](useOnMount/AGENTS.md) | *one-line description* |
| [useOnUnmount](useOnUnmount/AGENTS.md) | *one-line description* |
| [useOnChange](useOnChange/AGENTS.md) | *one-line description* |
| [useForceUpdate](useForceUpdate/AGENTS.md) | *one-line description* |

## Timing

| Hook | Description |
|------|-------------|
| [useDebounce](useDebounce/AGENTS.md) | *one-line description* |
| [useInterval](useInterval/AGENTS.md) | *one-line description* |
| [useTimeout](useTimeout/AGENTS.md) | *one-line description* |

## Events & Callbacks

| Hook | Description |
|------|-------------|
| [useBound](useBound/AGENTS.md) | *one-line description* |
| [useCallbacks](useCallbacks/AGENTS.md) | *one-line description* |
| [useActions](useActions/AGENTS.md) | *one-line description* |
| [useBatchUpdates](useBatchUpdates/AGENTS.md) | *one-line description* |
| [useEventIsolator](useEventIsolator/AGENTS.md) | *one-line description* |

## Drag & Interaction

| Hook | Description |
|------|-------------|
| [useDrag](useDrag/AGENTS.md) | *one-line description* |
| [useDragAndDrop](useDragAndDrop/AGENTS.md) | *one-line description* |

## Utilities

| Hook | Description |
|------|-------------|
| [useId](useId/AGENTS.md) | *one-line description* |
| [useBrowserInfo](useBrowserInfo/AGENTS.md) | *one-line description* |
| [useFileUploader](useFileUploader/AGENTS.md) | *one-line description* |
| [useRecaptcha](useRecaptcha/AGENTS.md) | *one-line description* |
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/AGENTS.md
git commit -m "docs: add hooks section index README"
```

---

## Task 4: Write src/providers/AGENTS.md

**Files:**
- Create: `src/providers/AGENTS.md`
- Read before writing: main provider file in each of these folders: `ApiProvider`, `LocaleProvider`, `LoggerProvider`, `RecordsProvider`, `SubscriptionProvider`, `UIStateProvider`, `ValidationProvider`

- [ ] **Step 1: Read each provider's main `.tsx` file to understand what it provides**

For each folder, read the primary file (e.g. `ApiProvider/ApiProvider.tsx`) and note: what context/value it provides, what props it accepts, and what hook consumes it.

- [ ] **Step 2: Write src/providers/AGENTS.md**

```markdown
# Providers

Context providers exported by this library. Mount these high in your component tree as needed. Each provider name links to its own README.

[← Back to root](../../AGENTS.md)

---

| Provider | Description |
|----------|-------------|
| [ApiProvider](ApiProvider/AGENTS.md) | *one-line description from source* |
| [LocaleProvider](LocaleProvider/AGENTS.md) | *one-line description* |
| [LoggerProvider](LoggerProvider/AGENTS.md) | *one-line description* |
| [RecordsProvider](RecordsProvider/AGENTS.md) | *one-line description* |
| [SubscriptionProvider](SubscriptionProvider/AGENTS.md) | *one-line description* |
| [UIStateProvider](UIStateProvider/AGENTS.md) | *one-line description* |
| [ValidationProvider](ValidationProvider/AGENTS.md) | *one-line description* |
```

- [ ] **Step 3: Commit**

```bash
git add src/providers/AGENTS.md
git commit -m "docs: add providers section index README"
```

---

## Task 5: Write src/theme/AGENTS.md

**Files:**
- Create: `src/theme/AGENTS.md`
- Read before writing: `src/theme/index.ts`, `src/theme/createTheme.tsx`, `src/theme/createStyles.tsx`, `src/theme/themeModels.ts`, `src/theme/ThemesProvider-old.tsx`, `src/theme/useTheme.ts`

- [ ] **Step 1: Read the theme files listed above**

Understand: how `createTheme` works, what `createStyles` / `createStyles2` do, how `ThemesProvider` and `ThemeProvider2` are used, what `useTheme` / `useThemeMixer` return.

- [ ] **Step 2: Write src/theme/AGENTS.md**

Use this structure:

```markdown
# Theme

The theming system for this library. Built on MUI and Emotion, extended with custom theme tokens and style utilities.

[← Back to root](../../AGENTS.md)

---

## Overview

*2–3 sentences describing the overall mental model: how themes are created, how they're provided, how components consume them.*

## Key exports

| Export | Description |
|--------|-------------|
| `createTheme` | *description* |
| `createStyles` | *description* |
| `createStyles2` | *description* |
| `ThemesProvider` | *description* |
| `ThemeProvider2` | *description* |
| `createRootThemeProvider` | *description* |
| `useTheme` | *description* |
| `useThemeMixer` | *description* |
| `mergeThemes` | *description* |
| `createAnimationKeyFrame` | *description* |
| `colors` | *description* |
| `themes` | *description* |

## Usage

*Show a minimal example of creating a theme and wrapping the app.*

```tsx
// example from source/stories
```
```

- [ ] **Step 3: Commit**

```bash
git add src/theme/AGENTS.md
git commit -m "docs: add theme section README"
```

---

## Task 6: Write src/errors/AGENTS.md

**Files:**
- Create: `src/errors/AGENTS.md`
- Read before writing: `src/errors/index.ts`, `src/errors/ErrorBoundary.tsx`, `src/errors/useErrors.ts`, `src/errors/models.ts`

- [ ] **Step 1: Read the error files listed above**

Understand: what `ErrorBoundary` does, what `useErrors` returns, what display components exist (`ErrorPanel`, `ErrorTooltip`, `ErrorIcon`).

- [ ] **Step 2: Write src/errors/AGENTS.md**

```markdown
# Errors

Error handling utilities: boundary components, hooks, and display components.

[← Back to root](../../AGENTS.md)

---

## Overview

*2 sentences on the overall pattern: how errors are caught, stored, and displayed.*

## Components & hooks

| Export | Description |
|--------|-------------|
| `ErrorBoundary` | *description* |
| `useErrors` | *description* |
| `ErrorPanel` | *description* |
| `ErrorTooltip` | *description* |
| `ErrorIcon` | *description* |

## Usage

```tsx
// minimal example
```
```

- [ ] **Step 3: Commit**

```bash
git add src/errors/AGENTS.md
git commit -m "docs: add errors section README"
```

---

## Task 7: Update agent.md

**Files:**
- Modify: `agent.md`

- [ ] **Step 1: Read agent.md**

Read the current contents of `agent.md`.

- [ ] **Step 2: Add the codebase navigation note and update AGENTS.md references**

Make the following changes:

1. After the first `## Before making changes` section (or at the top if no such section exists), add:

```markdown
## Codebase navigation

The codebase is documented through a hierarchy of `AGENTS.md` files. Start at [AGENTS.md](AGENTS.md) and follow links to any section or component. Every component, hook, and provider folder has its own README.
```

2. Update the two bullet points in `## Component-specific guidance` that reference AGENTS.md files:

Change:
```
- **Windows** (`src/components/Windows/AGENTS.md`): Draggable windows, `useWindow`, `createWindow`, persistence.
- **Dialogs** (`src/components/Dialog/AGENTS.md`): Modal dialogs, `useDialog`, `createDialog`, `useConfirmationDialog`.
```

To:
```
- **Windows** (`src/components/Windows/AGENTS.md`): Draggable windows, `useWindow`, `createWindow`, persistence.
- **Dialogs** (`src/components/Dialog/AGENTS.md`): Modal dialogs, `useDialog`, `createDialog`, `useConfirmationDialog`.
```

- [ ] **Step 3: Commit**

```bash
git add agent.md
git commit -m "docs: add codebase navigation note to agent.md, update AGENTS.md refs to AGENTS.md"
```

---

## Task 8: Migrate AGENTS.md files and add Table back-link

**Files:**
- Create: `src/components/Windows/AGENTS.md`
- Create: `src/components/Dialog/AGENTS.md`
- Create: `src/components/Configurator/AGENTS.md`
- Delete: `src/components/Windows/AGENTS.md`
- Delete: `src/components/Dialog/AGENTS.md`
- Delete: `src/components/Configurator/AGENTS.md`
- Modify: `src/components/Table/AGENTS.md`

- [ ] **Step 1: Create Windows/AGENTS.md from Windows/AGENTS.md**

Read `src/components/Windows/AGENTS.md`. Copy its full content into `src/components/Windows/AGENTS.md`, then append this line at the end:

```markdown

---

[← Back to Components](../AGENTS.md)
```

- [ ] **Step 2: Create Dialog/AGENTS.md from Dialog/AGENTS.md**

Read `src/components/Dialog/AGENTS.md`. Copy its full content into `src/components/Dialog/AGENTS.md`, then append:

```markdown

---

[← Back to Components](../AGENTS.md)
```

- [ ] **Step 3: Create Configurator/AGENTS.md from Configurator/AGENTS.md**

Read `src/components/Configurator/AGENTS.md`. Copy its full content into `src/components/Configurator/AGENTS.md`, then append:

```markdown

---

[← Back to Components](../AGENTS.md)
```

- [ ] **Step 4: Add back-link to Table/AGENTS.md**

Read `src/components/Table/AGENTS.md`. Append at the end:

```markdown

---

[← Back to Components](../AGENTS.md)
```

- [ ] **Step 5: Delete the three AGENTS.md files**

```bash
git rm src/components/Windows/AGENTS.md
git rm src/components/Dialog/AGENTS.md
git rm src/components/Configurator/AGENTS.md
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Windows/AGENTS.md src/components/Dialog/AGENTS.md src/components/Configurator/AGENTS.md src/components/Table/AGENTS.md
git commit -m "docs: migrate AGENTS.md to AGENTS.md for Windows, Dialog, Configurator; add Table back-link"
```

---

## Task 9: Component READMEs — Batch 1 (Layout & primitives)

> **Note:** Tasks 9–18 are independent and can be run in parallel.

**Folders to process:** `Flex`, `Grid`, `Section`, `Scroller`, `StickyHideHeader`, `Expander`, `Fader`, `AnimatingBorder`, `Ripple`, `Component`

All folders are under `src/components/`.

**Files:**
- Create: `src/components/[Name]/AGENTS.md` for each folder above

- [ ] **Step 1: For each of the 10 folders, read the source files**

For each folder, read:
1. `index.ts` — to see what is exported
2. The main component file (e.g. `Flex.tsx`) — to understand props and behaviour
3. Any models file (e.g. `FlexModels.ts`) if present — for prop types
4. Stories file (e.g. `Flex.stories.tsx`) if present — for usage examples

- [ ] **Step 2: Write AGENTS.md for each folder using the Component README template**

Follow the template defined at the top of this plan. For simple components (e.g. `Ripple`, `Fader`), the README can be short — 1-sentence description, props table, one usage example. For complex ones (e.g. `Scroller` which has shadow visibility callbacks), include architecture notes.

Each README must end with:
```markdown

---

[← Back to Components](../AGENTS.md)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Flex/AGENTS.md src/components/Grid/AGENTS.md src/components/Section/AGENTS.md src/components/Scroller/AGENTS.md src/components/StickyHideHeader/AGENTS.md src/components/Expander/AGENTS.md src/components/Fader/AGENTS.md src/components/AnimatingBorder/AGENTS.md src/components/Ripple/AGENTS.md src/components/Component/AGENTS.md
git commit -m "docs: add READMEs for layout and primitive components"
```

---

## Task 10: Component READMEs — Batch 2 (Forms core)

> **Note:** Tasks 9–18 are independent and can be run in parallel.

**Folders to process:** `Form`, `Field`, `Text`, `Password`, `Number`, `Email`, `PhoneNumber`, `PIN`

All folders are under `src/components/`.

**Files:**
- Create: `src/components/[Name]/AGENTS.md` for each folder above

- [ ] **Step 1: For each of the 8 folders, read the source files**

For each folder, read:
1. `index.ts` — exports
2. Main component/hook file — props, behaviour, and any hooks it exposes (e.g. `useForm`, `useFormActions` in `Form/`)
3. Models file if present
4. Stories file if present

`Form` is complex — it has `Form.tsx`, `useForm.tsx`, `useFormActions.ts`, `FormField.tsx`, `FormSaveButton.tsx`, `FormToolbar.tsx`. Read them all to understand the full API before writing its README.

- [ ] **Step 2: Write AGENTS.md for each folder**

`Form/AGENTS.md` should be detailed: cover `<Form>` props, `useForm` hook, `useFormActions`, validation, dirty tracking, and the `<FormField>` / `<FormToolbar>` / `<FormSaveButton>` sub-components.

The input components (`Text`, `Password`, `Number`, `Email`, `PhoneNumber`, `PIN`) should each be concise: what it is, its key props, a usage example.

Each README must end with:
```markdown

---

[← Back to Components](../AGENTS.md)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Form/AGENTS.md src/components/Field/AGENTS.md src/components/Text/AGENTS.md src/components/Password/AGENTS.md src/components/Number/AGENTS.md src/components/Email/AGENTS.md src/components/PhoneNumber/AGENTS.md src/components/PIN/AGENTS.md
git commit -m "docs: add READMEs for form and input components"
```

---

## Task 11: Component READMEs — Batch 3 (Selectors & controls)

> **Note:** Tasks 9–18 are independent and can be run in parallel.

**Folders to process:** `Checkbox`, `Radio`, `Switch`, `ToggleButtonGroup`, `Autocomplete`, `DropDown`, `InternalDropDown`, `InternalText`, `Selector`

All folders are under `src/components/`.

**Files:**
- Create: `src/components/[Name]/AGENTS.md` for each folder above

- [ ] **Step 1: For each of the 9 folders, read the source files**

For each folder, read `index.ts`, the main component file, any models file, and any stories file.

`Selector` is complex — it was recently implemented with a `SelectorButton`, popover, and `SelectorButtonUtils`. Read all files in that folder carefully.

`InternalDropDown` and `InternalText` are internal base components — note in their READMEs that they are internal and not intended for direct consumer use.

- [ ] **Step 2: Write AGENTS.md for each folder**

Each README must end with:
```markdown

---

[← Back to Components](../AGENTS.md)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Checkbox/AGENTS.md src/components/Radio/AGENTS.md src/components/Switch/AGENTS.md src/components/ToggleButtonGroup/AGENTS.md src/components/Autocomplete/AGENTS.md src/components/DropDown/AGENTS.md src/components/InternalDropDown/AGENTS.md src/components/InternalText/AGENTS.md src/components/Selector/AGENTS.md
git commit -m "docs: add READMEs for selector and control components"
```

---

## Task 12: Component READMEs — Batch 4 (Data display)

> **Note:** Tasks 9–18 are independent and can be run in parallel.

**Folders to process:** `List`, `InternalList`, `SimpleList`, `Matrix`, `ReadOnlyValue`

All folders are under `src/components/`. (`Table` and `Configurator` are handled in Task 8.)

**Files:**
- Create: `src/components/[Name]/AGENTS.md` for each folder above

- [ ] **Step 1: For each of the 5 folders, read the source files**

`InternalList` is used by both `List` and `Table` — read its files carefully to understand the request/response contract (`onRequest`, `ReactListItem`, `renderItem`). This is non-trivial.

`List` wraps `InternalList` with a higher-level API accepting `ReactListItem[]` directly.

For `Matrix` and `ReadOnlyValue`, read the main component file to understand the props.

- [ ] **Step 2: Write AGENTS.md for each folder**

`InternalList/AGENTS.md` and `List/AGENTS.md` should be moderately detailed — include the request/response contract, `ReactListItem` shape, and a usage example.

Each README must end with:
```markdown

---

[← Back to Components](../AGENTS.md)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/List/AGENTS.md src/components/InternalList/AGENTS.md src/components/SimpleList/AGENTS.md src/components/Matrix/AGENTS.md src/components/ReadOnlyValue/AGENTS.md
git commit -m "docs: add READMEs for data display components"
```

---

## Task 13: Component READMEs — Batch 5 (Navigation & menus)

> **Note:** Tasks 9–18 are independent and can be run in parallel.

**Folders to process:** `Tabs`, `Menu`, `Drawer`, `Toolbar`, `ActionsToolbar`, `Titlebar`, `UserProfileMenu`

All folders are under `src/components/`.

**Files:**
- Create: `src/components/[Name]/AGENTS.md` for each folder above

- [ ] **Step 1: For each of the 7 folders, read the source files**

Read `index.ts`, the main component file, any models file, and stories file.

- [ ] **Step 2: Write AGENTS.md for each folder**

Each README must end with:
```markdown

---

[← Back to Components](../AGENTS.md)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Tabs/AGENTS.md src/components/Menu/AGENTS.md src/components/Drawer/AGENTS.md src/components/Toolbar/AGENTS.md src/components/ActionsToolbar/AGENTS.md src/components/Titlebar/AGENTS.md src/components/UserProfileMenu/AGENTS.md
git commit -m "docs: add READMEs for navigation and menu components"
```

---

## Task 14: Component READMEs — Batch 6 (Feedback & overlays)

> **Note:** Tasks 9–18 are independent and can be run in parallel.

**Folders to process:** `Button`, `Busy`, `Skeleton`, `Tooltip`, `HelpInfo`, `Notifications`, `ModalLoader`, `SplashScreen`, `FloatingActionButton`, `Countdown`

All folders are under `src/components/`.

**Files:**
- Create: `src/components/[Name]/AGENTS.md` for each folder above

- [ ] **Step 1: For each of the 10 folders, read the source files**

Read `index.ts`, main component file, any models file, and stories file.

`Notifications` likely has a hook or provider pattern — read all files to understand how notifications are triggered.

`Button` has a `ButtonGroup.tsx` sub-component — cover it in the `Button` README.

- [ ] **Step 2: Write AGENTS.md for each folder**

Each README must end with:
```markdown

---

[← Back to Components](../AGENTS.md)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Button/AGENTS.md src/components/Busy/AGENTS.md src/components/Skeleton/AGENTS.md src/components/Tooltip/AGENTS.md src/components/HelpInfo/AGENTS.md src/components/Notifications/AGENTS.md src/components/ModalLoader/AGENTS.md src/components/SplashScreen/AGENTS.md src/components/FloatingActionButton/AGENTS.md src/components/Countdown/AGENTS.md
git commit -m "docs: add READMEs for feedback and overlay components"
```

---

## Task 15: Component READMEs — Batch 7 (Surfaces, media & misc)

> **Note:** Tasks 9–18 are independent and can be run in parallel.

**Folders to process:** `DatePicker`, `Calendar`, `Avatar`, `Badge`, `Tag`, `Chips`, `Image`, `Icon`, `Label`, `AssistiveLabel`, `Typography`, `Carousel`, `ParallaxScrollers`, `DragAndDrop`, `SignInDialog`

All folders are under `src/components/`.

**Files:**
- Create: `src/components/[Name]/AGENTS.md` for each folder above

- [ ] **Step 1: For each of the 15 folders, read the source files**

Read `index.ts`, main component file, any models file, and stories file.

`Icon` likely has a list of available icon names — include a note on how to discover available icons.

`SignInDialog` wraps dialog + reCAPTCHA — note the dependency on `RecaptchaProvider` or equivalent if present.

`DragAndDrop` — read all files to understand the drag handle and item order API.

- [ ] **Step 2: Write AGENTS.md for each folder**

Each README must end with:
```markdown

---

[← Back to Components](../AGENTS.md)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DatePicker/AGENTS.md src/components/Calendar/AGENTS.md src/components/Avatar/AGENTS.md src/components/Badge/AGENTS.md src/components/Tag/AGENTS.md src/components/Chips/AGENTS.md src/components/Image/AGENTS.md src/components/Icon/AGENTS.md src/components/Label/AGENTS.md src/components/AssistiveLabel/AGENTS.md src/components/Typography/AGENTS.md src/components/Carousel/AGENTS.md src/components/ParallaxScrollers/AGENTS.md src/components/DragAndDrop/AGENTS.md src/components/SignInDialog/AGENTS.md
git commit -m "docs: add READMEs for surface, media, and misc components"
```

---

## Task 16: Hook READMEs — Batch 1

> **Note:** Tasks 9–18 are independent and can be run in parallel.

**Folders to process:** `useActions`, `useAPIGridRequest`, `useAsync`, `useBatchUpdates`, `useBooleanState`, `useBound`, `useBrowserInfo`, `useCallbacks`, `useDebounce`, `useDistributedState`, `useDOMRef`, `useDrag`, `useDragAndDrop`, `useEventIsolator`, `useFileUploader`, `useForceUpdate`, `useId`, `useInterval`

All folders are under `src/hooks/`.

**Files:**
- Create: `src/hooks/[name]/AGENTS.md` for each folder above

- [ ] **Step 1: For each of the 18 folders, read the source files**

For each hook folder, read:
1. The main hook file (`.ts` or `.tsx` matching the folder name)
2. `index.ts` if it exports additional types
3. Any `.tests` file to understand expected behaviour from test cases

- [ ] **Step 2: Write AGENTS.md for each folder using the Hook README template**

Follow the template defined at the top of this plan. Include:
- What the hook does (1–2 sentences)
- Full TypeScript signature
- Parameters table
- Return value description
- One usage example

Each README must end with:
```markdown

---

[← Back to Hooks](../AGENTS.md)
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useActions/AGENTS.md src/hooks/useAPIGridRequest/AGENTS.md src/hooks/useAsync/AGENTS.md src/hooks/useBatchUpdates/AGENTS.md src/hooks/useBooleanState/AGENTS.md src/hooks/useBound/AGENTS.md src/hooks/useBrowserInfo/AGENTS.md src/hooks/useCallbacks/AGENTS.md src/hooks/useDebounce/AGENTS.md src/hooks/useDistributedState/AGENTS.md src/hooks/useDOMRef/AGENTS.md src/hooks/useDrag/AGENTS.md src/hooks/useDragAndDrop/AGENTS.md src/hooks/useEventIsolator/AGENTS.md src/hooks/useFileUploader/AGENTS.md src/hooks/useForceUpdate/AGENTS.md src/hooks/useId/AGENTS.md src/hooks/useInterval/AGENTS.md
git commit -m "docs: add READMEs for hooks batch 1"
```

---

## Task 17: Hook READMEs — Batch 2

> **Note:** Tasks 9–18 are independent and can be run in parallel.

**Folders to process:** `useItems`, `useMap`, `useObservable`, `useObserver`, `useOnChange`, `useOnDOMChange`, `useOnMount`, `useOnResize`, `useOnUnmount`, `usePromise`, `useRecaptcha`, `useRef`, `useSet`, `useStorage`, `useSyncState`, `useTimeout`, `useToggleState`, `useUpdatableState`

All folders are under `src/hooks/`.

**Files:**
- Create: `src/hooks/[name]/AGENTS.md` for each folder above

- [ ] **Step 1: For each of the 18 folders, read the source files**

Same approach as Task 16: read the main hook file, `index.ts`, and any tests file.

- [ ] **Step 2: Write AGENTS.md for each folder using the Hook README template**

Each README must end with:
```markdown

---

[← Back to Hooks](../AGENTS.md)
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useItems/AGENTS.md src/hooks/useMap/AGENTS.md src/hooks/useObservable/AGENTS.md src/hooks/useObserver/AGENTS.md src/hooks/useOnChange/AGENTS.md src/hooks/useOnDOMChange/AGENTS.md src/hooks/useOnMount/AGENTS.md src/hooks/useOnResize/AGENTS.md src/hooks/useOnUnmount/AGENTS.md src/hooks/usePromise/AGENTS.md src/hooks/useRecaptcha/AGENTS.md src/hooks/useRef/AGENTS.md src/hooks/useSet/AGENTS.md src/hooks/useStorage/AGENTS.md src/hooks/useSyncState/AGENTS.md src/hooks/useTimeout/AGENTS.md src/hooks/useToggleState/AGENTS.md src/hooks/useUpdatableState/AGENTS.md
git commit -m "docs: add READMEs for hooks batch 2"
```

---

## Task 18: Provider READMEs

> **Note:** Tasks 9–18 are independent and can be run in parallel.

**Folders to process:** `ApiProvider`, `LocaleProvider`, `LoggerProvider`, `RecordsProvider`, `SubscriptionProvider`, `UIStateProvider`, `ValidationProvider`

All folders are under `src/providers/`.

**Files:**
- Create: `src/providers/[Name]/AGENTS.md` for each folder above

- [ ] **Step 1: For each of the 7 folders, read the source files**

For each provider folder, read:
1. The main provider file (e.g. `ApiProvider.tsx`)
2. The context file (e.g. `ApiProviderContext.ts`) — to understand what value is provided
3. The models file if present (e.g. `ApiProviderModels.ts`) — for prop types
4. The consumer hook file if present (e.g. `useApi.ts`)
5. `index.ts` — to see all exports

- [ ] **Step 2: Write AGENTS.md for each folder using the Provider README template**

Follow the template defined at the top of this plan. Include:
- What the provider supplies
- Where to mount it in the tree
- Props table
- How to consume (hook or direct context import)
- Usage example

Each README must end with:
```markdown

---

[← Back to Providers](../AGENTS.md)
```

- [ ] **Step 3: Commit**

```bash
git add src/providers/ApiProvider/AGENTS.md src/providers/LocaleProvider/AGENTS.md src/providers/LoggerProvider/AGENTS.md src/providers/RecordsProvider/AGENTS.md src/providers/SubscriptionProvider/AGENTS.md src/providers/UIStateProvider/AGENTS.md src/providers/ValidationProvider/AGENTS.md
git commit -m "docs: add READMEs for all providers"
```

---

## Task 19: Final consistency pass

> Run this after all other tasks are complete.

**Files:**
- Read: all AGENTS.md files created or modified in this plan

- [ ] **Step 1: Verify all back-links from component READMEs to src/components/AGENTS.md**

Each `src/components/[Name]/AGENTS.md` must end with `[← Back to Components](../AGENTS.md)`. Spot-check 5–10 files.

- [ ] **Step 2: Verify all back-links from hook READMEs to src/hooks/AGENTS.md**

Each `src/hooks/[name]/AGENTS.md` must end with `[← Back to Hooks](../AGENTS.md)`. Spot-check 5–10 files.

- [ ] **Step 3: Verify all back-links from provider READMEs to src/providers/AGENTS.md**

Each `src/providers/[Name]/AGENTS.md` must end with `[← Back to Providers](../AGENTS.md)`. Spot-check all 7.

- [ ] **Step 4: Verify section indexes link to root README**

Check that `src/components/AGENTS.md`, `src/hooks/AGENTS.md`, `src/providers/AGENTS.md`, `src/theme/AGENTS.md`, `src/errors/AGENTS.md` each have `[← Back to root](../../AGENTS.md)`.

- [ ] **Step 5: Verify root README links to all section indexes**

Read `AGENTS.md` and confirm it links to `src/components/AGENTS.md`, `src/hooks/AGENTS.md`, `src/providers/AGENTS.md`, `src/theme/AGENTS.md`, `src/errors/AGENTS.md`.

- [ ] **Step 6: Verify no AGENTS.md files remain under src/components/**

```bash
find src/components -name "AGENTS.md"
```

Expected output: nothing (empty).

- [ ] **Step 7: Commit any fixes found**

```bash
git add -A
git commit -m "docs: fix back-links and consistency issues in README hierarchy"
```
