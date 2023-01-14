import { useActions, useBound, useUpdatableState } from '../../../../../hooks';
import { Button } from '../../../../Button';
import { createComponent } from '../../../../Component';
import { useGridColumns } from '../../columns/GridColumns/useGridColumns';
import { GridAction } from '../GridActions';
import { GridColumnsActionDrawer, GridColumnsActionDrawerActions } from './GridColumnsActionDrawer';

export const GridColumnsAction = createComponent({
  id: 'GridColumnsAction',

  render() {
    const { columns, upsert, reorder } = useGridColumns();
    const [localColumns, setLocalColumns] = useUpdatableState(() => columns, [columns]);
    const { setActions: drawerActions, openDrawer, closeDrawer } = useActions<GridColumnsActionDrawerActions>();

    const handleApply = useBound(() => {
      upsert(localColumns);
      reorder(localColumns.map(({ id }) => id));
      closeDrawer();
    });

    return (<>
      <GridAction id={'grid-columns-action'} ordinal={9000}>
        <Button icon={'grid-column-selection'} size={'small'} onClick={openDrawer} />
      </GridAction>
      <GridColumnsActionDrawer columns={localColumns} actions={drawerActions} onChange={setLocalColumns} onApply={handleApply} />
    </>);
  },

});
