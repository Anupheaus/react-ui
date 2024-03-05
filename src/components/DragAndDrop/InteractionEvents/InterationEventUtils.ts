import { AnyObject, is } from '@anupheaus/common';
import '../../../extensions/HTMLElement';

export function cloneEvent(event: MouseEvent, data: AnyObject | undefined, element: HTMLElement): MouseEvent {
  const definitionsMap = Reflect.getAllDefinitions(event);
  const newEvent: AnyObject = {};
  Object.entries(definitionsMap).forEach(([key, { get, value }]) => {
    if (is.function(value)) newEvent[key] = value.bind(event);
    if (is.function(get)) Reflect.defineProperty(newEvent, key, { value: get.bind(event)(), configurable: true, writable: true, enumerable: true });
    if (value !== undefined) newEvent[key] = value;
  });
  newEvent.data = data;
  newEvent.target = element;
  return newEvent as MouseEvent;
}

export function calculateIfEventIsOverElement(event: MouseEvent, element: HTMLElement) {
  const coordinates = element.pageCoordinates();
  const dimensions = element.dimensions();
  const isOverElementX = event.pageX >= coordinates.x && event.pageX < coordinates.x + dimensions.width;
  const isOverElementY = event.pageY >= coordinates.y && event.pageY < coordinates.y + dimensions.height;
  return isOverElementX && isOverElementY;
}
