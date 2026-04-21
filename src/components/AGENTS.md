# Components

This directory contains every UI component exported by the library. Components are organised into nine categories — Layout, Windows & Dialogs, Forms & Inputs, Pickers & Selectors, Data Display, Navigation, Feedback, Surfaces, and Typography & Misc. Each category groups components by purpose; the table below each heading lists the components in that category and links to their own AGENTS.md file.

To find a component: scan the category that matches its role (e.g. layout containers are in Layout, modal overlays are in Windows & Dialogs, text inputs are in Forms & Inputs). If you are unsure which category applies, check the index table for a one-line description.

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
| [Wizard](Wizard/AGENTS.md) | Multi-step workflow window with Back/Next/Save navigation |

## Forms & Inputs

| Component | Description |
|-----------|-------------|
| [Form](Form/AGENTS.md) | Form container with validation, dirty tracking, and useForm hook |
| [Field](Field/AGENTS.md) | Form field wrapper providing label, error, and assistive text |
| [Text](Text/AGENTS.md) | Text input |
| [Password](Password/AGENTS.md) | Password input with show/hide toggle |
| [Number](Number/AGENTS.md) | Numeric input with formatting |
| [Slider](Slider/AGENTS.md) | Numeric slider with single-value and range modes |
| [Email](Email/AGENTS.md) | Email address input |
| [PhoneNumber](PhoneNumber/AGENTS.md) | Phone number input with formatting |
| [PIN](PIN/AGENTS.md) | PIN / OTP digit-by-digit input |
| [Checkbox](Checkbox/AGENTS.md) | Checkbox input |
| [Radio](Radio/AGENTS.md) | Radio button input |
| [Signature](Signature/AGENTS.md) | Freehand signature capture — saves as a base64 PNG data URL |
| [Markdown](Markdown/AGENTS.md) | Markdown editor and viewer with themed scrollbars and scroll shadows |
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
| [QRCode](QRCode/AGENTS.md) | QR code renderer with logo overlay and theme-driven styling |

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
