import { createContext } from 'react';
import { AnuxEvent } from './AnuxEvent';
import { ContextProps } from './context';
import { createEventsContextComponent } from './createEventsContextComponent';
import { createUseEvents } from './createUseEvents';

export function createEventsContext<T extends AnuxEvent = AnuxEvent>(contextName: string) {
  const Context = createContext<ContextProps<T>>({
    isParentAvailable: false,
    trigger: () => void 0,
    registerListener: () => () => void 0,
  });
  const EventsContext = createEventsContextComponent(Context, contextName);
  const useEvents = createUseEvents(Context);

  return { EventsContext, useEvents };
}

const { EventsContext, useEvents } = createEventsContext('EventsContext');

export {
  EventsContext,
  useEvents,
};
