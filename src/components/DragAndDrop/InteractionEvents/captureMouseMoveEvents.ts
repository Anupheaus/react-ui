import { MouseEnteredEvent, MouseLeaveEvent, MouseMoveEvent } from './InteractionEvents';
import { calculateIfEventIsOverElement, cloneEvent } from './InterationEventUtils';
import { UseInteractionEventsProps } from './useInteractionEvents';

function raiseMouseEntered(oldIsOverElement: boolean, isOverElement: boolean, event: MouseEnteredEvent, onMouseEntered?: (event: MouseEnteredEvent) => void) {
  if (oldIsOverElement === isOverElement || !isOverElement || onMouseEntered == null) return;
  onMouseEntered(event);
}

function raiseMouseMoved(isOverElement: boolean, event: MouseEnteredEvent, onMouseMove?: (event: MouseMoveEvent) => void) {
  if (!isOverElement || onMouseMove == null) return;
  const element = event.target as HTMLElement | null;
  if (element == null) return;
  const { width, height } = element.getBoundingClientRect();
  const { x: elementPageX, y: elementPageY } = element.pageCoordinates();
  const { pageX: eventPageX, pageY: eventPageY } = event;
  const offsetX = eventPageX - elementPageX;
  const offsetY = eventPageY - elementPageY;
  onMouseMove({
    ...event,
    elementPctX: Math.round((offsetX / (width > 0 ? width : 1)) * 100),
    elementPctY: Math.round((offsetY / (height > 0 ? height : 1)) * 100),
  });
}

function raiseMouseLeft(oldIsOverElement: boolean, isOverElement: boolean, event: MouseEnteredEvent, onMouseLeave?: (event: MouseLeaveEvent) => void) {
  if (oldIsOverElement === isOverElement || isOverElement || onMouseLeave == null) return;
  onMouseLeave(event);
}

export function captureMouseMoveEvents(detachEvents: Set<() => void>, element: HTMLElement, { data, onMouseEnter, onMouseLeave, onMouseMove }: UseInteractionEventsProps): void {
  let isOverElement = false;
  const wrappedHandler = (event: MouseEvent) => {
    const oldIsOverElement = isOverElement;
    isOverElement = calculateIfEventIsOverElement(event, element);
    if (oldIsOverElement === isOverElement && !isOverElement) return;
    const newEvent = cloneEvent(event, data, element);
    raiseMouseEntered(oldIsOverElement, isOverElement, newEvent, onMouseEnter);
    raiseMouseMoved(isOverElement, newEvent, onMouseMove);
    raiseMouseLeft(oldIsOverElement, isOverElement, newEvent, onMouseLeave);
  };
  document.body.addEventListener('mousemove', wrappedHandler);
  detachEvents.add(() => document.body.removeEventListener('mousemove', wrappedHandler));
}