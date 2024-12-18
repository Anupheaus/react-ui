import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { Subscription } from './createSubscription';
import { subscriptionInternal, type SubscriptionContext } from './subscriptionInternals';
import { createComponent } from '../../components/Component';
import { useBound, useMap } from '../../hooks';
import { is } from '@anupheaus/common';

interface Props<SubscribePayload, InvokePayload> {
  children: ReactNode;
  onSubscribed?(id: string, payload: SubscribePayload, callback: (payload: InvokePayload) => void, groupId?: string, groupCreated?: boolean): void;
  onUnsubscribed?(id: string, groupId?: string, groupDestroyed?: boolean): void;
}

export function useSubscriptionProvider<SubscribePayload, InvokePayload>(subscription: Subscription<SubscribePayload, InvokePayload>) {
  const subscriptionCallbacks = useMap<string, (payload: InvokePayload) => void>();
  const { onSubscribingCallbackAction = 'none' } = subscription[subscriptionInternal].config;
  const groupedCallbacks = useMap<string, Set<string>>();
  const idToGroup = useMap<string, string>();
  const lastInvocationPayload = useMap<string | undefined, InvokePayload>();

  const invoke = useBound((payload: InvokePayload, groupId?: string) => {
    const callbacksToInvoke = (() => {
      if (is.not.empty(groupId)) return (groupedCallbacks.get(groupId) ?? new Set()).toArray().map(id => subscriptionCallbacks.get(id)).removeNull();
      return subscriptionCallbacks.toValuesArray();
    })();

    callbacksToInvoke.forEach(callback => callback(payload));
    lastInvocationPayload.set(groupId, payload);
  });

  const Provider = useMemo(() => {
    const Context = Reflect.get(subscription, '_context');
    return createComponent('SubscriptionProvider', ({
      children,
      onSubscribed,
      onUnsubscribed,
    }: Props<SubscribePayload, InvokePayload>) => {

      const unsubscribe = useBound<SubscriptionContext<SubscribePayload, InvokePayload>['unsubscribe']>(id => {
        subscriptionCallbacks.delete(id);
        let groupDestroyed: boolean | undefined;
        const groupId = idToGroup.get(id);
        if (is.not.empty(groupId)) {
          const group = groupedCallbacks.get(groupId);
          if (group != null) {
            group.delete(id);
            if (group.size === 0) {
              groupedCallbacks.delete(groupId);
              groupDestroyed = true;
            }
          }
        }
        idToGroup.delete(id);
        onUnsubscribed?.(id, groupId, groupDestroyed);
      });

      const subscribe = useBound<SubscriptionContext<SubscribePayload, InvokePayload>['subscribe']>((id, payload, callback, groupId) => {
        subscriptionCallbacks.set(id, callback);
        if (idToGroup.has(id)) {
          if (idToGroup.get(id) !== groupId) unsubscribe(id);
        }
        let groupCreated: boolean | undefined;
        if (is.not.empty(groupId)) {
          const group = groupedCallbacks.getOrSet(groupId, () => {
            groupCreated = true;
            return new Set();
          });
          group.add(id);
          idToGroup.set(id, groupId);
        }
        onSubscribed?.(id, payload, callback, groupId, groupCreated);
        switch (onSubscribingCallbackAction) {
          case 'callWithLastPayload': {
            const lastPayload = lastInvocationPayload.get(groupId);
            if (lastPayload != null) callback(lastPayload);
            break;
          }
        }
      });

      const context = useMemo<SubscriptionContext<SubscribePayload, InvokePayload>>(() => ({
        isValid: true,
        subscribe,
        unsubscribe,
      }), []);

      return (
        <Context.Provider value={context}>
          {children}
        </Context.Provider>
      );
    });
  }, [subscription]);

  return {
    invoke,
    Provider,
  };
}
