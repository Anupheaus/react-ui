/** What the titlebar's layout is currently doing, and the width it had when it was given the wrapped layout. */
export interface CrowdedTitlebarState {
  /** The wrapped layout is on: icon, title and end adornment on one row, the middle content on a row of its own. */
  isCrowded: boolean;
  /** The titlebar's width when the wrapped layout went on. Only set while `isCrowded`. */
  crowdedAtWidth?: number;
}

/** The measurements of the titlebar element that decide its layout. */
export interface TitlebarMeasurement {
  /** The width its content needs (`scrollWidth`). */
  scrollWidth: number;
  /** The width it has (`clientWidth`). */
  clientWidth: number;
  /** The title is cut short (given an ellipsis, or squeezed out) to so little width that it no longer says what this is. */
  isHeadingSqueezed: boolean;
}

/** Sub-pixel rounding between the two widths is not a crowd. */
const ROUNDING_TOLERANCE_PX = 1;

/**
 * The layout a titlebar should have next. It starts on one row, as it always has. It goes to the wrapped layout once its
 * parts need more width than it has, or the title has been squeezed to nothing readable to make room for the rest, and stays there until it is given more width than it was crowded at, when it tries
 * one row again (and comes straight back if that still does not fit). Returns the same object when nothing changes, so
 * setting it as state does not render again.
 */
export function nextCrowdedTitlebarState(state: CrowdedTitlebarState, { scrollWidth, clientWidth, isHeadingSqueezed }: TitlebarMeasurement): CrowdedTitlebarState {
  const { isCrowded, crowdedAtWidth = 0 } = state;
  if (!isCrowded) {
    if (scrollWidth <= clientWidth + ROUNDING_TOLERANCE_PX && !isHeadingSqueezed) return state;
    return { isCrowded: true, crowdedAtWidth: clientWidth };
  }
  if (clientWidth <= crowdedAtWidth + ROUNDING_TOLERANCE_PX) return state;
  return { isCrowded: false };
}
