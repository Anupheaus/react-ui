# SubscriptionProvider

Provides a typed pub/sub channel defined by a `Subscription` token. Subscribers anywhere in the tree attach via `useSubscription`; the provider owner calls `invoke` to push payloads to all (or a group of) subscribers.

## When to mount

Create a `Subscription` token once with `createSubscription()` outside your components, then render the `Provider` returned by `useSubscriptionProvider(subscription)` around the subtree that needs access to that channel.

## Props

The `Provider` component returned by `useSubscriptionProvider` accepts:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Subtree containing subscribers |
| `onSubscribed` | `(id, payload, callback, groupId?, groupCreated?, debug?) => PromiseMaybe<void>` | No | Called when a new subscriber registers |
| `onUnsubscribed` | `(id, groupId?, groupDestroyed?, debug?) => void` | No | Called when a subscriber unregisters |

## Consuming

```tsx
import { createSubscription, useSubscriptionProvider, useSubscription } from '@anupheaus/react-ui';

// Define the subscription token (once, outside components)
const dataRefresh = createSubscription<{ filter: string }, { items: MyItem[] }>();

// In the provider component
const { invoke, Provider } = useSubscriptionProvider(dataRefresh);

// Render the provider and push events
return (
  <Provider onSubscribed={(id, payload) => loadData(payload.filter)}>
    {children}
    <button onClick={() => invoke({ items: latestItems })}>Refresh</button>
  </Provider>
);

// In any descendant component
const { subscribe, unsubscribe } = useSubscription(dataRefresh, payload => {
  setItems(payload.items);
});

useOnMount(() => subscribe({ filter: 'active' }));
```

---

[← Back to Providers](../AGENTS.md)
