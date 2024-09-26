import type { CSSObject } from 'tss-react';
import { createMakeStyles } from 'tss-react';
import type { AnyObject, DeepPartial, MapOf } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import type { CSSProperties } from 'react';
import { useContext, useMemo } from 'react';
import { ThemeContext } from './ThemeContext';
import { DefaultTheme } from './themes';
import Color from 'color';

type BaseTheme = typeof DefaultTheme;

type StylesType = MapOf<CSSObject>;

type UseStylesType<TTheme extends BaseTheme, TStyles extends StylesType> = () => {
  css: { [K in keyof TStyles]: string; };
  theme: TTheme;
  tools: ThemeTools;
  alterTheme(delegate: (theme: TTheme) => DeepPartial<TTheme>): TTheme; // NamedExoticComponent<{ children: ReactNode; }>;
  join(...classNames: (string | boolean | undefined)[]): string | undefined;
  toPx(value: number | string | undefined): string | undefined;
  useInlineStyle(delegate: () => CSSObject, dependencies?: unknown[]): CSSProperties | undefined;
};

type CreateStylesType<TTheme extends BaseTheme> = <TStyles extends StylesType>(stylesOrDelegate: TStyles | ((theme: TTheme, tools: ThemeTools) => TStyles)) => UseStylesType<TTheme, TStyles>;

function createThemeTools<ThemeType extends BaseTheme>(theme: ThemeType) {
  return {
    gap(value: number | keyof ThemeType['gaps'] | undefined, defaultValue: number): number {
      if (is.string(value) && (theme.gaps as AnyObject)[value] != null) value = (theme.gaps as AnyObject)[value] as number;
      if (is.number(value)) return value;
      return defaultValue;
    },
    applyTransition(propertyNames: string): CSSProperties {
      return {
        transitionProperty: propertyNames,
        transitionDuration: `${theme.transitions.duration}ms`,
        transitionTimingFunction: theme.transitions.function,
      };
    },
    toPx(value: number | string | undefined, defaultValue: string): string {
      if (value == null) return defaultValue;
      if (is.number(value)) return `${value}px`;
      if (is.string(value) && value.endsWith('px')) return value;
      return value;
    },
    valueOf<T extends AnyObject | undefined>(target: T) {
      return {
        using<S extends keyof NonNullable<T>>(...keys: S[]) {
          function andProperty<K extends keyof NonNullable<NonNullable<T>[S]>>(property: K): NonNullable<NonNullable<T>[S]>[K] | undefined;
          function andProperty<K extends keyof NonNullable<NonNullable<T>[S]>>(property: K, defaultValue: NonNullable<NonNullable<NonNullable<T>[S]>[K]>): NonNullable<NonNullable<NonNullable<T>[S]>[K]>;
          function andProperty<K extends keyof NonNullable<NonNullable<T>[S]>>(property: K, defaultValue?: NonNullable<NonNullable<NonNullable<T>[S]>[K]>) {
            if (target == null) return;
            for (const key of keys) {
              const value = (target)[key]?.[property];
              if (value != null) return value;
            }
            return defaultValue;
          }
          return {
            andProperty,
          };
        },
      };
    },
    makeImportant(value: string | undefined): string | undefined {
      if (value == null) return;
      return `${value} !important`;
    },
    modifyColor(color: string) {
      return Color(color);
    },
  };
}

type ThemeTools = ReturnType<typeof createThemeTools>;

function createTheme<TTheme extends BaseTheme>(): CreateStylesType<TTheme> {
  return <TStyles extends StylesType>(stylesOrDelegate: TStyles | ((theme: TTheme, tools: ThemeTools) => TStyles)): UseStylesType<TTheme, TStyles> => {
    const makeStyles = createMakeStyles({ useTheme: () => ({}) }).makeStyles;
    const useStylesInnerFunc = makeStyles<{ theme: TTheme; tools: ThemeTools; }>({ name: 'react-ui' })((_ignore, { theme, tools }, classes) => {
      const result = (is.function(stylesOrDelegate) ? stylesOrDelegate(theme, tools) : stylesOrDelegate) ?? {};
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
      const tools = createThemeTools(themeInUse);
      const { classes: css, cx } = useStylesInnerFunc({ theme: themeInUse, tools });

      return {
        css: css as { [K in keyof TStyles]: string; },
        theme: themeInUse,
        alterTheme: (delegate: (theme: TTheme) => DeepPartial<TTheme>): TTheme => {
          const newTheme = delegate(themeInUse);
          return useMemo(() => Object.merge({}, themeInUse, newTheme), [themeInUse, Object.hash(newTheme)]);
        },
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
        useInlineStyle: (delegate: () => CSSObject, dependencies: unknown[] = []) => useMemo(() => {
          const styles = delegate();
          if (Object.keys(styles).length <= 0) return;
          return styles;
        }, dependencies) as CSSProperties,
        tools,
      };
    };
  };
}

export const createStyles = createTheme();
