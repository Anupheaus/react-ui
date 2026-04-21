# Fader

A fade-in / fade-out animation system for content that mounts and unmounts. Wrap a `FaderProvider` around a region and place `Fader` around any content that should animate in when it mounts and animate out when it unmounts. The unmounting animation is achieved by cloning the DOM content into a portal so it remains visible after React removes the component.

## Components

| Component | Description |
|-----------|-------------|
| `FaderProvider` | Context provider. Sets animation durations and manages fade-out clones. |
| `Fader` | Wraps content so it fades in on mount and fades out on unmount. Must be inside a `FaderProvider`. |

## FaderProvider Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `duration` | `number` | No | Duration (ms) for both fade-in and fade-out when the specific overrides are not set (default: `1000`) |
| `fadeInDuration` | `number` | No | Duration (ms) for the fade-in animation; overrides `duration` |
| `fadeOutDuration` | `number` | No | Duration (ms) for the fade-out animation; overrides `duration` |
| `children` | `ReactNode` | No | Application content containing `Fader` components |

## Fader Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | No | Content to fade in/out |

## Usage

```tsx
import { Fader, FaderProvider } from '@anupheaus/react-ui';

function App() {
  const [show, setShow] = useState(true);

  return (
    <FaderProvider duration={500}>
      <Button onClick={() => setShow(v => !v)}>Toggle</Button>
      {show && (
        <Fader>
          <MyCard />
        </Fader>
      )}
    </FaderProvider>
  );
}
```

## Architecture

- **`Fader`** registers its DOM element with the `FaderContext` via a `MutationObserver`. When the component unmounts it calls `fadeOut(id)` on the context.
- **`FaderProvider`** keeps a map of live faders and a list of fading-out snapshots. On `fadeOut`, it captures the parent element's `innerHTML` and creates a `FadingOut` entry.
- **`FadingOut`** renders the captured HTML into the original parent element via `createPortal`, plays the CSS fade-out animation, then removes itself after `fadeOutDuration` ms using `useTimeout`.

---

[← Back to Components](../AGENTS.md)
