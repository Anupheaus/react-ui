import { useEffect, useRef } from 'react';
import { useBound } from '../../../hooks/useBound';
import { AnyObject } from '@anupheaus/common';
import { MouseDownEvent, MouseEnteredEvent, MouseLeaveEvent, MouseMoveEvent, MouseUpEvent } from './InteractionEvents';
import { captureMouseMoveEvents } from './captureMouseMoveEvents';
import { captureMouseClickEvents } from './captureMouseClickEvents';

export type EventName = 'mousemove' | 'mouseleave';

export interface UseInteractionEventsProps {
  data?: AnyObject;
  onMouseEnter?(event: MouseEnteredEvent): void;
  onMouseMove?(event: MouseMoveEvent): void;
  onMouseLeave?(event: MouseLeaveEvent): void;
  onMouseUp?(event: MouseUpEvent): void;
  onMouseDown?(event: MouseDownEvent): void;
}

export function useInteractionEvents(props: UseInteractionEventsProps) {
  const detachEventsRef = useRef<() => void>(() => void 0);

  const target = useBound((element: HTMLElement | null) => {
    detachEventsRef.current();
    if (element == null) return;
    const detachEvents = new Set<() => void>();

    captureMouseMoveEvents(detachEvents, element, props);
    captureMouseClickEvents(detachEvents, element, props);

    detachEventsRef.current = () => detachEvents.forEach(detach => detach());
  });

  useEffect(() => () => detachEventsRef.current(), []);

  return target;
}