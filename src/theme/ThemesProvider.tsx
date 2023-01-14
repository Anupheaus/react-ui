import { ReactNode } from 'react';
import { createComponent } from '../components/Component/createComponent';
import { RecordsProvider } from '../providers/RecordsProvider';
import { ThemeRecordTypeId } from './InternalThemeModels';
import type { Theme } from './themeModels';

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
      <RecordsProvider
        typeId={ThemeRecordTypeId}
        records={themes}
        inherit
      >
        {children}
      </RecordsProvider>
    );
  },
});
