import { useContext, useRef } from 'react';
import type { Subscription } from './createSubscription';
import { subscriptionContexts, type SubscriptionContext } from './subscriptionInternals';
import { useBound, useId, useOnUnmount } from '../../hooks';

export function useSubscription<SubscribePayload, InvokePayload>(subscription: Subscription<SubscribePayload, InvokePayload>, callback?: (payload: InvokePayload) => void) {
  const context = subscriptionContexts.get(subscription);
  if (!context) throw new Error('SubscriptionProvider not found');
  const { isValid, subscribe: internalSubscribe, unsubscribe: internalUnsubscribe } = useContext<SubscriptionContext<SubscribePayload, InvokePayload>>(context);
  const subscriberId = useId();
  const callbackRef = useRef<((payload: InvokePayload, debug?: boolean) => void)>();

  if (!isValid) throw new Error('SubscriptionProvider not found');

  const handler = useBound((payload: InvokePayload, debug?: boolean) => {
    if (debug) console.log('[React-UI] Invoking callback', { payload }); // eslint-disable-line no-console
    callback?.(payload);
    callbackRef.current?.(payload, debug);
  });
  const subscribe = useBound((payload: SubscribePayload, groupId?: string, debug?: boolean) => internalSubscribe(subscriberId, payload, handler, groupId, debug));
  const unsubscribe = useBound((debug?: boolean) => internalUnsubscribe(subscriberId, debug));
  const onCallback = useBound((fn: (payload: InvokePayload, debug?: boolean) => void) => { callbackRef.current = fn; });

  useOnUnmount(unsubscribe);

  return {
    subscribe,
    unsubscribe,
    onCallback,
  };
}
