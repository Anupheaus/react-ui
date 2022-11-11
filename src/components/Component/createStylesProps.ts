import { is, MapOf } from '@anupheaus/common';
import { createMakeStyles } from 'tss-react';
import type { IconType, Theme, ThemeDefinition } from '../../theme/themeModels';
import type { ComponentRenderStyles, ComponentStyles, ComponentStylesConfig, ComponentStylesUtils } from './ComponentModels';

function filterClassNames(value: string | boolean | Theme | undefined): boolean {
  if (typeof (value) === 'string') return value.trim().length > 0;
  if (is.plainObject(value) && is.not.empty(value.id)) return true;
  return false;
}

interface MakeStylesUtils<TProps extends {}> extends ComponentStylesUtils {
  variants: MapOf<ThemeDefinition>;
  icons: MapOf<IconType>;
  props: TProps;
}

export function createStylesProps<TProps extends {}, TStyles extends ComponentStylesConfig>(styles: ComponentStyles<TProps, TStyles> | undefined) {
  const makeStyles = createMakeStyles({ useTheme: () => ({}) }).makeStyles;
  const useStyles = makeStyles<MakeStylesUtils<TProps>>({ name: 'anux' })((_theme, { props, variants, icons, ...utils }) => {
    const renderedStyles = ((is.function(styles) ? styles(utils, props) : styles) ?? {}) as ComponentStylesConfig;
    Object.assign(variants, renderedStyles.variants ?? {});
    Object.assign(icons, renderedStyles.icons ?? {});
    return renderedStyles.styles ?? {};
  });

  return (props: TProps) => {
    const utils = require('../../theme/ThemesProvider').useThemesProvider();
    const variants = {} as ComponentRenderStyles<TStyles>['variants'];
    const icons = {} as ComponentRenderStyles<TStyles>['icons'];
    const { classes: css, cx } = useStyles({ ...utils, variants, icons, props });
    const join = (...classNames: (string | boolean | undefined | Theme)[]) => {
      classNames = classNames.filter(filterClassNames);
      if (classNames.length <= 0) return undefined;
      if (is.theme(classNames[0])) return classNames;
      return cx(...(classNames as (string | boolean | undefined)[]));
    };
    return { css, join, variants, icons } as ComponentRenderStyles<TStyles>;
  };
}
