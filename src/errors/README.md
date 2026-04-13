# Errors

The errors subsystem provides a boundary component for catching runtime errors, a `useErrors` hook for recording and wrapping error-prone code, and presentational components for displaying errors to users.

[← Back to root](../../README.md)

---

## Overview

`ErrorBoundary` wraps a subtree and provides an `ErrorContexts.recordErrors` context. Any descendant that calls `useErrors()` can record errors into this boundary via `recordError` or use the `tryCatch` helper to safely call synchronous or asynchronous code. When an error is recorded, `ErrorBoundary` calls its optional `onError` prop and hides the failed subtree. Presentational components (`ErrorPanel`, `ErrorTooltip`, `ErrorIcon`) consume an `Error` object directly and do not depend on context — they can be used standalone anywhere in the tree.

## Components & hooks

| Export | Description |
|--------|-------------|
| `ErrorBoundary` | Renders children inside a `recordErrors` context; on error it calls `onError` and unmounts the subtree to prevent a broken UI. |
| `useErrors` | Returns `recordError` and `tryCatch` — lets any component record errors into the nearest `ErrorBoundary` and safely wrap sync/async calls. |
| `ErrorPanel` | Displays an error with an icon, message text, and a button to open a detail dialog; designed for in-page error states. |
| `ErrorTooltip` | Wraps any content in a `Tooltip` that shows the error title and message on hover. |
| `ErrorIcon` | Renders a themed error icon that, when hovered, shows an `ErrorTooltip` with the full error details. |

## Usage

```tsx
import { ErrorBoundary, useErrors, ErrorPanel } from '@anupheaus/react-ui';
import { Error } from '@anupheaus/common';
import { useState } from 'react';

// Wrap a section of the tree in a boundary
function Page() {
  const [error, setError] = useState<Error>();

  return (
    <ErrorBoundary onError={setError}>
      {error ? <ErrorPanel error={error} /> : <RiskyComponent />}
    </ErrorBoundary>
  );
}

// Inside a component — use tryCatch to safely call async code
function RiskyComponent() {
  const { tryCatch } = useErrors();

  const handleClick = () => tryCatch(async () => {
    await fetch('/api/data'); // any thrown error is routed to the boundary
  });

  return <button onClick={handleClick}>Load data</button>;
}
```
