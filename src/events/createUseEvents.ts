import { ConstructorOf, is } from 'anux-common';
import { Context, useContext, useEffect } from 'react';
import { useBound } from '../useBound';
import { AnuxEvent } from './AnuxEvent';
import { ContextProps } from './context';
import { OnEventType } from './models';

type OnEventDelegate<T extends AnuxEvent> = {
  (type: ConstructorOf<T>, callback: OnEventType<T>): () => void;
  (callback: OnEventType<T>): () => void;
};

interface Listener<T extends AnuxEvent> {
  type: ConstructorOf<T>;
  callback: OnEventType<T>;
}

export function createUseEvents<T extends AnuxEvent = AnuxEvent>(ContextType: Context<ContextProps<T>>) {
  return () => {
    const { isParentAvailable, registerListener, trigger } = useContext(ContextType);
    if (!isParentAvailable) throw new Error('There is no parent context to subscribe to for this useEvents hook.');
    const listeners = new Set<Listener<T>>();

    const onEvent = useBound(((typeOrCallback: ConstructorOf<T> | OnEventType<T>, maybeCallback?: OnEventType<T>) => {
      const callback = (maybeCallback ?? typeOrCallback) as OnEventType<T>;
      const type = ((is.function(maybeCallback) ? typeOrCallback : undefined) ?? AnuxEvent) as ConstructorOf<T>;
      const listener: Listener<T> = { type, callback };
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    }) as OnEventDelegate<T>);

    useEffect(() => registerListener(async event => {
      await Promise.allSettled(listeners.map(async ({ type, callback }) => {
        if (!(event instanceof type)) return;
        await callback(event);
      }));
    }), []);

    return {
      trigger,
      onEvent,
    };
  };
}