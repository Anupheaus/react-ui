import { useBound } from '../../hooks';
import { useStorage } from '../../hooks/useStorage';
import type { TableSettings } from './TableModels';
import { canPersistTableColumnWidth } from './tableConstants';

interface UseTableSettingsResult {
  settings: TableSettings | undefined;
  persistColumnWidth(columnId: string, width: number, isResizable: boolean): void;
}

export function useTableSettings(persistenceKey?: string): UseTableSettingsResult {
  const { state: settings, setState: setSettings } = useStorage<TableSettings>(persistenceKey ?? '', {
    type: 'local',
    disabled: persistenceKey == null,
    defaultValue: () => ({}),
  });

  const persistColumnWidth = useBound((columnId: string, width: number, isResizable: boolean) => {
    if (persistenceKey == null || !canPersistTableColumnWidth({ id: columnId, isResizable })) return;
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
