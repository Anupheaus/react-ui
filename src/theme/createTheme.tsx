import { DeepPartial } from 'anux-common';
import type { Theme, ThemeConfig, ThemeDefinition, ThemeIcons } from './themeModels';

export function createTheme<D extends ThemeDefinition, I extends ThemeIcons>(config: ThemeConfig<D, I>): Theme<D, I> {
  const theme = config as Theme<D, I>;
  theme.createVariant = (variant: DeepPartial<Omit<ThemeConfig<D, I>, 'id'>>) => createTheme({ ...Object.merge({}, theme, variant), id: config.id });
  return theme;
}
