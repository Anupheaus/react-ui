import { DeepPartial } from '@anupheaus/common';
import { ComponentStylesUtils, UseTheme, UseThemeIcons } from '../components';
import { useBound } from '../hooks/useBound';
import { useForceUpdate } from '../hooks/useForceUpdate';
import { useRecordsProvider } from '../providers/RecordsProvider/useRecordsProvider';
import { ThemeRecordTypeId } from './InternalThemeModels';
import type { GetThemeDefinition, Theme } from './themeModels';

export function useThemesProvider(): ComponentStylesUtils {
  const { records, onChanged } = useRecordsProvider<Theme>(ThemeRecordTypeId);
  const observedThemes = new Set<string>();
  const update = useForceUpdate();

  onChanged(record => observedThemes.has(record.id) ? update() : void 0);

  const useTheme = useBound((theme => {
    if (!records.has(theme.id)) return theme.definition;
    observedThemes.add(theme.id);
    return (records.get(theme.id) ?? theme).definition;
  }) as UseTheme);

  const useThemeIcons = useBound((theme => {
    if (!records.has(theme.id)) return theme.icons;
    observedThemes.add(theme.id);
    return (records.get(theme.id) ?? theme).icons;
  }) as UseThemeIcons);

  const createThemeVariant = useBound(<TTheme extends Theme>(theme: TTheme, variant: DeepPartial<GetThemeDefinition<TTheme>>): TTheme => {
    const providedTheme = useTheme(theme);
    return { ...theme, definition: Object.merge({}, providedTheme, variant) };
  });

  return {
    activePseudoClasses: '&:hover, &:active, &:focus, &:focus-visible',
    useThemeIcons,
    useTheme,
    createThemeVariant,
  };
}
