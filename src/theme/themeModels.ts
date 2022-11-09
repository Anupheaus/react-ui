import { AnyObject, DeepPartial, MapOf } from 'anux-common';
import { ReactNode } from 'react';
import { CSSObject } from 'tss-react';

export interface IconTypeProps {
  size?: 'normal' | 'small' | 'large' | number;
}

export type IconType = (props: IconTypeProps) => ReactNode;

export type ThemeDefinition = AnyObject;
export type ThemeIcons = {
  [iconName: string]: IconType;
};
export type ThemeStyles = MapOf<CSSObject>;

export interface ThemeConfig<D extends ThemeDefinition, I extends ThemeIcons> {
  id: string;
  definition: D;
  icons?: I;
}

export type Theme<D extends ThemeDefinition = ThemeDefinition, I extends ThemeIcons = ThemeIcons> = ThemeConfig<D, I> & {
  createVariant(variant: DeepPartial<ThemeConfig<D, I>>): Theme<D, I>;
};

export type GetThemeDefinition<T extends Theme<ThemeDefinition, ThemeIcons>> = T extends Theme<infer D, ThemeIcons> ? D : never;
export type GetThemeIcons<T extends Theme<ThemeDefinition, ThemeIcons>> = T extends Theme<ThemeDefinition, infer I> ? I : never;