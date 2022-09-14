import { anuxPureFC } from '../../anuxComponents';
import { ThemeTypeDefinition } from './createThemeFor';
import { getInternalsFrom } from './ThemeInternals';
import { ThemeType } from './ThemeModels';

interface Props {
  themes: (ThemeTypeDefinition<ThemeType> | undefined)[];
}

export const ThemesProvider = anuxPureFC<Props>('ThemesProvider', ({
  themes,
  children = null,
}) => {
  let content = <>{children}</>;

  themes.forEach(theme => {
    if (!theme) return;
    const ThemeContext = getInternalsFrom(theme).context;
    content = (
      <ThemeContext.Provider value={theme}>
        {content}
      </ThemeContext.Provider>
    );
  });

  return content;
});