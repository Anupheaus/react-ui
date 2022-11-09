import { is, MapOf } from 'anux-common';
import { createMakeStyles, CSSObject } from 'tss-react';
import { GetThemeDefinition, Theme } from './themeModels';
import { useThemesProvider } from './ThemesProvider';

interface CreateStylesUtils {
  useTheme<TTheme extends Theme>(theme: TTheme): GetThemeDefinition<TTheme>;
}

export interface UseStylesApi<TStyles extends MapOf<CSSObject>> {
  css: Record<keyof TStyles, string>;
  join(...classNames: (string | boolean | undefined)[]): string;
}

type UseStyles<TStyles extends MapOf<CSSObject>> = () => UseStylesApi<TStyles>;

export function createStyles<TStyles extends MapOf<CSSObject>>(styles: TStyles): UseStyles<TStyles>;
export function createStyles<TStyles extends MapOf<CSSObject>>(delegate: (utils: CreateStylesUtils) => TStyles): UseStyles<TStyles>;
export function createStyles<TStyles extends MapOf<CSSObject>>(arg: ((utils: CreateStylesUtils) => TStyles) | TStyles): UseStyles<TStyles> {
  const makeStyles = createMakeStyles({ useTheme: () => ({}) }).makeStyles;
  const useStyles = makeStyles<CreateStylesUtils>({ name: 'anux' })((_theme, { useTheme }) => is.function(arg) ? arg({ useTheme }) : arg);
  return () => {
    const { useTheme } = useThemesProvider();
    const { classes: css, cx: join } = useStyles({ useTheme });
    return {
      css,
      join,
    } as UseStylesApi<TStyles>;
  };
}