# RecordsProvider

Provides a typed, keyed record store for a given `typeId` to its subtree, with optional inheritance from an ancestor `RecordsProvider` of the same type and support for upsert, get, and change notifications.

## When to mount

Mount around any subtree that needs to share a collection of typed records. Multiple `RecordsProvider`s with the same `typeId` can be nested; the inner one merges with or overrides records from the outer one depending on the `inherit` flag.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `typeId` | `string` | Yes | Unique identifier for the record type; consumers must use the same `typeId` |
| `records` | `T[]` | No | Array of records to provide |
| `inherit` | `boolean` | No | When `true`, merges records from the nearest ancestor `RecordsProvider` with the same `typeId` (default: `false`) |
| `children` | `ReactNode` | No | Subtree that can consume the records |
| `onMatchingInherited` | `(provided, inherited, id) => T` | No | Transform function for records present in both this and the ancestor provider |
| `onUnmatchingInherited` | `(inherited, id) => T` | No | Transform function for records present only in the ancestor provider |

## Consuming

Use `useRecordsProvider(typeId)` to access the full record set, or `useRecordsProvider(typeId, id)` to subscribe to a single record.

```tsx
import { useRecordsProvider } from '@anupheaus/react-ui';

// Access all records of a type (re-renders when any record changes)
const { records, upsert, onChanged } = useRecordsProvider<MyRecord>('my-type');

// Access a single record by ID
const { record, upsert } = useRecordsProvider<MyRecord>('my-type', recordId);

// Upsert a record
upsert({ id: 'rec-1', name: 'Updated name' });

// Listen for changes
onChanged((record, action) => {
  console.log(action, record); // 'MODIFIED' | 'DELETED' | 'REMOVED'
});
```

---

[← Back to Providers](../AGENTS.md)
