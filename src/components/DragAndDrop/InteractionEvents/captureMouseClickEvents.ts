import { calculateIfEventIsOverElement, cloneEvent } from './InterationEventUtils';
import { UseInteractionEventsProps } from './useInteractionEvents';

export function captureMouseClickEvents(detachEvents: Set<() => void>, element: HTMLElement, { data, onMouseUp, onMouseDown }: UseInteractionEventsProps): void {
  const wrappedHandler = (event: MouseEvent) => {
    if (!calculateIfEventIsOverElement(event, element)) return;
    const newEvent = cloneEvent(event, data, element);
    if (event.type === 'mouseup') onMouseUp?.(newEvent as any);
    if (event.type === 'mousedown') onMouseDown?.(newEvent as any);
  };
  document.body.addEventListener('mouseup', wrappedHandler);
  document.body.addEventListener('mousedown', wrappedHandler);
  detachEvents.add(() => document.body.removeEventListener('mouseup', wrappedHandler));
}