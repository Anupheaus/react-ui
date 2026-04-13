# Providers

Context providers exported by this library. Mount these high in your component tree as needed. Each provider name links to its own README.

[← Back to root](../../README.md)

---

| Provider | Description |
|----------|-------------|
| [ApiProvider](ApiProvider/README.md) | Supplies `get`, `post`, `remove`, and `query` fetch helpers to the tree, managing auth tokens (persisted to `localStorage`), shared headers, and status-code handlers. |
| [LocaleProvider](LocaleProvider/README.md) | Sets the application locale/date-format settings (via Luxon) and makes them available to child components through context. |
| [LoggerProvider](LoggerProvider/README.md) | Injects a `Logger` instance (or creates a named sub-logger from a parent) into context so descendants can call `useLogger()` without prop-drilling. |
| [RecordsProvider](RecordsProvider/README.md) | Maintains a typed, keyed record map in context — supports inheritance from parent providers, merge callbacks, upsert, and change notifications. |
| [SubscriptionProvider](SubscriptionProvider/README.md) | Wires up a publish/subscribe channel defined by `createSubscription`, returning an `invoke` function and a `<Provider>` component that routes callbacks to registered subscribers. |
| [UIStateProvider](UIStateProvider/README.md) | Propagates UI state flags (`isLoading`, `isReadOnly`, `isCompact`) through the tree so child components can adapt their appearance and behaviour accordingly. |
| [ValidationProvider](ValidationProvider/README.md) | Manages form validation state — collects field errors via `validate()`, groups them into sections via `<ValidateSection>`, and exposes `isValid()` and `highlightValidationErrors()`. |
