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

  const invoke = useBound(async (payload: InvokePayload, groupId?: string, debug?: boolean) => {
    const callbacksToInvoke = (() => {
      if (is.not.empty(groupId)) return Array.from((groupedCallbacks.get(groupId) ?? new Set()).keys()).map(id => subscriptionCallbacks.get(id)).removeNull();
      return subscriptionCallbacks.toValuesArray();
    })();
    if (debug) console.log('[React-UI] Invoking callbacks', { payload, groupId, callbacksToInvoke }); // eslint-disable-line no-console
    await callbacksToInvoke.forEachPromise(async callback => await callback(payload));
    if (debug) console.log('[React-UI] Storing last invocation payload', { payload, groupId }); // eslint-disable-line no-console
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

      const unsubscribe = useBound<SubscriptionContext<SubscribePayload, InvokePayload>['unsubscribe']>((id, debug) => {
        if (debug) console.log('[React-UI] Unsubscribing callback', { id }); // eslint-disable-line no-console
        subscriptionCallbacks.delete(id);
        let groupDestroyed: boolean | undefined;
        const groupId = idToGroup.get(id);
        if (is.not.empty(groupId)) {
          if (debug) console.log('[React-UI] Callback found in group, removing callback from group', { id, groupId }); // eslint-disable-line no-console
          const group = groupedCallbacks.get(groupId);
          if (group != null) {
            group.delete(id);
            if (group.size === 0) {
              if (debug) console.log('[React-UI] Group is empty, removing group', { groupId }); // eslint-disable-line no-console
              groupedCallbacks.delete(groupId);
              groupDestroyed = true;
            }
          }
        }
        idToGroup.delete(id);
        if (debug) console.log('[React-UI] Calling onUnsubscribed', { id, groupId, groupDestroyed }); // eslint-disable-line no-console
        onUnsubscribed?.(id, groupId, groupDestroyed, debug);
      });

      const subscribe = useBound<SubscriptionContext<SubscribePayload, InvokePayload>['subscribe']>(async (id, payload, callback, groupId, debug) => {
        if (idToGroup.has(id) && idToGroup.get(id) !== groupId) {
          if (debug) console.log('[React-UI] Callback is in another group, removing callback from previous group', { id, previousGroupId: idToGroup.get(id) }); // eslint-disable-line no-console
          unsubscribe(id, debug);
        }
        subscriptionCallbacks.set(id, callback);
        if (debug) console.log('[React-UI] Subscribing callback', { id, payload, callback, groupId, subscriptionCallbacks: Array.from(subscriptionCallbacks.entries()) }); // eslint-disable-line no-console
        let groupCreated: boolean | undefined;
        if (is.not.empty(groupId)) {
          if (debug) console.log('[React-UI] Adding callback to group', { id, groupId }); // eslint-disable-line no-console
          const group = groupedCallbacks.getOrSet(groupId, () => {
            groupCreated = true;
            return new Set();
          });
          group.add(id);
          idToGroup.set(id, groupId);
          if (debug) console.log('[React-UI] Added callback to group', { id, groupId, groupCreated }); // eslint-disable-line no-console
        }
        if (debug) console.log('[React-UI] Calling onSubscribed', { id, payload, callback, groupId, groupCreated }); // eslint-disable-line no-console
        await onSubscribed?.(id, payload, callback, groupId, groupCreated, debug);
        switch (onSubscribingCallbackAction) {
          case 'callWithLastPayload': {
            const lastPayload = lastInvocationPayload.get(groupId);
            if (debug) console.log('[React-UI] Calling callback with last payload', { id, groupId, lastPayload }); // eslint-disable-line no-console
            if (lastPayload != null) await callback(lastPayload);
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
