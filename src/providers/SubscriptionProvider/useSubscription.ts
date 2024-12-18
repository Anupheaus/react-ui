import { useContext, useId } from 'react';
import type { Subscription } from './createSubscription';
import { subscriptionContexts, type SubscriptionContext } from './subscriptionInternals';
import { useBound } from '../../hooks';

export function useSubscription<SubscribePayload, InvokePayload>(subscription: Subscription<SubscribePayload, InvokePayload>, callback: (payload: InvokePayload) => void) {
  const context = subscriptionContexts.get(subscription);
  if (!context) throw new Error('SubscriptionProvider not found');
  const { isValid, subscribe: internalSubscribe, unsubscribe: internalUnsubscribe } = useContext<SubscriptionContext<SubscribePayload, InvokePayload>>(context);
  const subscriberId = useId();

  if (!isValid) throw new Error('SubscriptionProvider not found');

  const subscribe = useBound((payload: SubscribePayload, groupId?: string) => internalSubscribe(subscriberId, payload, callback, groupId));
  const unsubscribe = useBound(() => internalUnsubscribe(subscriberId));

  return {
    subscribe,
    unsubscribe,
  };
}
