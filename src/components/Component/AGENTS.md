# Component

The foundation module used to create all components in this library. It exports `createComponent`, a factory that wraps a render function with `forwardRef`, deep-equality memoisation, an optional per-instance prop-override context (`ComponentName.Overrides`), and an optional error handler.

## API

### `createComponent(name, render, config?)`

```ts
import { createComponent } from '@anupheaus/react-ui';

const MyComponent = createComponent('MyComponent', (props: MyProps) => {
  return <div>{props.children}</div>;
});
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Display name shown in React DevTools |
| `render` | `(props) => JSX.Element \| null` | The component render function |
| `config` | `Config` (optional) | Advanced options (see below) |

#### Config options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disableMemoisation` | `boolean` | `false` | Skip wrapping in `React.memo` |
| `debug` | `boolean` | `false` | Log prop comparison results to the console |
| `whitelistFunctions` | `PropertyKey[]` | `[]` | Prop names whose function identity changes should be ignored during comparison (suppresses console warnings) |
| `onCompareProps` | `(prev, next, key, whitelist) => boolean` | — | Custom prop equality function |
| `onError` | `(error, props) => JSX.Element \| null` | — | Render fallback when the component throws |

### `ReactUIComponent`

Every component created with `createComponent` has the shape:

```ts
type ReactUIComponent<TFunc> = TFunc & {
  Overrides: NamedExoticComponent<Partial<Props> & { children: ReactNode }>;
};
```

**`ComponentName.Overrides`** is a context provider that injects default prop values for all instances of that component rendered beneath it:

```tsx
<Button.Overrides size="small" variant="ghost">
  {/* All Buttons here inherit size="small" and variant="ghost" unless overridden */}
  <Button>Save</Button>
  <Button size="large">Cancel</Button>
</Button.Overrides>
```

## Memoisation behaviour

By default `createComponent` wraps the component in `React.memo` with a deep-equality comparator. The comparator handles primitives, arrays, plain objects, React elements, `Date` instances, and proxies. When an unstable function prop is detected it logs a `console.warn` to help identify missing `useBound`/`useCallback` wrapping. Add the prop name to `whitelistFunctions` (or pass `data-whitelist-functions={['propName']}` at the call site) to silence the warning.

## Usage

```tsx
import { createComponent } from '@anupheaus/react-ui';

interface CardProps {
  title: string;
  children?: ReactNode;
  onClose?(): void;
}

export const Card = createComponent('Card', ({ title, children, onClose }: CardProps) => (
  <div className="card">
    <h2>{title}</h2>
    {children}
    {onClose && <button onClick={onClose}>Close</button>}
  </div>
), {
  onError: (error) => <div className="error">Something went wrong</div>,
});
```

---

[← Back to Components](../AGENTS.md)
