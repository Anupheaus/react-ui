import { useContext, useRef } from 'react';
import type { Subscription } from './createSubscription';
import { subscriptionContexts, type SubscriptionContext } from './subscriptionInternals';
import { useBound, useId, useOnUnmount } from '../../hooks';
import { useLogger } from '../LoggerProvider';

export function useSubscription<SubscribePayload, InvokePayload>(subscription: Subscription<SubscribePayload, InvokePayload>, callback?: (payload: InvokePayload) => void) {
  const context = subscriptionContexts.get(subscription);
  if (!context) throw new Error('SubscriptionProvider not found');
  const { isValid, subscribe: internalSubscribe, unsubscribe: internalUnsubscribe } = useContext<SubscriptionContext<SubscribePayload, InvokePayload>>(context);
  const subscriberId = useId();
  const callbackRef = useRef<((payload: InvokePayload) => void)>();
  const logger = useLogger();

  if (!isValid) throw new Error('SubscriptionProvider not found');

  const handler = useBound((payload: InvokePayload) => {
    logger.silly('Invoking callback', { payload });
    callback?.(payload);
    callbackRef.current?.(payload);
  });
  const subscribe = useBound((payload: SubscribePayload, groupId?: string) => internalSubscribe(subscriberId, payload, handler, groupId));
  const unsubscribe = useBound(() => internalUnsubscribe(subscriberId));
  const onCallback = useBound((fn: (payload: InvokePayload) => void) => { callbackRef.current = fn; });

  useOnUnmount(unsubscribe);

  return {
    subscribe,
    unsubscribe,
    onCallback,
  };
}
