import { ThemeStyles, ThemeType } from './ThemeModels';
import type { MakeStyles } from './Theme';
import { DeepPartial } from 'anux-common';
import { Context, createContext } from 'react';
import { ThemeConstant, ThemeInternals } from './ThemeInternals';
import { ThemeUtils } from './ThemeUtils';

function createThemeClassName<TStylerStyles extends ThemeStyles>(makeStyles: MakeStyles, stylerName: string, styles: TStylerStyles) {
  const useInternalStyles = makeStyles()({
    theme: Object.entries(styles).reduce((acc, [key, value]) => ({
      ...acc,
      [`--${stylerName}-${key}`]: ThemeUtils.convertValueToString(value, key),
    }), {}),
  });

  return () => useInternalStyles().classes.theme;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ThemeTypeDefinition<TTheme extends ThemeType> = TTheme & {
  createVariant(variant: DeepPartial<TTheme>): ThemeTypeDefinition<TTheme>;
};

export function createThemeFor(makeStyles: MakeStyles, context?: Context<any>) {
  function internalCreateTheme<TTheme extends ThemeType>(name: string, theme: TTheme): ThemeTypeDefinition<TTheme> {
    const convertedStyles = Object.entries(theme.styles).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: `var(--${name}-${key}, ${ThemeUtils.convertValueToString(value, key)})`,
    }), {}) as TTheme['styles'];
    const themeInternals: ThemeInternals<TTheme> = {
      name,
      context: context ?? createContext<ThemeTypeDefinition<TTheme> | undefined>(undefined),
      theme: {
        ...theme,
        styles: convertedStyles,
      },
      generateClassName: createThemeClassName(makeStyles, name, theme.styles),
    };
    return {
      [ThemeConstant]: themeInternals,
      createVariant: (themeVariants: DeepPartial<TTheme>) => createThemeFor(makeStyles, themeInternals.context)<TTheme>(name, Object.merge({}, theme, themeVariants)),
      ...theme,
    } as ThemeTypeDefinition<TTheme>;
  }
  return internalCreateTheme;
}