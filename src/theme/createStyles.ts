/* eslint-disable max-classes-per-file */
import { createMakeStyles } from 'tss-react';
import { ThemeStyles, ThemeUsing, ThemeValues } from './themeModels';
import { predefinedStyles as ownPredefinedStyles, PredefinedStyles } from './predefinedStyles';

type ConvertToClasses<T> = { [K in keyof T as T[K] extends string | number ? never : K]: string & ConvertToClasses<T[K]> };

const { makeStyles } = createMakeStyles({ useTheme: () => ({}) });

// eslint-disable-next-line max-len
export function createStyles<TValues extends ThemeValues = {}, TStyles extends ThemeStyles = {}>(values: TValues = {} as TValues, predefinedStyles: (values: TValues) => TStyles = () => ({}) as TStyles) {
  return <TNewStyles extends ThemeStyles, TParams = void>(stylesOrDelegate: TNewStyles | ((theme: ThemeUsing<TValues, TStyles>, params: TParams) => TNewStyles)) =>
    (params?: TParams) => {
      const actualPredefinedStyles = predefinedStyles(values);
      const actualStyles = typeof stylesOrDelegate === 'function' ? stylesOrDelegate({ values, predefinedStyles: { ...ownPredefinedStyles, ...actualPredefinedStyles } }, params as TParams)
        : stylesOrDelegate;
      const result = (makeStyles()({ ...ownPredefinedStyles, ...actualPredefinedStyles, ...actualStyles })());
      const classes = result.classes as ConvertToClasses<PredefinedStyles & TNewStyles & TStyles>;
      const join = (...names: (string | false | undefined)[]): string | undefined => result.cx(...names);

      return {
        classes,
        join,
      };
    };
}

class CreateStylesType<TValues extends ThemeValues = {}, TStyles extends ThemeStyles = {}> {
  public get createStylesType() { return createStyles<TValues, TStyles>({} as unknown as TValues, () => ({}) as unknown as TStyles); }

}
export type CreateStyles<TValues extends ThemeValues = {}, TStyles extends ThemeStyles = {}> = CreateStylesType<TValues, TStyles>['createStylesType'];

class CreateStylesApiType<TNewStyles extends ThemeStyles = {}, TStyles extends ThemeStyles = {}> {
  public get createStylesApiType() { return createStyles<{}, TStyles>({}, () => ({}) as unknown as TStyles)({} as TNewStyles); }
}
export type CreateStylesApi<TNewStyles extends ThemeStyles, TStyles extends ThemeStyles> = CreateStylesApiType<TNewStyles, TStyles>['createStylesApiType'];
