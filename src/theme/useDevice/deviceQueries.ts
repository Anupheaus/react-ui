/**
 * The single source of truth for the touch / mobile breakpoints. Both the runtime device detection
 * (`useDevice`) and the CSS `pseudoClasses.tablet` / `pseudoClasses.mobile` media queries in the theme
 * are built from these, so the JavaScript and CSS notions of "tablet" and "mobile" can never drift apart.
 */
const mobileMaxWidthPx = 768;

/** Matches any coarse-pointer (touch) device — our definition of "tablet or smaller". */
export const touchPointerQuery = '(pointer: coarse)';

/** Matches a coarse-pointer device within a phone-sized viewport — our definition of "mobile". */
export const mobileQuery = `${touchPointerQuery} and (max-width: ${mobileMaxWidthPx}px)`;
