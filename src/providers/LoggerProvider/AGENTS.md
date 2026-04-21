# LoggerProvider

Injects a `Logger` instance (from `@anupheaus/common`) into the component tree, supporting sub-loggers by name and automatic propagation through nested providers.

## When to mount

Mount at the application root (or any subtree boundary) and supply either a `logger` instance or a `loggerName`. Nested `LoggerProvider`s create sub-loggers under the nearest parent logger, building a hierarchical log namespace automatically.

## Props

One of `logger` or `loggerName` is required:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `logger` | `Logger` | Conditional | An existing `Logger` instance to provide directly. Required if `loggerName` is omitted |
| `loggerName` | `string` | Conditional | Creates a new `Logger` (or sub-logger from the nearest parent) with this name. Required if `logger` is omitted |
| `children` | `ReactNode` | No | Subtree that can consume the logger |

## Consuming

Use `useLogger()` in any descendant component. Pass an optional sub-log name to create a scoped logger.

```tsx
import { useLogger } from '@anupheaus/react-ui';

// Get the logger provided by the nearest LoggerProvider
const logger = useLogger();

// Get a named sub-logger
const logger = useLogger('MyComponent');

logger.info('Something happened');
logger.error('Something went wrong', error);
```

---

[← Back to Providers](../AGENTS.md)
