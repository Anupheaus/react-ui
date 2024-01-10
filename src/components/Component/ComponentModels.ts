import { DeepPartial, MapOf } from '@anupheaus/common';
import { CSSObject } from 'tss-react';
import type { GetThemeDefinition, GetThemeIcons, IconType, Theme } from '../../theme/themeModels';

/** @deprecated */
export const ComponentSymbol = Symbol('AnuxComponent');

/** @deprecated */
export type Component<TProps extends {} = {}> = {
  (props: TProps): JSX.Element | null;
  displayName?: string;
  [ComponentSymbol]: true;
};

/** @deprecated */
export type ComponentStylesConfig = {
  prefix?: string;
  styles?: MapOf<CSSObject>;
  variants?: MapOf<Theme>;
  icons?: MapOf<IconType>;
};

/** @deprecated */
export type UseTheme = <TTheme extends Theme>(theme: TTheme) => GetThemeDefinition<TTheme>;
/** @deprecated */
export type UseThemeIcons = <TTheme extends Theme>(theme: TTheme) => GetThemeIcons<TTheme>;

/** @deprecated */
export interface ComponentStylesUtils {
  activePseudoClasses: string;
  useTheme: UseTheme;
  useThemeIcons: UseThemeIcons;
  createThemeVariant<TTheme extends Theme>(theme: TTheme, themeVariant: DeepPartial<GetThemeDefinition<TTheme>>): TTheme;
}
