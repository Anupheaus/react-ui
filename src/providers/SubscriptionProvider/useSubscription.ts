import { useContext, useId, useRef } from 'react';
import type { Subscription } from './createSubscription';
import { subscriptionContexts, type SubscriptionContext } from './subscriptionInternals';
import { useBound } from '../../hooks';

export function useSubscription<SubscribePayload, InvokePayload>(subscription: Subscription<SubscribePayload, InvokePayload>, callback?: (payload: InvokePayload) => void) {
  const context = subscriptionContexts.get(subscription);
  if (!context) throw new Error('SubscriptionProvider not found');
  const { isValid, subscribe: internalSubscribe, unsubscribe: internalUnsubscribe } = useContext<SubscriptionContext<SubscribePayload, InvokePayload>>(context);
  const subscriberId = useId();
  const callbackRef = useRef<((payload: InvokePayload) => void)>();

  if (!isValid) throw new Error('SubscriptionProvider not found');

  const handler = useBound((payload: InvokePayload) => {
    callback?.(payload);
    callbackRef.current?.(payload);
  });
  const subscribe = useBound((payload: SubscribePayload, groupId?: string) => internalSubscribe(subscriberId, payload, handler, groupId));
  const unsubscribe = useBound(() => internalUnsubscribe(subscriberId));
  const onCallback = useBound((fn: (payload: InvokePayload) => void) => { callbackRef.current = fn; });

  return {
    subscribe,
    unsubscribe,
    onCallback,
  };
}
