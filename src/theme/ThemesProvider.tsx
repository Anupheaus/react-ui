import { DeepPartial } from '@anupheaus/common';
import { ReactNode } from 'react';
import { createComponent } from '../components/Component';
import { useBound, useForceUpdate } from '../hooks';
import { RecordsProvider, useRecordsProvider } from '../providers/RecordsProvider';
import { GetThemeDefinition, Theme } from './themeModels';

const themeRecordTypeId = 'themes_644bdf94-ef9e-473f-91de-aec066d93897';

interface Props {
  themes: Theme[];
  children?: ReactNode;
}

export const ThemesProvider = createComponent({
  id: 'ThemesProvider',

  render({
    themes,
    children = null,
  }: Props) {
    return (
      <RecordsProvider typeId={themeRecordTypeId} records={themes} inherit>
        {children}
      </RecordsProvider>
    );
  },
});

export function useThemesProvider() {
  const { records, onChanged } = useRecordsProvider<Theme>(themeRecordTypeId);
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
