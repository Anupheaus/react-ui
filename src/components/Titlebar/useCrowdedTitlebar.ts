import type { RefObject } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import type { CrowdedTitlebarState } from './crowdedTitlebar';
import { nextCrowdedTitlebarState } from './crowdedTitlebar';

const ONE_ROW: CrowdedTitlebarState = { isCrowded: false };

/**
 * How narrow, in px, a title cut short can get before it is no longer worth keeping on the one row. A title that still
 * shows a few words with an ellipsis is how a wide titlebar has always looked; one squeezed down to a letter or two (a
 * window on a phone, with an action beside it) says nothing about what the window is.
 */
const UNREADABLE_TITLE_WIDTH_PX = 120;

/** Whether anything in the titlebar's icon and title is cut short to less than {@link UNREADABLE_TITLE_WIDTH_PX}. */
function isCutShort(titlebar: HTMLElement): boolean {
  const headingParts = Array.from(titlebar.querySelectorAll<HTMLElement>(':scope > titlebar-heading *'));
  return headingParts.some(({ scrollWidth, clientWidth }) => scrollWidth > clientWidth + 1 && clientWidth < UNREADABLE_TITLE_WIDTH_PX);
}

/** Moves the state on by what the titlebar measures now. Unchanged state is the same object, so it does not render again. */
function measureInto(titlebar: HTMLElement, setState: (update: (current: CrowdedTitlebarState) => CrowdedTitlebarState) => void): void {
  const { scrollWidth, clientWidth } = titlebar;
  const isHeadingSqueezed = isCutShort(titlebar);
  setState(current => nextCrowdedTitlebarState(current, { scrollWidth, clientWidth, isHeadingSqueezed }));
}

/**
 * Whether a titlebar has more in it than fits its width, so it should wrap (see `nextCrowdedTitlebarState`). Measured
 * after every render and whenever the titlebar or its middle content changes size. Always `false` when not enabled.
 *
 * @returns `isCrowded`, and the ref to put on the titlebar element.
 */
export function useCrowdedTitlebar(isEnabled: boolean): { isCrowded: boolean; titlebarRef: RefObject<HTMLDivElement> } {
  const titlebarRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CrowdedTitlebarState>(ONE_ROW);

  // After every render: content that changes size on its own (a longer fact) is not always seen by the observer below. No
  // dependency list on purpose; `measureInto` sets state only when the layout has to change, so it settles at once.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const titlebar = titlebarRef.current;
    if (isEnabled && titlebar != null) measureInto(titlebar, setState);
  });

  useLayoutEffect(() => {
    const titlebar = titlebarRef.current;
    // jsdom and old engines have no ResizeObserver: the measure after each render is then all there is.
    if (!isEnabled || titlebar == null || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => measureInto(titlebar, setState));
    observer.observe(titlebar);
    const content = titlebar.querySelector(':scope > titlebar-content');
    if (content != null) observer.observe(content);
    return () => observer.disconnect();
  }, [isEnabled]);

  return { isCrowded: isEnabled && state.isCrowded, titlebarRef };
}
