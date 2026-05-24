import { useBound } from '../../hooks';
import { useStorage } from '../../hooks/useStorage';
import type { TableSettings } from './TableModels';

interface UseTableSettingsResult {
  settings: TableSettings | undefined;
  persistColumnWidth(columnId: string, width: number): void;
}

export function useTableSettings(persistenceKey?: string): UseTableSettingsResult {
  const { state: settings, setState: setSettings } = useStorage<TableSettings>(persistenceKey ?? '', {
    type: 'local',
    disabled: persistenceKey == null,
    defaultValue: () => ({}),
  });

  const persistColumnWidth = useBound((columnId: string, width: number) => {
    if (persistenceKey == null) return;
    setSettings(previousSettings => ({
      ...previousSettings,
      columnWidths: {
        ...previousSettings?.columnWidths,
        [columnId]: width,
      },
    }));
  });

  return { settings, persistColumnWidth };
}
