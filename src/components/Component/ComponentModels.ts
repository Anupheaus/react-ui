import { DeepPartial, MapOf } from 'anux-common';
import { CSSObject } from 'tss-react';
import { GetThemeDefinition, IconType, Theme } from '../../theme';

export const ComponentSymbol = Symbol('AnuxComponent');

export type Component<TProps extends {} = {}> = {
  (props: TProps): JSX.Element | null;
  displayName?: string;
  [ComponentSymbol]: true;
};

export type ComponentStylesConfig = {
  prefix?: string;
  styles?: MapOf<CSSObject>;
  variants?: MapOf<Theme>;
  icons?: MapOf<IconType>;
};

type GetUseTheme<TTheme extends Theme> = {
  definition: Required<TTheme>['definition'];
  icons: Required<TTheme>['icons'];
};

export interface ComponentStylesUtils {
  useTheme<TTheme extends Theme>(theme: TTheme): GetUseTheme<TTheme>;
  createThemeVariant<TTheme extends Theme>(theme: TTheme, themeVariant: DeepPartial<GetThemeDefinition<TTheme>>): TTheme;
}

export type ComponentStyles<TProps extends {}, TStyles extends ComponentStylesConfig> = ((utils: ComponentStylesUtils, props: TProps) => TStyles) | TStyles;

type GetCSSClassesFromStyles<TStyles extends ComponentStylesConfig> = { [K in keyof TStyles['styles']]: string; };
type GetVariantsFromStyles<TStyles extends ComponentStylesConfig> = { [K in keyof TStyles['variants']]: TStyles['variants'][K]; };
type GetIconsFromStyles<TStyles extends ComponentStylesConfig> = { [K in keyof TStyles['icons']]: TStyles['icons'][K]; };

export interface ComponentRenderStyles<TStyles extends ComponentStylesConfig> {
  css: GetCSSClassesFromStyles<TStyles>;
  variants: GetVariantsFromStyles<TStyles>;
  icons: GetIconsFromStyles<TStyles>;
  join(...classNames: (string | boolean | undefined)[]): string | undefined;
  join(...themes: Theme[]): Theme[];
}
