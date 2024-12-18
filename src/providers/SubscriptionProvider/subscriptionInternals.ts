import type { Context } from 'react';
import type { Subscription } from './createSubscription';

export const subscriptionContexts = new WeakMap<Subscription<any, any>, Context<SubscriptionContext<any, any>>>();
export const subscriptionInternal = Symbol('subscriptionInternal');

export interface SubscriptionContext<SubscribePayload, InvokePayload> {
  isValid: boolean;
  subscribe(id: string, payload: SubscribePayload, callback: (payload: InvokePayload) => void, groupId?: string): void;
  unsubscribe(id: string): void;
}

export interface SubscriptionConfig {
  onSubscribingCallbackAction?: 'none' | 'callWithLastPayload';
}
