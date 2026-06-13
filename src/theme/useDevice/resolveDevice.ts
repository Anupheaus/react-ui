import type { DeviceType } from './device-models';
import { mobileQuery, touchPointerQuery } from './deviceQueries';

/** Reports whether a given CSS media query currently matches. */
type MediaQueryMatcher = (query: string) => boolean;

/**
 * Resolves the device type from media-query results. Pure and matcher-injected so the precedence rules
 * can be tested without a real `window.matchMedia`.
 *
 * Mobile is checked first because a phone matches both the mobile and the touch queries, and the more
 * specific answer should win.
 */
export function resolveDevice(matches: MediaQueryMatcher): DeviceType {
  if (matches(mobileQuery)) return 'mobile';
  if (matches(touchPointerQuery)) return 'tablet';
  return 'web';
}
