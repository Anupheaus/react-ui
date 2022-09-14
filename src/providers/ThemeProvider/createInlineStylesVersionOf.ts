import { DeepPartial, is } from 'anux-common';
import { ThemeTypeDefinition } from './createThemeFor';
import { getInternalsFrom } from './ThemeInternals';
import { ThemeType } from './ThemeModels';

export function createInlineStylesVersionOf() {
  return <TTheme extends ThemeType>(theme: ThemeTypeDefinition<TTheme>, styles: DeepPartial<TTheme['styles']>) => {
    const { name } = getInternalsFrom(theme);
    return Object.entries(styles).reduce((acc, [key, value]) => ({
      ...acc,
      [`--${name}-${key}`]: is.number(value) ? `${value}px` : value,
    }), {});
  };
}
