import type { Theme } from '../../theme/themes';

export function resolveTableTheme(theme: Theme) {
  const tableTheme = theme.table?.normal;
  const toolbarBackgroundColor = theme.toolbar.normal.backgroundColor;
  const rowBackgroundColor = theme.surface.asAContainer.normal.backgroundColor;

  return {
    headerBackgroundColor: tableTheme?.headerBackgroundColor ?? toolbarBackgroundColor,
    rowBackgroundColor: tableTheme?.rowBackgroundColor ?? rowBackgroundColor,
    footerBackgroundColor: tableTheme?.footerBackgroundColor ?? toolbarBackgroundColor,
  };
}
