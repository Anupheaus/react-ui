import { IconDefinitions, IconType } from './ThemeModels';

type IconRendererFactory<T extends IconDefinitions> = {
  [K in keyof T]: IconType;
};

export const IconsFactory = {
  define<T extends IconDefinitions>(icons: T): IconRendererFactory<T> {
    return icons;
  }
};