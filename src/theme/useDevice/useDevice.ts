import { useSyncExternalStore } from 'react';
import type { DeviceType } from './device-models';
import { mobileQuery, touchPointerQuery } from './deviceQueries';
import { resolveDevice } from './resolveDevice';

// Used when there is no `matchMedia` to consult (SSR or a non-DOM test environment).
const defaultDevice: DeviceType = 'web';

function hasMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

function getDevice(): DeviceType {
  if (!hasMatchMedia()) return defaultDevice;
  return resolveDevice(query => window.matchMedia(query).matches);
}

function subscribe(notify: () => void): () => void {
  if (!hasMatchMedia()) return () => undefined;
  const mediaQueries = [touchPointerQuery, mobileQuery].map(query => window.matchMedia(query));
  mediaQueries.forEach(mediaQuery => mediaQuery.addEventListener('change', notify));
  return () => mediaQueries.forEach(mediaQuery => mediaQuery.removeEventListener('change', notify));
}

/**
 * Reactively reports the current device type. Re-renders the caller when the device changes — e.g. a
 * tablet rotating or a window resizing across the mobile breakpoint.
 */
export function useDevice(): DeviceType {
  return useSyncExternalStore(subscribe, getDevice, () => defaultDevice);
}
