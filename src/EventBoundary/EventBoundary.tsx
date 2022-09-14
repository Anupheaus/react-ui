import { SyntheticEvent } from 'react';
import { anuxPureFC } from '../anuxComponents';
import { useDelegatedBound } from '../hooks/useBound';
import { Flex } from '../components';


type EventSettings = boolean;

interface Props {
  className?: string;
  allMouseEvents?: EventSettings;
  initialMouseEvents?: EventSettings;
  allFocusEvents?: EventSettings;
  allDragEvents?: EventSettings;
  initialDragEvents?: EventSettings;

}

export const EventBoundary = anuxPureFC<Props>('EventBoundary', ({
  allMouseEvents = false,
  initialMouseEvents = false,
  allFocusEvents = false,
  allDragEvents = false,
  initialDragEvents = false,
  className,
  children = null,
}) => {
  const handleEvent = useDelegatedBound((eventName: string, ...settings: EventSettings[]) => (event: SyntheticEvent) => settings.forEach(setting => {
    if (setting === true) event.stopPropagation();
  }));

  return (
    <Flex
      tagName="event-boundary"
      className={className}
      onMouseDown={handleEvent('down', allMouseEvents, initialMouseEvents)}
      onMouseUp={handleEvent('up', allMouseEvents)}
      onMouseMove={handleEvent('move', allMouseEvents)}
      onTouchStart={handleEvent('start', allMouseEvents, initialMouseEvents)}
      onTouchMove={handleEvent('move', allMouseEvents)}
      onTouchEnd={handleEvent('end', allMouseEvents)}
      onDragStart={handleEvent('start', allDragEvents, initialDragEvents)}
      onDrag={handleEvent('move', allDragEvents)}
      onDragEnd={handleEvent('end', allDragEvents)}
      onClick={handleEvent('click', allMouseEvents)}
      onFocus={handleEvent('focus', allFocusEvents)}
      onBlur={handleEvent('blur', allFocusEvents)}
    >
      {children}
    </Flex>
  );
});