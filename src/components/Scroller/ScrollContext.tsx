import type { ReactNode } from 'react';
import { createContext, useState, useCallback } from 'react';

export interface ScrollContextValue {
  scrollTop: number;
  scrollLeft: number;
  scrollRight: number;
  scrollBottom: number;
}

export interface ScrollContextValueWithReport extends ScrollContextValue {
  reportScroll?(data: ScrollContextValue): void;
}

export const ScrollContext = createContext<ScrollContextValueWithReport | null>(null);

export function ScrollContextProvider({ children }: { children: ReactNode }) {
  const [scroll, setScroll] = useState<ScrollContextValue>({
    scrollTop: 0,
    scrollLeft: 0,
    scrollRight: 0,
    scrollBottom: 0,
  });
  const reportScroll = useCallback((data: ScrollContextValue) => setScroll(data), []);
  return (
    <ScrollContext.Provider value={{ ...scroll, reportScroll }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function getScrollContextValueFromElement(element: HTMLDivElement): ScrollContextValue {
  const scrollTop = element.scrollTop;
  const scrollLeft = element.scrollLeft;
  const scrollRight = element.scrollWidth - element.clientWidth - scrollLeft;
  const scrollBottom = element.scrollHeight - element.clientHeight - scrollTop;
  return { scrollTop, scrollLeft, scrollRight, scrollBottom };
}
