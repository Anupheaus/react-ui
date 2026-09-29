import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import type { WindowState } from '../WindowsModels';
import { fitWindowToContent } from './fitWindowToContent';

/** The window's own content scroller (a Scroller inside the content scrolls itself and is not matched). */
const CONTENT_SCROLLER_SELECTOR = 'window-content > scroller > scroller-container';

interface Props {
  /** Off while the window is still sizing itself, is maximised, or is a bottom sheet (which already fits its content). */
  isEnabled: boolean;
  /** The user has resized the window: from then on its size is theirs, and it is never fitted again. */
  hasUserResized: boolean;
  windowElementRef: RefObject<HTMLElement>;
  setState(changes: Partial<WindowState>): void;
}

/** The size the window has been given (its inline style, set from its state), not a size part-way through a transition. */
function readWindowSize(windowElement: HTMLElement): { width: number; height: number } {
  const width = parseFloat(windowElement.style.width);
  const height = parseFloat(windowElement.style.height);
  return {
    width: Number.isFinite(width) ? width : windowElement.offsetWidth,
    height: Number.isFinite(height) ? height : windowElement.offsetHeight,
  };
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
 * Fits a window to its content: it grows when the content grows past it (a dialog that gains fields after a choice),
 * up to the space it sits in, and gives that growth back when the content goes again. It only ever shrinks by what it
 * grew — never below the height it opened at, and never a window whose content fills it — and it stops for good once
 * the user resizes the window.
 */
export function useFitWindowToContent({ isEnabled, hasUserResized, windowElementRef, setState }: Props): void {
  // setState changes identity every render; the observers read the latest through a ref rather than re-subscribing.
  const setStateRef = useRef(setState);
  setStateRef.current = setState;
  // The height the window opened at, taken once: it is the floor it never shrinks below.
  const openedHeightRef = useRef<number>();
  // The height this hook last grew the window to; while the window is still at it, the growth may be given back.
  const grownHeightRef = useRef<number>();

  useEffect(() => {
    if (!isEnabled || hasUserResized) return;
    const windowElement = windowElementRef.current;
    const scrollerContainer = windowElement?.querySelector<HTMLElement>(CONTENT_SCROLLER_SELECTOR);
    const content = scrollerContainer?.querySelector<HTMLElement>(':scope > scroller-content');
    if (windowElement == null || scrollerContainer == null || content == null) return;
    openedHeightRef.current ??= readWindowSize(windowElement).height;
    const openedHeight = openedHeightRef.current;

    const fitToContent = () => {
      const space = windowElement.parentElement;
      if (space == null) return;
      const windowSize = readWindowSize(windowElement);
      const canShrink = grownHeightRef.current != null && windowSize.height === grownHeightRef.current;
      // Growing needs only the overflow; giving growth back needs the content's own, unstretched height.
      const contentHeight = canShrink ? measureContentHeight(content) : scrollerContainer.scrollHeight;
      const fit = fitWindowToContent({
        window: windowSize,
        overflow: { x: scrollerContainer.scrollWidth - scrollerContainer.clientWidth, y: contentHeight - scrollerContainer.clientHeight },
        space: { width: space.clientWidth, height: space.clientHeight },
        openedHeight,
        canShrink,
      });
      if (fit == null) return;
      grownHeightRef.current = fit.height > openedHeight ? fit.height : undefined;
      setStateRef.current(fit);
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
  }, [isEnabled, hasUserResized, windowElementRef]);
}
