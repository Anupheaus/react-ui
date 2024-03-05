import { DeepPartial } from '@anupheaus/common';
import { Theme } from './themes';

export function mergeThemes(primaryTheme: Theme, secondaryTheme: DeepPartial<Theme>): Theme {
  return Object.merge({}, primaryTheme, secondaryTheme);
}