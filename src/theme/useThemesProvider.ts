import { DeepPartial } from '@anupheaus/common';
import { useBound } from '../hooks/useBound';
import { useForceUpdate } from '../hooks/useForceUpdate';
import { useRecordsProvider } from '../providers/RecordsProvider/useRecordsProvider';
import { ThemeRecordTypeId } from './InternalThemeModels';
import type { GetThemeDefinition, Theme } from './themeModels';

export function useThemesProvider() {
  const { records, onChanged } = useRecordsProvider<Theme>(ThemeRecordTypeId);
  const observedThemes = new Set<string>();
  const update = useForceUpdate();

  onChanged(record => observedThemes.has(record.id) ? update() : void 0);

  const useTheme = useBound(<TTheme extends Theme>(theme: TTheme): TTheme => {
    if (!records.has(theme.id)) return theme;
    observedThemes.add(theme.id);
    return (records.get(theme.id) ?? theme) as TTheme;
  });

  const createThemeVariant = useBound(<TTheme extends Theme>(theme: TTheme, variant: DeepPartial<GetThemeDefinition<TTheme>>): TTheme => {
    const providedTheme = useTheme(theme);
    return { ...theme, ...providedTheme, definition: { ...providedTheme.definition, ...variant } };
  });

  return {
    useTheme,
    createThemeVariant,
  };
}
