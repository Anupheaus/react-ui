import { DeepPartial } from '@anupheaus/common';
import type { LegacyTheme, ThemeConfig, ThemeDefinition, ThemeIcons } from './themeModels';

export function createTheme<D extends ThemeDefinition, I extends ThemeIcons>(config: ThemeConfig<D, I>): LegacyTheme<D, I> {
  const theme = config as LegacyTheme<D, I>;
  theme.createVariant = ((variant: DeepPartial<Omit<ThemeConfig<D, I>, 'id'>>) => createTheme({ ...Object.merge({}, theme, variant), id: config.id }));
  return theme;
}
