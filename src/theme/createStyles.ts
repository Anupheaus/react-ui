import { AnyObject, DeepPartial, is, MapOf } from '@anupheaus/common';
import { createMakeStyles, CSSObject } from 'tss-react';
import { GetThemeDefinition, Theme } from './themeModels';
// import { useThemesProvider } from './useThemesProvider';

interface UseStylesApi<TStyles extends MapOf<CSSObject>, TVariants extends MapOf<Theme>> {
  css: { [K in keyof TStyles]: string; };
  variants: TVariants;
  join(...classNames: (string | boolean | undefined)[]): string | undefined;
  join(...themes: Theme[]): Theme[];
}

type UseTheme = <TTheme extends Theme>(theme: TTheme) => GetThemeDefinition<TTheme>;

interface UseStylesUtils {
  useTheme: UseTheme;
  createThemeVariant<TTheme extends Theme>(theme: TTheme, themeVariant: DeepPartial<GetThemeDefinition<TTheme>>): TTheme;
}

type UseStyles<TStyles extends MapOf<CSSObject>, TVariants extends MapOf<Theme>> = (props?: AnyObject) => UseStylesApi<TStyles, TVariants>;

type UseStylesDelegate<TStyles extends MapOf<CSSObject>, TVariants extends MapOf<Theme>> = (utils: UseStylesUtils, props: AnyObject) => {
  styles: TStyles;
  variants?: TVariants;
};

interface MakeStylesUtils extends UseStylesUtils {
  props: AnyObject;
  variants: MapOf<Theme>;
}

function filterClassNames(value: string | boolean | Theme | undefined): boolean {
  if (typeof (value) === 'string') return value.trim().length > 0;
  if (is.plainObject(value) && is.not.empty(value.id)) return true;
  return false;
}

export function createStyles<TStyles extends MapOf<CSSObject>, TVariants extends MapOf<Theme>>(delegate: UseStylesDelegate<TStyles, TVariants>): UseStyles<TStyles, TVariants>;
export function createStyles<TStyles extends MapOf<CSSObject>>(styles: TStyles): UseStyles<TStyles, {}>;
export function createStyles<TStyles extends MapOf<CSSObject>, TVariants extends MapOf<Theme>>(stylesOrDelegate: TStyles | UseStylesDelegate<TStyles, TVariants>): UseStyles<TStyles, TVariants> {
  const makeStyles = createMakeStyles({ useTheme: () => ({}) }).makeStyles;
  const useStylesInnerFunc = makeStyles<MakeStylesUtils>({ name: 'anux' })((_theme, { props, variants, ...utils }) => {
    const renderedStyles = ((is.function(stylesOrDelegate) ? stylesOrDelegate(utils, props) : stylesOrDelegate) ?? {}) as ReturnType<UseStylesDelegate<TStyles, TVariants>>;
    Object.assign(variants, renderedStyles.variants ?? {});
    return renderedStyles.styles ?? {};
  });

  function useStyles(props: AnyObject = {}) {
    const utils = require('./useThemesProvider').useThemesProvider();
    const variants = {} as TVariants;
    const { classes: css, cx } = useStylesInnerFunc({ ...utils, variants, props });
    const join = (...classNames: (string | boolean | undefined | Theme)[]) => {
      classNames = classNames.filter(filterClassNames);
      if (classNames.length <= 0) return undefined;
      if (is.theme(classNames[0])) return classNames;
      return cx(...(classNames as (string | boolean | undefined)[]));
    };
    return { css, variants, join } as UseStylesApi<TStyles, TVariants>;
  }

  return useStyles;
}
