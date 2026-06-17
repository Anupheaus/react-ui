import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { Subscription } from './createSubscription';
import { subscriptionContexts, subscriptionInternal, type SubscriptionContext } from './subscriptionInternals';
import { createComponent } from '../../components/Component';
import { useBound, useMap } from '../../hooks';
import type { PromiseMaybe } from '@anupheaus/common';
import { is } from '@anupheaus/common';

interface Props<SubscribePayload, InvokePayload> {
  children: ReactNode;
  onSubscribed?(id: string, payload: SubscribePayload, callback: (payload: InvokePayload) => PromiseMaybe<void>, groupId?: string, groupCreated?: boolean, debug?: boolean): PromiseMaybe<void>;
  onUnsubscribed?(id: string, groupId?: string, groupDestroyed?: boolean, debug?: boolean): void;
}

export function useSubscriptionProvider<SubscribePayload, InvokePayload>(subscription: Subscription<SubscribePayload, InvokePayload>) {
  const subscriptionCallbacks = useMap<string, (payload: InvokePayload) => PromiseMaybe<void>>();
  const { onSubscribingCallbackAction = 'none' } = subscription[subscriptionInternal].config;
  const groupedCallbacks = useMap<string, Set<string>>();
  const idToGroup = useMap<string, string>();
  const lastInvocationPayload = useMap<string | undefined, InvokePayload>();

  const invoke = useBound(async (payload: InvokePayload, groupId?: string, _debug?: boolean) => {
    const callbacksToInvoke = (() => {
      if (is.not.empty(groupId)) return Array.from((groupedCallbacks.get(groupId) ?? new Set()).keys()).map(id => subscriptionCallbacks.get(id)).removeNull();
      return subscriptionCallbacks.toValuesArray();
    })();
    await callbacksToInvoke.forEachPromise(async callback => await callback(payload));
    lastInvocationPayload.set(groupId, payload);
  });

  const Provider = useMemo(() => {
    const Context = subscriptionContexts.get(subscription);
    if (Context == null) throw new Error('Context not found for the subscription provided.');
    return createComponent('SubscriptionProvider', ({
      children,
      onSubscribed,
      onUnsubscribed,
    }: Props<SubscribePayload, InvokePayload>) => {

      // eslint-disable-next-line react-hooks/rules-of-hooks -- body of a component created via createComponent; hooks run at render time
      const unsubscribe = useBound<SubscriptionContext<SubscribePayload, InvokePayload>['unsubscribe']>((id, debug) => {
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
        onUnsubscribed?.(id, groupId, groupDestroyed, debug);
      });

      // eslint-disable-next-line react-hooks/rules-of-hooks -- body of a component created via createComponent; hooks run at render time
      const subscribe = useBound<SubscriptionContext<SubscribePayload, InvokePayload>['subscribe']>(async (id, payload, callback, groupId, debug) => {
        if (idToGroup.has(id) && idToGroup.get(id) !== groupId) {
          unsubscribe(id, debug);
        }
        subscriptionCallbacks.set(id, callback);
        let groupCreated: boolean | undefined;
        if (is.not.empty(groupId)) {
          const group = groupedCallbacks.getOrSet(groupId, () => {
            groupCreated = true;
            return new Set();
          });
          group.add(id);
          idToGroup.set(id, groupId);
        }
        await onSubscribed?.(id, payload, callback, groupId, groupCreated, debug);
        switch (onSubscribingCallbackAction) {
          case 'callWithLastPayload': {
            const lastPayload = lastInvocationPayload.get(groupId);
            if (lastPayload != null) await callback(lastPayload);
            break;
          }
        }
      });

      // eslint-disable-next-line react-hooks/rules-of-hooks -- body of a component created via createComponent; hooks run at render time
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
