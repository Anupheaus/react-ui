import type { RefObject } from 'react';
import { useEffect } from 'react';
import type { WindowState } from '../WindowsModels';
import { fitWindowToContent } from './fitWindowToContent';

/** The window's own content scroller (a Scroller inside the content scrolls itself and is not matched). */
const CONTENT_SCROLLER_SELECTOR = 'window-content > scroller > scroller-container';

interface Props {
  /** Off while the window is still sizing itself, is maximised, or is a bottom sheet (which already fits its content). */
  isEnabled: boolean;
  windowElementRef: RefObject<HTMLElement>;
  setState(changes: Partial<WindowState>): void;
}

/**
 * Grows a window when its content grows past it — a dialog that gains fields after a choice — up to the space it sits
 * in, so the new content shows rather than scrolling in a strip the size of the dialog's first render.
 */
export function useFitWindowToContent({ isEnabled, windowElementRef, setState }: Props): void {
  useEffect(() => {
    if (!isEnabled) return;
    const windowElement = windowElementRef.current;
    const scrollerContainer = windowElement?.querySelector<HTMLElement>(CONTENT_SCROLLER_SELECTOR);
    const content = scrollerContainer?.querySelector<HTMLElement>(':scope > scroller-content');
    if (windowElement == null || scrollerContainer == null || content == null) return;

    const growToFit = () => {
      const space = windowElement.parentElement;
      if (space == null) return;
      const fit = fitWindowToContent({
        window: { width: windowElement.offsetWidth, height: windowElement.offsetHeight },
        overflow: { x: scrollerContainer.scrollWidth - scrollerContainer.clientWidth, y: scrollerContainer.scrollHeight - scrollerContainer.clientHeight },
        space: { width: space.clientWidth, height: space.clientHeight },
      });
      if (fit != null) setState(fit);
    };

    // The content box and what is in it: a child that grows wider overflows without resizing the content box itself.
    const observer = new ResizeObserver(growToFit);
    observer.observe(content);
    Array.from(content.children).forEach(child => observer.observe(child));
    return () => observer.disconnect();
  }, [isEnabled, windowElementRef, setState]);
}
