import Color from 'color';
import type { Theme } from '../../theme/themes';

/** Opaque color composited on a background (avoids `opaquer(1)` turning transparent tints into pure black). */
export function resolveOpaqueTableBackground(foreground: string, onBackground: string): string {
  const foregroundColor = Color(foreground);
  if (foregroundColor.alpha() >= 1) return foregroundColor.hex();
  return Color(onBackground).mix(foregroundColor.alpha(1), foregroundColor.alpha()).hex();
}

export function resolveTableTheme(theme: Theme) {
  const tableTheme = theme.table?.normal;
  const toolbarBackgroundColor = theme.toolbar.normal.backgroundColor;
  const rowBackgroundColor = theme.surface.asAContainer.normal.backgroundColor;

  return {
    headerBackgroundColor: tableTheme?.headerBackgroundColor ?? toolbarBackgroundColor ?? '#ffffff',
    rowBackgroundColor: tableTheme?.rowBackgroundColor ?? rowBackgroundColor ?? '#ffffff',
    footerBackgroundColor: tableTheme?.footerBackgroundColor ?? toolbarBackgroundColor ?? '#ffffff',
  };
}
