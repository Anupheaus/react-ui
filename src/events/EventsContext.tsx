import { Context, useContext, useEffect, useMemo, useRef } from 'react';
import { anuxPureFC } from '../anuxComponents';
import { useBound } from '../useBound';
import { AnuxEvent } from './AnuxEvent';
import { OnEventType } from './models';
import { ContextProps } from './context';

interface Props {
  stopPropagation?: boolean;
  onEvent?: OnEventType;
}

export function createEventsContextComponent(ContextType: Context<ContextProps>, componentName: string) {
  return anuxPureFC<Props>(componentName, ({
    stopPropagation = false,
    children,
  }) => {
    const { isParentAvailable, registerListener: registerListenerOnParent, trigger: triggerOnParent } = useContext(ContextType);
    const listeners = useRef(new Set<OnEventType>()).current;
    const eventsProcessed = useRef(new WeakSet<AnuxEvent>()).current;

    const processEvent = useBound((event: AnuxEvent) => {
      if (eventsProcessed.has(event)) return;
      eventsProcessed.add(event);
      if (stopPropagation) event.stopPropagation();
      listeners.forEach(listener => listener(event));
      if (!event.canBubble) return;
    });

    const trigger = useBound<OnEventType>(event => {
      processEvent(event);
      if (isParentAvailable && event.canBubble) triggerOnParent(event);
    });

    const registerListener = useBound((onEvent: OnEventType) => {
      listeners.add(onEvent);
      return () => { listeners.delete(onEvent); };
    });

    useEffect(() => {
      if (!isParentAvailable) return;
      return registerListenerOnParent(processEvent);
    }, []);

    const context = useMemo<ContextProps>(() => ({
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