import { useRef } from 'react';

const clickEventNames = ['mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu', 'wheel'];
const mouseEventNames = ['mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', ...clickEventNames];
const focusEventNames = ['focus', 'focusin', 'focusout', 'blur'];

type EventSetting = boolean | 'propagation' | 'default';

type EventProps = [string, EventSetting];

function createEventHandler(setting: EventSetting) {
  return (event: Event) => {
    if (setting === false) return;
    if (setting === true || setting === 'propagation') { event.stopPropagation(); }
    if (setting === true || setting === 'default') event.preventDefault();
  };
}

function addToEvents(events: EventProps[], setting: EventSetting, eventNames: string[]) {
  eventNames.forEach(eventName => events.push([eventName, setting]));
}

interface Props {
  allMouseEvents?: EventSetting;
  clickEvents?: EventSetting;
  focusEvents?: EventSetting;
  onParentElement?: boolean;
}

export function useEventIsolator({ allMouseEvents = false, clickEvents = false, focusEvents = false, onParentElement = false }: Props) {
  const uninstallRef = useRef<() => void>(() => void 0);

  return (element: HTMLElement | null) => {
    uninstallRef.current();
    if (onParentElement && element != null) element = element.parentElement;
    if (element == null) return;
    const eventsToCapture: EventProps[] = [];
    const uninstallEvents: (() => void)[] = [];

    if (allMouseEvents !== false) addToEvents(eventsToCapture, allMouseEvents, mouseEventNames);
    if (clickEvents !== false) addToEvents(eventsToCapture, clickEvents, clickEventNames);
    if (focusEvents !== false) addToEvents(eventsToCapture, focusEvents, focusEventNames);

    eventsToCapture.forEach(([eventName, setting]) => {
      const handler = createEventHandler(setting);
      element!.addEventListener(eventName, handler, { passive: setting !== 'default' && setting !== true });
      uninstallEvents.push(() => element!.removeEventListener(eventName, handler));
    });
    uninstallRef.current = () => uninstallEvents.forEach(uninstall => uninstall());
  };
}