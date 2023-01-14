import { useContext } from 'react';
import { InteractionContext } from './InteractionContext';
import { EventName, useInteractionEvents } from './useInteractionEvents';

interface Props {
  captureEvents?: EventName[];
  data?: any;
}

function createHandler(eventName: EventName, { captureEvents = [] }: Props, dispatcher: (event: Event) => void) {
  if (captureEvents.length > 0 && !captureEvents.includes(eventName)) return;
  return (event: Event) => dispatcher(event);
}

export function useInteractionProvider(props: Props = {}) {
  const dispatcher = useContext(InteractionContext);
  return useInteractionEvents({
    data: props.data,
    onMouseMove: createHandler('mousemove', props, dispatcher),
  });
}