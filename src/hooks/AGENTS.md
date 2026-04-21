# Hooks

All React hooks exported by this library. Each hook name links to its own README.

[← Back to root](../../AGENTS.md)

---

## State

| Hook | Description |
|------|-------------|
| [useBooleanState](useBooleanState/AGENTS.md) | Manages a boolean flag with stable `setTrue`, `setFalse`, and `setState` helpers. |
| [useToggleState](useToggleState/AGENTS.md) | Holds a boolean value and returns a stable `toggle` function to flip it. |
| [useUpdatableState](useUpdatableState/AGENTS.md) | Like `useState` but re-derives its value from a factory delegate whenever specified dependencies change. |
| [useSyncState](useSyncState/AGENTS.md) | Stores state in a ref (no stale-closure issues) and triggers re-renders on change via `setState` / `getState`. |
| [useDistributedState](useDistributedState/AGENTS.md) | Creates shared, observable state that multiple components can read, write, and subscribe to without a context provider. |
| [useSet](useSet/AGENTS.md) | Returns a stable `Set` instance that persists across renders without causing re-renders on mutation. |
| [useMap](useMap/AGENTS.md) | Returns a stable `Map` instance that persists across renders without causing re-renders on mutation. |

## Async & Data

| Hook | Description |
|------|-------------|
| [useAsync](useAsync/AGENTS.md) | Wraps an async delegate with loading/error state, a `trigger` to invoke it, and a `cancel` to abort in-flight calls. |
| [usePromise](usePromise/AGENTS.md) | Utility for creating and resolving named deferred promises within a component (currently stubbed/commented out). |
| [useItems](useItems/AGENTS.md) | Manages paginated list data — handles loading, caching, skeleton placeholders, and debounced updates from local arrays or async `onRequest` callbacks. |
| [useAPIGridRequest](useAPIGridRequest/AGENTS.md) | Bridges a `UseDataRequest` / `UseDataResponse` API contract to a paginated items state (re-exports an older variant of `useItems`). |
| [useStorage](useStorage/AGENTS.md) | Syncs a state value with `localStorage`, `sessionStorage`, or both, with JSON serialisation and an optional default factory. |
| [useObservable](useObservable/AGENTS.md) | Wraps a value in a lightweight observable with `get`, `set`, and `onChange` — subscribers are notified out-of-render-phase. |
| [useObserver](useObserver/AGENTS.md) | Attaches a `MutationObserver` to a target element and fires `onChange` when its DOM subtree or attributes change. |

## DOM & Layout

| Hook | Description |
|------|-------------|
| [useRef](useRef/AGENTS.md) | Creates a ref whose initial value is computed once from a factory delegate, avoiding repeated initialisation on re-renders. |
| [useDOMRef](useDOMRef/AGENTS.md) | Returns a `[ref, setTarget]` pair (or just `setTarget`) that tracks an HTMLElement with optional connect/disconnect callbacks and multi-ref forwarding. |
| [useOnResize](useOnResize/AGENTS.md) | Observes an element's dimensions via `ResizeObserver` and re-renders when its width and/or height changes. |
| [useOnDOMChange](useOnDOMChange/AGENTS.md) | Attaches a `MutationObserver` to a target element and fires a callback when its child list, subtree, attributes, or character data change. |

## Lifecycle

| Hook | Description |
|------|-------------|
| [useOnMount](useOnMount/AGENTS.md) | Runs a callback once after the component mounts (equivalent to `useEffect` with an empty dependency array). |
| [useOnUnmount](useOnUnmount/AGENTS.md) | Runs a callback when the component unmounts and returns an `isUnmounted()` predicate. |
| [useOnChange](useOnChange/AGENTS.md) | Runs a callback when dependencies change, skipping the initial render. |
| [useForceUpdate](useForceUpdate/AGENTS.md) | Returns a stable `update()` function that forces the component to re-render on demand. |

## Timing

| Hook | Description |
|------|-------------|
| [useDebounce](useDebounce/AGENTS.md) | Wraps a function so it only executes after a quiet period (`ms`), with an optional maximum wait (`longestMs`). |
| [useInterval](useInterval/AGENTS.md) | Runs a callback on a repeating interval and returns a `cancelInterval` function; re-schedules when dependencies change. |
| [useTimeout](useTimeout/AGENTS.md) | Schedules a one-shot callback after a delay and returns a `cancelTimeout` function; re-schedules when dependencies change. |

## Events & Callbacks

| Hook | Description |
|------|-------------|
| [useBound](useBound/AGENTS.md) | Returns a stable function wrapper whose identity never changes even when the underlying delegate is recreated each render. |
| [useCallbacks](useCallbacks/AGENTS.md) | Manages a set of subscriber callbacks with `register`, `registerOutOfRenderPhaseOnly`, and `invoke`, cleaned up automatically on unmount. |
| [useActions](useActions/AGENTS.md) | Creates a proxy API that lets a parent component call child-component methods by having the child call `setActions` with its implementations. |
| [useBatchUpdates](useBatchUpdates/AGENTS.md) | Wraps React's `unstable_batchedUpdates` with an `onComplete` hook that defers callbacks until the batch finishes. |
| [useEventIsolator](useEventIsolator/AGENTS.md) | Attaches event listeners to an element (or its parent) that stop propagation and/or prevent default for mouse, click, or focus events. |

## Drag & Interaction

| Hook | Description |
|------|-------------|
| [useDrag](useDrag/AGENTS.md) | Enables mouse-drag behaviour on an element, firing `onDragStart`, `onDragging`, and `onDragEnd` callbacks with position deltas. |
| [useDragAndDrop](useDragAndDrop/AGENTS.md) | Drag-and-drop hook (currently stubbed/not yet implemented). |

## Utilities

| Hook | Description |
|------|-------------|
| [useId](useId/AGENTS.md) | Returns a stable unique ID for a component, optionally using a supplied `id` prop and regenerating when it changes. |
| [useBrowserInfo](useBrowserInfo/AGENTS.md) | Detects the current browser name, version, platform, and whether the device is a touch screen. |
| [useFileUploader](useFileUploader/AGENTS.md) | Provides a hidden `<FileUploader>` component and a `selectFile()` function that resolves to the chosen `File[]` via a deferred promise. |
| [useRecaptcha](useRecaptcha/AGENTS.md) | Integrates Google reCAPTCHA — provides an `execute()` function that resolves with the token and a `<ReCaptcha>` component to mount. |
