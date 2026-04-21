# ApiProvider

Supplies a typed HTTP client (GET, POST, DELETE, SEARCH) to the component tree, automatically attaching auth tokens from `localStorage` and allowing per-status-code response handlers to be registered by any descendant.

## When to mount

Mount once near the root of your application, outside any components that need to make API calls. No ordering dependency relative to other providers, but it must wrap all components that call `useApi()`.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `authToken` | `string` | No | Initial auth token; persisted to `localStorage` under the key `api.auth.token` and sent with each request as the token header |
| `tokenHeaderName` | `string` | No | Header name used to send and receive the auth token (default: `'Api-Token'`) |
| `headers` | `MapOf<string>` | No | Additional static headers merged into every request |
| `children` | `ReactNode` | No | Subtree that can consume the API context |

## Consuming

Use `useApi()` inside any descendant component.

```tsx
import { useApi } from '@anupheaus/react-ui';

const api = useApi();

// GET
const data = await api.get<MyType>('/api/items');

// POST
const result = await api.post<MyType>('/api/items', { name: 'New item' });

// DELETE
await api.remove('/api/items/123');

// SEARCH with filters/sorts/pagination
const { records, totalRecordCount } = await api.query<MyType>('/api/items', {
  filters: { name: { operator: 'contains', value: 'foo' } },
  pagination: { offset: 0, limit: 20 },
});

// Register a status-code handler (e.g. handle 401)
api.onStatusCode(401, () => redirectToLogin());
```

---

[← Back to Providers](../AGENTS.md)
