import { AnyObject, DeepPartial, is, MapOf } from '@anupheaus/common';
import { createMakeStyles, CSSObject } from 'tss-react';
import { internalThemes } from './internalThemes';
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
  activePseudoClasses: string,
  useTheme: UseTheme;
  createThemeVariant<TTheme extends Theme>(theme: TTheme, themeVariant: DeepPartial<GetThemeDefinition<TTheme>>): TTheme;
}

type UseStyles<TStyles extends MapOf<CSSObject>, TVariants extends MapOf<Theme>> = (props?: AnyObject) => UseStylesApi<TStyles, TVariants>;

type UseStylesDelegate<TStyles extends MapOf<CSSObject>, TVariants extends MapOf<Theme>, TProps extends AnyObject = AnyObject> = (utils: UseStylesUtils, props: TProps) => {
  styles?: TStyles;
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

// eslint-disable-next-line max-len
export function createStyles<TStyles extends MapOf<CSSObject>, TVariants extends MapOf<Theme>, TProps extends AnyObject = AnyObject>(delegate: UseStylesDelegate<TStyles, TVariants, TProps>): UseStyles<TStyles, TVariants>;
export function createStyles<TStyles extends MapOf<CSSObject>>(styles: TStyles): UseStyles<TStyles, {}>;
// eslint-disable-next-line max-len
export function createStyles<TStyles extends MapOf<CSSObject>, TVariants extends MapOf<Theme>, TProps extends AnyObject = AnyObject>(stylesOrDelegate: TStyles | UseStylesDelegate<TStyles, TVariants, TProps>): UseStyles<TStyles, TVariants> {
  const makeStyles = createMakeStyles({ useTheme: () => ({}) }).makeStyles;
  const useStylesInnerFunc = makeStyles<MakeStylesUtils>({ name: 'anux' })((_theme, { props, variants, ...utils }, classes) => {
    const result = (() => {
      if (is.function(stylesOrDelegate)) {
        const renderedStyles = stylesOrDelegate(utils, props as TProps);
        Object.assign(variants, renderedStyles.variants ?? {});
        return renderedStyles.styles ?? {};
      } else {
        return stylesOrDelegate;
      }
    })();
    const keys = Object.keys(result);
    Reflect.walk(result, ({ name, rename }) => {
      if (!name.includes('$')) return;
      const foundKey = keys.find(key => name.includes(`$${key}`));
      if (foundKey) rename(name.replace(`$${foundKey}`, (classes as AnyObject)[foundKey]));
    });
    return result;
  });

  function useStyles(providedProps?: AnyObject) {
    const utils = require('./useThemesProvider').useThemesProvider();
    const variants = {} as TVariants;
    const props = {
      ...internalThemes.styles.synchronousProps,
      ...providedProps,
    };
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
