import { useContext } from 'react';
import type { ScrollContextValue } from './ScrollContext';
import { ScrollContext } from './ScrollContext';

export function useScroller(): ScrollContextValue {
  const context = useContext(ScrollContext);
  if (context == null) {
    throw new Error('useScroller must be used within a Scroller or ScrollContextProvider');
  }
  return {
    scrollTop: context.scrollTop,
    scrollLeft: context.scrollLeft,
    scrollRight: context.scrollRight,
    scrollBottom: context.scrollBottom,
  };
}
