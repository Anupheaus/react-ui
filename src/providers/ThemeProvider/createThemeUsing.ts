import { useContext } from 'react';
import { ThemeTypeDefinition } from './createThemeFor';
import { MakeStyles } from './Theme';
import { getInternalsFrom } from './ThemeInternals';
import { ThemeClassStyles, ThemeType } from './ThemeModels';

export function createThemeUsing(makeStyles: MakeStyles) {
  return <TTheme extends ThemeType, TThemeStyles extends ThemeClassStyles>(theme: ThemeTypeDefinition<TTheme>, delegate: (styles: TTheme['styles']) => TThemeStyles) => {
    const { name, theme: { styles }, context } = getInternalsFrom(theme);
    const styleDefinitions = delegate(styles);
    const internalUseStyles = makeStyles({ name })(styleDefinitions);
    return (useTheme?: ThemeTypeDefinition<TTheme>) => {
      const result = internalUseStyles();
      const contextTheme = useContext(context);
      const { generateClassName, theme: { icons } } = getInternalsFrom(useTheme ?? contextTheme ?? theme);
      const themeClassName = generateClassName();
      const classes = { ...result.classes, theme: themeClassName } as (Record<keyof TThemeStyles, string> & { theme: string; });
      const join = result.cx;
      return {
        classes,
        icons: icons as TTheme['icons'],
        join,
      };
    };

    // const className = `${stylerName}-${name}`;
    // const useInternalStyles = makeStyles()({
    //   [className]: Object.entries(mergedStyles).reduce((acc, [key, value]) => ({
    //     ...acc,
    //     [`--${stylerName}-${key}`]: is.number(value) ? `${value}px` : value,
    //   }), {}),
    // });
  };
}