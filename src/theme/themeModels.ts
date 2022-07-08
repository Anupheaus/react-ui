import { MapOf } from 'anux-common';
import { CSSObject } from 'tss-react';
import type { PredefinedStyles } from './predefinedStyles';

type ThemeStructureValue = MapOf<string | number | ThemeStructureValue>;

interface ThemePredefinedStructurePrimarySecondaryValues {
  textColor?: string;
  backgroundColor?: string;
}

interface ThemePredefinedStructureValues {
  primary?: ThemePredefinedStructurePrimarySecondaryValues;
  secondary?: ThemePredefinedStructurePrimarySecondaryValues;
}

export type ThemeValues = ThemePredefinedStructureValues & ThemeStructureValue;
export type ThemeStyles = MapOf<CSSObject | ThemeStyles>;

export interface ThemeUsing<TValues extends ThemeValues, TStyles extends ThemeStyles> {
  values: TValues;
  predefinedStyles: TStyles & PredefinedStyles;
}

type ConvertToClasses<T> = { [K in keyof T as T[K] extends string | number ? never : K]: string & ConvertToClasses<T[K]> };

export type CreateStylesApi<TStyles extends ThemeStyles, TPredefinedStyles extends ThemeStyles> = () => {
  classes: ConvertToClasses<PredefinedStyles & TPredefinedStyles & TStyles>;
  join(...args: (string | false | undefined | {})[]): string | undefined;
};