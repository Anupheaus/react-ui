export * from './AnuxEvent';
import { createContext } from 'react';
import { ContextProps } from './context';
import { createEventsContextComponent } from './EventsContext';
import { createUseEvents } from './useEvents';

function createEventsContext(contextName: string) {
  const Context = createContext<ContextProps>({
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
  createEventsContext,
};