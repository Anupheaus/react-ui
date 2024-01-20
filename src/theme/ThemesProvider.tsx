import { ReactNode } from 'react';
import { createComponent } from '../components/Component';
import { RecordsProvider } from '../providers/RecordsProvider';
import { ThemeRecordTypeId } from './InternalThemeModels';
import type { LegacyTheme } from './themeModels';

interface Props {
  themes: LegacyTheme[];
  children?: ReactNode;
}

export const ThemesProvider = createComponent('ThemesProvider', ({
  themes,
  children = null,
}: Props) => {
  return (
    <RecordsProvider
      typeId={ThemeRecordTypeId}
      records={themes}
      inherit
    >
      {children}
    </RecordsProvider>
  );
});
