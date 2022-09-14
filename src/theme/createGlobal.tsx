import { GlobalStyles } from 'tss-react';
import { anuxPureFC } from '../anuxComponents';
import { ThemeValues } from './themeModels';

export function createGlobalStylesComponent(styles: ThemeValues) {
  return anuxPureFC('GlobalStyles', () => <GlobalStyles styles={styles} />);
}
