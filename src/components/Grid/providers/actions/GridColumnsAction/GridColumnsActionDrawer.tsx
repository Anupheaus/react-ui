import { useMemo } from 'react';
import { UseActions, useBound, useDelegatedBound } from '../../../../../hooks';
import { ReactListItem } from '../../../../../models';
import { createStyles, ThemesProvider } from '../../../../../theme';
import { Button, ButtonTheme } from '../../../../Button';
import { Checkbox } from '../../../../Checkbox';
import { createComponent } from '../../../../Component';
import { DrawerTheme, useDrawer } from '../../../../Drawer';
import { Flex } from '../../../../Flex';
import { Icon } from '../../../../Icon';
import { DraggableListItem, List } from '../../../../List';
import { GridColumn } from '../../../GridModels';
import { GridTheme } from '../../../GridTheme';

export interface GridColumnsActionDrawerActions {
  openDrawer(): void;
  closeDrawer(): void;
}

interface Props {
  columns: GridColumn[];
  actions: UseActions<GridColumnsActionDrawerActions>;
  onChange(columns: GridColumn[]): void;
  onApply(): void;
}

const useStyles = createStyles(({ useTheme, createThemeVariant }) => {
  const { headers: { backgroundColor, textColor } } = useTheme(GridTheme);
  return {
    styles: {

    },
    variants: {
      drawerTheme: createThemeVariant(DrawerTheme, {
        header: {
          backgroundColor,
          textColor,
        },
      }),
      buttons: createThemeVariant(ButtonTheme, {
        backgroundColor: 'transparent',
        activeBackgroundColor: 'rgba(0 0 0 / 20%)',
        textColor,
        activeTextColor: textColor,
      }),
    },
  };
});

export const GridColumnsActionDrawer = createComponent('GridColumnsActionDrawer', ({
  columns,
  actions,
  onChange,
  onApply,
}: Props) => {
  const { join, variants } = useStyles();
  const { Drawer, openDrawer, closeDrawer } = useDrawer();

  actions({ openDrawer, closeDrawer });

  const toggleColumnVisibility = useDelegatedBound((id: string) => (isVisible: boolean) =>
    onChange(columns.update(column => column.id === id, column => ({ ...column, isVisible }))));

  const handleColumnsChanged = useBound((items: ReactListItem[]) => {
    const newColumns = items.orderBy(({ ordinal }) => ordinal).map(({ id }) => columns.find(column => column.id === id)).removeNull();
    if (Reflect.areDeepEqual(newColumns, columns)) return;
    onChange(newColumns);
  });

  const renderedColumns = useMemo(() => columns.map((column): ReactListItem => ({
    id: column.id,
    text: column.id,
    label: <DraggableListItem key={column.id} data={column}>
      <Flex tagName={'grid-column-selector'} gap={8} align={'left'}>
        <Checkbox label={column.label} value={column.isVisible !== false} onChange={toggleColumnVisibility(column.id)} />
      </Flex>
    </DraggableListItem>
  })), [columns]);

  return (
    <ThemesProvider themes={join(variants.drawerTheme, variants.buttons)}>
      <Drawer
        title={'Column Selection & Order'}
        disableBackdropClick
        headerActions={(
          <Button onClick={onApply}><Icon name={'button-apply'} />Apply</Button>
        )}
      >
        <List items={renderedColumns} gap={8} onChange={handleColumnsChanged} borderless disableOverlay />
      </Drawer>
    </ThemesProvider>
  );
});
