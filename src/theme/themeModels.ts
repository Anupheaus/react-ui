import type { AnyObject, DeepPartial, MapOf } from '@anupheaus/common';
import type { CSSObject } from 'tss-react';

export interface IconTypeProps {
  size?: 'normal' | 'small' | 'large' | number;
  color?: string;
}

export type IconTypeRenderFn = (props: IconTypeProps) => JSX.Element | null;
export interface IconTypeConfig {
  rotate?: number;
  flip?: 'horizontal' | 'vertical';
  render: IconTypeRenderFn;
}
export type IconType = IconTypeConfig | IconTypeRenderFn;

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

export type LegacyTheme<D extends ThemeDefinition = ThemeDefinition, I extends ThemeIcons = ThemeIcons> = ThemeConfig<D, I> & {
  createVariant(variant: DeepPartial<ThemeConfig<D, I>>): LegacyTheme<D, I>;
};

export type GetThemeDefinition<T extends LegacyTheme<ThemeDefinition, ThemeIcons>> = T extends LegacyTheme<infer D, ThemeIcons> ? D : never;
export type GetThemeIcons<T extends LegacyTheme<ThemeDefinition, ThemeIcons>> = T extends LegacyTheme<ThemeDefinition, infer I> ? I : never;
