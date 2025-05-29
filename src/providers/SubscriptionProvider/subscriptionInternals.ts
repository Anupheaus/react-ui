import type { Context } from 'react';
import type { Subscription } from './createSubscription';
import type { PromiseMaybe } from '@anupheaus/common';
export const subscriptionContexts = new WeakMap<Subscription<any, any>, Context<SubscriptionContext<any, any>>>();
export const subscriptionInternal = Symbol('subscriptionInternal');

export interface SubscriptionContext<SubscribePayload, InvokePayload> {
  isValid: boolean;
  subscribe(id: string, payload: SubscribePayload, callback: (payload: InvokePayload) => PromiseMaybe<void>, groupId?: string, debug?: boolean): PromiseMaybe<void>;
  unsubscribe(id: string, debug?: boolean): void;
}

export interface SubscriptionConfig {
  onSubscribingCallbackAction?: 'none' | 'callWithLastPayload';
}
