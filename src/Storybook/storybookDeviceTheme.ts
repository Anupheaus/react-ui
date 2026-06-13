import type { DeviceType, Theme } from '../theme';
import { DefaultTheme } from '../theme/themes/DefaultTheme';

/*
 * In production `pseudoClasses.tablet` / `pseudoClasses.mobile` are real `@media(pointer: ...)` queries
 * that only match on genuine touch hardware. Storybook runs on a desktop browser, so to *simulate* a
 * device we instead key those pseudo-classes off a class on an ancestor element, which we can opt into.
 *
 * These `.is-storybook-*` selectors only ever exist on this Storybook-built theme — the shipped
 * `DefaultTheme` is never altered, so nothing storybook-specific can leak into a production bundle.
 */
const storybookTabletSelector = '.is-storybook-tablet &';
const storybookMobileSelector = '.is-storybook-mobile &';

/** The `DefaultTheme`, with the device pseudo-classes rewired to class selectors when simulating a device. */
export function storybookDeviceTheme(device: DeviceType): Theme {
  if (device === 'web') return DefaultTheme;
  return {
    ...DefaultTheme,
    pseudoClasses: {
      ...DefaultTheme.pseudoClasses,
      tablet: storybookTabletSelector,
      mobile: storybookMobileSelector,
    },
  };
}

// A simulated mobile is also a touch device, so it must trigger BOTH the tablet and mobile styles —
// exactly as a real phone matches both `@media(pointer: coarse)` and the narrow-width mobile query.
const deviceClassNames: Record<DeviceType, string> = {
  web: '',
  tablet: 'is-storybook-tablet',
  mobile: 'is-storybook-tablet is-storybook-mobile',
};

/** The ancestor class(es) that activate the simulated device pseudo-classes for the given device. */
export function storybookDeviceClassName(device: DeviceType): string {
  return deviceClassNames[device];
}
