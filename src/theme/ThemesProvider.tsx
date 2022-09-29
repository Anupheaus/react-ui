import { createContext, useContext } from 'react';
import { pureFC } from '../anuxComponents';
import { GetThemeDefinition, Theme, ThemeDefinition, ThemeIcons } from './themeModels';

type ThemeContextProps = Theme<ThemeDefinition, ThemeIcons>[];

const ThemeContext = createContext<ThemeContextProps>([]);

interface Props {
  themes: ThemeContextProps;
}

export const ThemesProvider = pureFC<Props>()('ThemesProvider', ({
  themes,
  children = null,
}) => {
  return (
    <ThemeContext.Provider value={themes}>
      {children}
    </ThemeContext.Provider>
  );
});

export function useThemeFromThemesProvider<TTheme extends Theme<ThemeDefinition, ThemeIcons>>(theme: TTheme | undefined,
  providedThemeDefinition?: Partial<GetThemeDefinition<TTheme>>): TTheme | undefined {
  const allContextThemes = useContext(ThemeContext);
  if (theme == null) return;
  if (providedThemeDefinition != null) return Object.merge({}, theme, { definition: providedThemeDefinition });
  if (allContextThemes.length === 0) return theme;

  const matchingContextThemes = allContextThemes.filter(item => item.id === theme.id);
  return (matchingContextThemes.last() ?? theme) as TTheme;
}
