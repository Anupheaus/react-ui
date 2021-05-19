import { ConstructorOf } from 'anux-common';
import { Context, useContext, useEffect } from 'react';
import { useBound } from '../useBound';
import { AnuxEvent } from './AnuxEvent';
import { ContextProps } from './context';
import { OnEventType } from './models';

export function createUseEvents(ContextType: Context<ContextProps>) {
  return () => {
    const { isParentAvailable, registerListener, trigger } = useContext(ContextType);
    if (!isParentAvailable) throw new Error('There is no parent context to subscribe to for this useEvents hook.');
    const listeners = new Map<ConstructorOf<AnuxEvent>, Set<OnEventType>>();

    const onEvent = useBound(<T extends AnuxEvent>(type: ConstructorOf<T>, callback: OnEventType) => {
      let callbacks = listeners.get(type);
      if (!callbacks) { callbacks = new Set(); listeners.set(type, callbacks); }
      callbacks.add(callback);
    });

    useEffect(() => registerListener(event => {
      listeners.forEach((callbacks, type) => {
        if (!(event instanceof type)) return;
        callbacks.forEach(callback => callback(event));
      });
    }), []);

    return {
      trigger,
      onEvent,
    };
  };
}