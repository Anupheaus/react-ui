# @anupheaus/react-ui

[![Publish Package](https://github.com/Anupheaus/react-ui/actions/workflows/publish.yml/badge.svg)](https://github.com/Anupheaus/react-ui/actions/workflows/publish.yml)

React component library built on MUI, Emotion, and `@anupheaus/common`. Provides draggable windows, modal dialogs, forms, tables, configurators, and UI primitives.

## Repository overview

### Components (`src/components/`)

| Category | Components |
|----------|------------|
| **Layout** | Flex, Grid, Section, Scroller, StickyHideHeader |
| **Windows & dialogs** | Windows, Dialogs, Dialog, createWindow, createDialog, useWindow, useDialog, useConfirmationDialog |
| **Forms & inputs** | Form (useForm, useFormActions), Field, useFields, Text, Password, Number, Email, PhoneNumber, PIN, Checkbox, Radio, Switch |
| **Data display** | Table, Configurator, List, InternalList, SimpleList, Matrix, ReadOnlyValue |
| **Pickers & selectors** | DatePicker, Calendar, Autocomplete, Selector, DropDown |
| **Feedback** | Button, Busy, Skeleton, Tooltip, HelpInfo, Notifications, ModalLoader, SplashScreen |
| **Navigation** | Tabs, Menu, UserProfileMenu, Drawer |
| **Surfaces** | Tag, Chips, Badge, Avatar, Image |
| **Other** | Icon, Label, AssistiveLabel, Typography, Ripple, Fader, Carousel, ParallaxScrollers, DragAndDrop, Countdown, AnimatingBorder, FloatingActionButton, Titlebar, ActionsToolbar, Toolbar, Expander, SignInDialog |

### Hooks (`src/hooks/`)

useBound, useId, useStorage, useAsync, useDebounce, useInterval, useTimeout, useOnMount, useOnUnmount, useOnChange, useOnResize, useOnDOMChange, useForceUpdate, useBooleanState, useToggleState, useUpdatableState, useSyncState, useDistributedState, useCallbacks, useEventIsolator, useBatchUpdates, useDOMRef, useRef, useSet, useMap, useDrag, useActions, useRecaptcha, useObservable, useObserver, useFileUploader, useBrowserInfo

### Providers (`src/providers/`)

ApiProvider, UIStateProvider, RecordsProvider, LocaleProvider, ValidationProvider, LoggerProvider, SubscriptionProvider

### Theme (`src/theme/`)

createTheme, createStyles, createStyles2, ThemesProvider, ThemeProvider2, createRootThemeProvider, createAnimationKeyFrame, mergeThemes, useTheme, useThemeMixer, colors, themes

### Errors (`src/errors/`)

ErrorBoundary, useErrors, ErrorPanel, ErrorTooltip, ErrorIcon

### Models (`src/models/`)

ReactListItem, ListItemType, ListItemClickEvent

### Extensions (`src/extensions/`)

Document, HTMLElement, is, global (polyfills and extensions)

### Other

- **Storybook** (`src/Storybook/`) — Storybook components and utilities
- **Tests** (`tests/jest/`) — Jest config and tests

## Development

```bash
pnpm install
pnpm start          # Storybook on port 6006
pnpm run build      # Production build
pnpm run test-ci    # Run tests
```

## Documentation

- **AGENTS.md** — Agent instructions, `@anupheaus/common` integration
- **src/components/Windows/AGENTS.md** — Windows, useWindow, createWindow
- **src/components/Dialog/AGENTS.md** — Dialogs, useDialog, createDialog
- **src/components/Configurator/AGENTS.md** — Configurator data model and structure

## License

Apache-2.0
