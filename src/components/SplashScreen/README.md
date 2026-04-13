# SplashScreen

A full-area loading screen that fades in over the application content while the UI is in a loading state and fades out once loading completes. Accepts optional custom loading content; falls back to a plain "Loading, please wait…" message.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | The real application content, rendered once loading finishes. |
| `whenLoading` | `ReactNode` | No | Content to display inside the splash screen while loading. Defaults to a centred "Loading, please wait…" text. Pass `null` to render an empty (coloured) overlay. |
| `className` | `string` | No | Additional CSS class name applied to the outer wrapper element. |

## Usage

```tsx
import { SplashScreen } from '@anupheaus/react-ui';
import { UIState } from '@anupheaus/react-ui';

// Basic usage — driven by UIState isLoading
<UIState isLoading={isAppLoading}>
  <SplashScreen>
    <App />
  </SplashScreen>
</UIState>

// Custom splash content
<UIState isLoading={isAppLoading}>
  <SplashScreen whenLoading={
    <Flex isVertical gap={16} align="center">
      <Logo />
      <Busy variant="circular" size="large" />
      <span>Starting up…</span>
    </Flex>
  }>
    <App />
  </SplashScreen>
</UIState>
```

## Architecture

The splash screen renderer is absolutely positioned over the children with a CSS opacity transition (1 s ease). While loading, `children` are unmounted from the DOM to avoid rendering unhydrated content; a debounced transition-end handler clones and re-inserts the splash screen's child nodes to smooth the exit animation. Theme colours for the overlay (`backgroundColor`, `textColor`) are exposed via `SplashScreenTheme`.

---

[← Back to Components](../README.md)
