import { Context } from 'react';
import { ThemeTypeDefinition } from './createThemeFor';
import { ThemeType } from './ThemeModels';

export const ThemeConstant = Symbol('Theme');

export interface ThemeInternals<TTheme extends ThemeType> {
  name: string;
  theme: TTheme;
  context: Context<ThemeTypeDefinition<TTheme> | undefined>;
  generateClassName(): string;
}

export const getInternalsFrom = <TTheme extends ThemeType>(theme: ThemeTypeDefinition<TTheme>): ThemeInternals<TTheme> => (theme as any)[ThemeConstant];
