import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { DeviceType } from '../theme';
import type { ThemeContextProps } from '../theme/ThemeContext';
import { ThemeContext } from '../theme/ThemeContext';
import { createStyles } from '../theme/createStyles';
import { createComponent } from '../components/Component';
import { Tag } from '../components/Tag';
import { storybookDeviceClassName, storybookDeviceTheme } from './storybookDeviceTheme';

interface Props {
  device: DeviceType;
  children: ReactNode;
}

const useStyles = createStyles({
  // `display: contents` keeps this wrapper out of the layout — it generates no box of its own — while
  // still acting as the DOM ancestor whose `.is-storybook-*` class the simulated pseudo-classes hang off.
  wrapper: {
    display: 'contents',
  },
});

/**
 * Storybook-only provider that makes its children render as though they are on the given device. It
 * supplies the device type on the theme context (so `useStyles().device` reports it) and, for touch
 * devices, swaps the device pseudo-classes for class selectors that the wrapper element activates.
 *
 * `web` is a pure passthrough so non-simulated stories render exactly as they always have.
 */
export const StorybookDeviceProvider = createComponent('StorybookDeviceProvider', ({ device, children }: Props) => {
  const { css, join } = useStyles();

  const context = useMemo<ThemeContextProps>(() => ({
    theme: storybookDeviceTheme(device),
    isValid: true,
    device,
  }), [device]);

  if (device === 'web') return <>{children}</>;

  return (
    <ThemeContext.Provider value={context}>
      <Tag name="storybook-device" className={join(css.wrapper, storybookDeviceClassName(device))}>
        {children}
      </Tag>
    </ThemeContext.Provider>
  );
});
