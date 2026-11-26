import type { Context } from 'react';
import type { Subscription } from './createSubscription';
import type { PromiseMaybe } from '@anupheaus/common';
// Each subscription's context is created with that subscription's own payload types, so the map holds them untyped
// and the accessors below restore the types from the subscription they are keyed by.
const subscriptionContexts = new WeakMap<object, unknown>();

export function setSubscriptionContext<SubscribePayload, InvokePayload>(subscription: Subscription<SubscribePayload, InvokePayload>,
  context: Context<SubscriptionContext<SubscribePayload, InvokePayload>>): void {
  subscriptionContexts.set(subscription, context);
}

export function getSubscriptionContext<SubscribePayload, InvokePayload>(
  subscription: Subscription<SubscribePayload, InvokePayload>): Context<SubscriptionContext<SubscribePayload, InvokePayload>> | undefined {
  return subscriptionContexts.get(subscription) as Context<SubscriptionContext<SubscribePayload, InvokePayload>> | undefined;
}
export const subscriptionInternal = Symbol('subscriptionInternal');

export interface SubscriptionContext<SubscribePayload, InvokePayload> {
  isValid: boolean;
  subscribe(id: string, payload: SubscribePayload, callback: (payload: InvokePayload) => PromiseMaybe<void>, groupId?: string, debug?: boolean): PromiseMaybe<void>;
  unsubscribe(id: string, debug?: boolean): void;
}

export interface SubscriptionConfig {
  onSubscribingCallbackAction?: 'none' | 'callWithLastPayload';
}
