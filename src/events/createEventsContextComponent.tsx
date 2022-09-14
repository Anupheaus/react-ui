import { Context, useContext, useEffect, useMemo, useRef } from 'react';
import { anuxPureFC } from '../anuxComponents';
import { useBound } from '../hooks/useBound';
import { AnuxEvent } from './AnuxEvent';
import { OnEventType } from './models';
import { ContextProps } from './context';

export interface ContextComponentProps {
  stopPropagation?: boolean;
  onEvent?: OnEventType;
}

export function createEventsContextComponent<T extends AnuxEvent = AnuxEvent>(ContextType: Context<ContextProps<T>>, componentName: string) {
  return anuxPureFC<ContextComponentProps>(componentName, ({
    stopPropagation = false,
    children,
  }) => {
    const { isParentAvailable, registerListener: registerListenerOnParent, trigger: triggerOnParent } = useContext(ContextType);
    const listeners = useRef(new Set<OnEventType<T>>()).current;
    const eventsProcessed = useRef(new WeakSet<AnuxEvent>()).current;

    const processEvent = useBound(async (event: T) => {
      if (eventsProcessed.has(event)) return;
      eventsProcessed.add(event);
      if (stopPropagation) event.stopPropagation();
      await Promise.allSettled(listeners.map(listener => listener(event)));
      if (!event.canBubble) return;
    });

    const trigger = useBound<OnEventType<T>>(async event => {
      await processEvent(event);
      if (isParentAvailable && event.canBubble) await triggerOnParent(event);
    });

    const registerListener = useBound((onEvent: OnEventType<T>) => {
      listeners.add(onEvent);
      return () => { listeners.delete(onEvent); };
    });

    useEffect(() => {
      if (!isParentAvailable) return;
      return registerListenerOnParent(processEvent);
    }, []);

    const context = useMemo<ContextProps<T>>(() => ({
      isParentAvailable: true,
      trigger,
      registerListener,
    }), []);

    return (
      <ContextType.Provider value={context}>
        {children ?? null}
      </ContextType.Provider>
    );
  });
}
