/* eslint-disable max-len */
import { AnyObject, is, MapOf } from 'anux-common';
import { forwardRef, FunctionComponent, memo, ReactElement, RefAttributes, RefObject } from 'react';
import { CSSObject, createMakeStyles } from 'tss-react';
import type { GetThemeDefinition, GetThemeIcons, Theme, ThemeDefinition, ThemeIcons, ThemeStyles } from '../theme';
import type { ThemedComponent } from '../theme/createThemedComponent';
import { compareProps } from './compareProps';
import '../extensions';
import type { AddChildren } from '../extensions';
import type { AnuxError } from '../errors/types/AnuxError';
import { useErrors } from '../errors/useErrors';

function addThemeToProps<T>(props: T, useStyles: { classes: MapOf<string>; cx: (...classNames: string[]) => string; } | undefined, theme: Theme | undefined): any {
  if (useStyles == null) return props;
  return {
    ...props,
    theme: {
      css: useStyles.classes,
      icons: theme?.icons,
      join: useStyles.cx,
      // createVariantOf: createVariantThemeOf(theme),
      ThemedComponent: (() => {
        if (theme == null) return;
        const { createThemedComponent } = require('../theme/createThemedComponent');
        return createThemedComponent(theme);
      })(),
    },
  } as T & FCTheme<ThemeDefinition, ThemeIcons, ThemeStyles>;
}

type ComponentTheme = Theme<ThemeDefinition, ThemeIcons>;
type ComponentStyles<T extends ThemeDefinition> = (theme: T) => ThemeStyles;

type FCTheme<D extends ThemeDefinition, I extends ThemeIcons, S extends ThemeStyles | never> = S extends {} ? {
  theme: {
    css: Record<keyof S, string>;
    icons: I;
    join(...classNames: unknown[]): string;
    ThemedComponent: ThemedComponent<D, I>;
  };
} : {};

type AddTheme<TProps extends {}, TTheme extends ComponentTheme, TStyles extends ThemeStyles | never> = TProps & FCTheme<GetThemeDefinition<TTheme>, GetThemeIcons<TTheme>, TStyles>;
type AddRef<TProps extends {}, TRef> = TProps & RefAttributes<TRef>;

export type PureFC<TProps extends {}, TRef = HTMLElement, TTheme extends Theme | never = Theme> =
  Omit<FunctionComponent<TProps & RefAttributes<TRef>>, '(props: P, context?: any): ReactElement<any, any> | null;'> & {
    theme?: TTheme;
    (props: AddChildren<TProps>, ref: PureRef<TRef>): ReactElement<any, any> | null;
  };

export type PureRef<T = HTMLElement> = RefObject<T> & { (instance: T | null): void; };

const makeStyles = createMakeStyles({ useTheme: () => void 0 }).makeStyles<ThemeDefinition | undefined>({});

interface PureFCProps<T extends AnyObject> {
  onError?(error: AnuxError, props: T): JSX.Element | null;
}

export function pureFC<TProps extends {}, TRef = HTMLElement>() {
  function innerPureFC<TTheme extends ComponentTheme, TStyles extends ComponentStyles<GetThemeDefinition<TTheme>>>(name: string, theme: TTheme, styles: TStyles, component: PureFC<AddTheme<TProps, TTheme, ReturnType<TStyles>>, TRef, TTheme>, props?: PureFCProps<TProps>): PureFC<AddRef<TProps, TRef>, TRef, TTheme>;
  function innerPureFC<TTheme extends ComponentTheme>(name: string, theme: TTheme, component: PureFC<AddTheme<TProps, TTheme, never>, TRef, TTheme>, props?: PureFCProps<TProps>): PureFC<AddRef<TProps, TRef>, TRef, TTheme>;
  function innerPureFC(name: string, component: PureFC<TProps, TRef, never>, props?: PureFCProps<TProps>): PureFC<AddRef<TProps, TRef>, TRef, never>;
  function innerPureFC<TTheme extends ComponentTheme>(...args: unknown[]): PureFC<AddRef<TProps, TRef>, TRef, TTheme> {
    const name = args.shift() as string; // name is always first
    const lastArg = args.pop();
    const pureFCProps = !is.function(lastArg) && is.plainObject<PureFCProps<TProps>>(lastArg) ? lastArg : undefined;
    const component = (is.function(lastArg) ? lastArg : args.pop()) as PureFC<TProps, TRef, TTheme>;
    const providedTheme = (is.theme(args[0]) ? args.shift() : undefined) as TTheme | undefined;
    const styles = ((args.length > 0 && ((providedTheme != null && is.function(args[0])) || (providedTheme == null && is.plainObject(args[0])))) ? args.shift() : undefined) as ((theme: GetThemeDefinition<TTheme>) => MapOf<CSSObject>) | MapOf<CSSObject> | undefined;

    const useStyles = styles != null ? makeStyles(is.function(styles) ? (_, params) => styles(params as GetThemeDefinition<TTheme>) : styles) : undefined;
    const forwardRefResult = forwardRef<TRef, TProps>((props, ref) => {
      const { tryCatch } = useErrors();
      return tryCatch(() => {
        let theme = providedTheme;
        if (theme) {
          const { useThemeFromThemesProvider } = require('../theme/ThemesProvider');
          theme = useThemeFromThemesProvider(theme);
        }
        return component(addThemeToProps(props, useStyles?.(theme?.definition), theme), ref as PureRef<TRef>);
      }, { onError: error => pureFCProps?.onError?.(error, props) ?? null });
    });
    const memoResult: any = memo(forwardRefResult, compareProps(name));
    memoResult.displayName = name;
    memoResult.theme = providedTheme;
    return memoResult;
  }
  return innerPureFC;
}

// interface Props<T> {
//   value: T;
// }

// export function Number<T>(props: Props<T>, ref: PureRef<HTMLElement>) {
//   return pureFC<Props<T>>()('Number', {} as ComponentTheme, () => ({ }), ({ value }) => <>{value}</>)(props, ref);
// }

// const a = (
//   <Number value={''} />
// );

// const MyComponent = pureFC<{ something: string; }>()('MyComponent', { backgroundColor: '#fff' } as Theme<{ backgroundColor: string; }, {}>, ({ backgroundColor }) => ({
//   root: {
//     backgroundColor
//   },
// }), ({
//   theme: {
//     css,
//   },
// }) => {
//   return (
//     <div className={css.root}>
//       Hello World
//     </div>
//   );
// });

// const MyComponent2 = pureFC<{ something: string; }>()('MyComponent2', {
//   root: {
//     backgroundColor: '#fff',
//   },
// }, ({
//   theme: {
//     css,
//   },
// }) => {
//   return (
//     <div className={css.root}>
//       Hello World
//     </div>
//   );
// });

// const MyComponent3 = pureFC<{ something: string; }>()('MyComponent3', ({
//   something,
// }) => {
//   return null;
// });

// const bbb = (<>
//   <MyComponent something='' />
//   <MyComponent2 something='' />
//   <MyComponent3 something='' />
// </>);