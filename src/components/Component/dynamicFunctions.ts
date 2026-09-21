// Registry of function props that are intentionally re-created on every render (e.g. a table column's
// `renderValue`, which closes over changing data). A function is registered either explicitly via
// `markDynamicFunction` or automatically when a component whitelists its property name during comparison.
// Once registered, the prop-comparison in `defaultCompareProps` stops warning about its identity changing —
// anywhere it flows, including descendant components that never whitelisted it themselves. A `WeakSet` keeps
// this leak-free: entries disappear as soon as the (short-lived, per-render) function is garbage-collected.
const intentionallyDynamicFunctions = new WeakSet<Function>();

/** Register a function so identity-change warnings are suppressed for it across every component it reaches. */
export function markDynamicFunction<T extends Function>(fn: T): T {
  intentionallyDynamicFunctions.add(fn);
  return fn;
}

/** Whether a function has been registered (directly or via a whitelist) as intentionally dynamic. */
export function isDynamicFunction(fn: Function): boolean {
  return intentionallyDynamicFunctions.has(fn);
}
