import { ThemeIcons } from './themeModels';

export function createThemeIcons<T extends ThemeIcons>(icons: T): T {
  Object.keys(icons).forEach(key => {
    const iconRenderer = icons[key];
    iconRenderer.setName(key);
  });
  return icons;
}