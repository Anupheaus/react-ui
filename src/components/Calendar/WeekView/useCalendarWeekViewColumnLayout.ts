import { useLayoutEffect, useState } from 'react';
import { measureVerticalScrollbarWidth } from '../../Scroller/measureVerticalScrollbarWidth';

interface CalendarWeekViewColumnLayout {
  scrollerContainerRef(element: HTMLDivElement | null): void;
  dayColumnsElementRef(element: HTMLDivElement | null): void;
  dayColumnsAreaWidth: number | undefined;
  verticalScrollbarWidth: number;
}

export function useCalendarWeekViewColumnLayout(
  columnCount: number,
  gridHeight: number,
): CalendarWeekViewColumnLayout {
  const [scrollerContainerElement, setScrollerContainerElement] = useState<HTMLDivElement | null>(null);
  const [dayColumnsElement, setDayColumnsElement] = useState<HTMLDivElement | null>(null);
  const [dayColumnsAreaWidth, setDayColumnsAreaWidth] = useState<number | undefined>();
  const [verticalScrollbarWidth, setVerticalScrollbarWidth] = useState(0);

  useLayoutEffect(() => {
    if (scrollerContainerElement == null && dayColumnsElement == null) return;

    const report = () => {
      if (scrollerContainerElement != null) {
        setVerticalScrollbarWidth(measureVerticalScrollbarWidth(scrollerContainerElement));
      }
      if (dayColumnsElement != null) {
        setDayColumnsAreaWidth(dayColumnsElement.clientWidth);
      }
    };

    report();
    const resizeObserver = new ResizeObserver(report);
    if (scrollerContainerElement != null) resizeObserver.observe(scrollerContainerElement);
    if (dayColumnsElement != null) resizeObserver.observe(dayColumnsElement);

    return () => resizeObserver.disconnect();
  }, [columnCount, dayColumnsElement, gridHeight, scrollerContainerElement]);

  return {
    scrollerContainerRef: setScrollerContainerElement,
    dayColumnsElementRef: setDayColumnsElement,
    dayColumnsAreaWidth,
    verticalScrollbarWidth,
  };
}
