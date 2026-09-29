import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
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
 * The content's own height: the scroller stretches it to fill the window, so for a moment it is measured unstretched.
 * Read synchronously, before the browser paints, so nothing flickers.
 */
function measureContentHeight(content: HTMLElement): number {
  const { minHeight, flex } = content.style;
  content.style.minHeight = '0px';
  content.style.flex = 'none';
  const height = content.offsetHeight;
  content.style.minHeight = minHeight;
  content.style.flex = flex;
  return height;
}

/**
 * Fits a window to its content — growing when the content grows past it, shrinking when it gets shorter — a dialog that gains fields after a choice — up to the space it sits
 * in, so the new content shows rather than scrolling in a strip the size of the dialog's first render.
 */
export function useFitWindowToContent({ isEnabled, windowElementRef, setState }: Props): void {
  // setState changes identity every render; the observers read the latest through a ref rather than re-subscribing.
  const setStateRef = useRef(setState);
  setStateRef.current = setState;
  // The height the window opened at, taken once: it is the floor it never shrinks below.
  const openedHeightRef = useRef<number>();

  useEffect(() => {
    if (!isEnabled) return;
    const windowElement = windowElementRef.current;
    const scrollerContainer = windowElement?.querySelector<HTMLElement>(CONTENT_SCROLLER_SELECTOR);
    const content = scrollerContainer?.querySelector<HTMLElement>(':scope > scroller-content');
    if (windowElement == null || scrollerContainer == null || content == null) return;
    openedHeightRef.current ??= windowElement.offsetHeight;
    const openedHeight = openedHeightRef.current;

    const fitToContent = () => {
      const space = windowElement.parentElement;
      if (space == null) return;
      const fit = fitWindowToContent({
        window: { width: windowElement.offsetWidth, height: windowElement.offsetHeight },
        overflow: { x: scrollerContainer.scrollWidth - scrollerContainer.clientWidth, y: measureContentHeight(content) - scrollerContainer.clientHeight },
        space: { width: space.clientWidth, height: space.clientHeight },
        openedHeight,
      });
      if (fit != null) setStateRef.current(fit);
    };

    // The content box and what is in it: a child that grows wider overflows without resizing the content box itself.
    const resizeObserver = new ResizeObserver(fitToContent);
    resizeObserver.observe(content);
    Array.from(content.children).forEach(child => resizeObserver.observe(child));
    // Content that gets shorter resizes nothing — the scroller keeps it stretched to the window — so fields coming and
    // going is watched for too.
    const mutationObserver = new MutationObserver(fitToContent);
    mutationObserver.observe(content, { childList: true, subtree: true });
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [isEnabled, windowElementRef]);
}
