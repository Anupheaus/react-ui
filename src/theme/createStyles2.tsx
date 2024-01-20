import { createMakeStyles, CSSObject } from 'tss-react';
import { AnyObject, DeepPartial, is, MapOf } from '@anupheaus/common';
import { CSSProperties, NamedExoticComponent, ReactNode, useContext, useMemo } from 'react';
import { ThemeContext } from './ThemeContext';
import { DefaultTheme } from './themes';
import { ThemeProvider } from './ThemeProvider2';

type BaseTheme = typeof DefaultTheme;

type StylesType = MapOf<CSSObject>;

type UseStylesType<TTheme extends BaseTheme, TStyles extends StylesType> = () => {
  css: { [K in keyof TStyles]: string; };
  theme: TTheme;
  alterTheme(delegate: (theme: TTheme) => DeepPartial<TTheme>): NamedExoticComponent<{ children: ReactNode; }>;
  join(...classNames: (string | boolean | undefined)[]): string | undefined;
  toPx(value: number | string | undefined): string | undefined;
  useInlineStyle(delegate: () => CSSObject, dependencies?: unknown[]): CSSProperties;
};

type CreateStylesType<TTheme extends BaseTheme> = <TStyles extends StylesType>(stylesOrDelegate: TStyles | ((theme: TTheme) => TStyles)) => UseStylesType<TTheme, TStyles>;

function createTheme<TTheme extends BaseTheme>(): CreateStylesType<TTheme> {
  return <TStyles extends StylesType>(stylesOrDelegate: TStyles | ((theme: TTheme) => TStyles)): UseStylesType<TTheme, TStyles> => {
    const makeStyles = createMakeStyles({ useTheme: () => ({}) }).makeStyles;
    const useStylesInnerFunc = makeStyles<TTheme>({ name: 'react-ui' })((_ignore, providedTheme, classes) => {
      const result = (is.function(stylesOrDelegate) ? stylesOrDelegate(providedTheme) : stylesOrDelegate) ?? {};
      const keys = Object.keys(result);
      Reflect.walk(result, ({ name, rename }) => {
        if (!name.includes('$')) return;
        const foundKey = keys.find(key => name.includes(`$${key}`));
        if (foundKey) rename(name.replace(`$${foundKey}`, (classes as AnyObject)[foundKey]));
      });
      return result;
    });

    return () => {
      const { theme, isValid } = useContext(ThemeContext);
      const themeInUse = (isValid ? theme : DefaultTheme) as TTheme;
      const { classes: css, cx } = useStylesInnerFunc(themeInUse);

      return {
        css: css as { [K in keyof TStyles]: string; },
        theme: themeInUse,
        alterTheme: (delegate: (theme: TTheme) => DeepPartial<TTheme>): NamedExoticComponent<{ children: ReactNode; }> => useMemo(() => {
          const alteredTheme = Object.merge({}, themeInUse, delegate(themeInUse as TTheme));
          return ({ children }: { children: ReactNode; }) => (
            <ThemeProvider theme={alteredTheme}>{children}</ThemeProvider>
          );
        }, [themeInUse]) as NamedExoticComponent<{ children: ReactNode; }>,
        join(...classNames: (string | boolean | undefined)[]): string | undefined {
          classNames = classNames.filter(is.not.empty);
          if (classNames.length <= 0) return;
          return cx(...(classNames as (string | boolean | undefined)[]));
        },
        toPx(value: number | string | undefined): string | undefined {
          if (value == null) return;
          if (is.number(value)) return `${value}px`;
          if (is.string(value) && value.endsWith('px')) return value;
        },
        useInlineStyle: (delegate: () => CSSObject, dependencies: unknown[] = []) => useMemo(delegate, dependencies) as CSSProperties,
      };
    };
  };
}

export const createStyles = createTheme();
