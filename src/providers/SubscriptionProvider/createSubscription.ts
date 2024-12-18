import { createContext } from 'react';
import type { SubscriptionConfig } from './subscriptionInternals';
import { subscriptionContexts, type SubscriptionContext, subscriptionInternal } from './subscriptionInternals';

export interface Subscription<SubscribePayload, InvokePayload> {
  // This is a placeholder for the actual type of the context value
  [subscriptionInternal]: {
    subscribePayloadType?: SubscribePayload;
    invokePayloadType?: InvokePayload;
    config: SubscriptionConfig;
  };
}



export function createSubscription<SubscribePayload, InvokePayload>(config: SubscriptionConfig = {}): Subscription<SubscribePayload, InvokePayload> {
  const Context = createContext<SubscriptionContext<SubscribePayload, InvokePayload>>({
    isValid: false,
    subscribe: () => { throw new Error('SubscriptionProvider not found'); },
    unsubscribe: () => { throw new Error('SubscriptionProvider not found'); },
  });

  const result = { [subscriptionInternal]: { config } } as Subscription<SubscribePayload, InvokePayload>;

  subscriptionContexts.set(result, Context);

  return result;
}
