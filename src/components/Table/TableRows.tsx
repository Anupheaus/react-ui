import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import type { TableColumn, TableOnRequest } from './TableModels';
import type { Record } from '@anupheaus/common';
import type { UseActions } from '../../hooks';
import { useBound } from '../../hooks';
import type { OnScrollEventData } from '../Scroller';
import { useRef } from 'react';
import { InternalList } from '../InternalList';
import type { ListActions, ListOnRequest } from '../List';
import type { ReactListItem } from '../../models';
import { TableColumnsContext } from './TableColumnsContext';
import { TableRow } from './TableRow';
import { resolveTableTheme } from './resolveTableTheme';

const useStyles = createStyles((theme, { applyTransition }) => {
  const { fields: { content: { normal } } } = theme;
  const { rowBackgroundColor } = resolveTableTheme(theme);

  return {
    rows: {
      flex: 'auto',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: rowBackgroundColor,
      borderColor: normal.borderColor,
      borderRadius: normal.borderRadius,
      borderWidth: 1,
      borderStyle: 'solid',
      boxSizing: 'border-box',
      minHeight: 0,
      position: 'relative',
      ...applyTransition('border-color, background-color'),
    },
  };
});

export interface TableRowsProps<RecordType extends Record> {
  columns: TableColumn<RecordType>[];
  delayRendering?: boolean;
  actions?: UseActions<ListActions>;
  onRequest: TableOnRequest<RecordType>;
  onScrollLeft(value: number): void;
  onError?(error: Error): void;
}

export const TableRows = createComponent('TableRows', function <RecordType extends Record>({
  columns,
  delayRendering = false,
  actions,
  onRequest,
  onScrollLeft,
  onError,
}: TableRowsProps<RecordType>) {
  const { css } = useStyles();
  const lastScrollLeftRef = useRef(0);

  const handleOnRequest = useBound<ListOnRequest<RecordType>>((request, response) => {
    return onRequest(request, ({ requestId, records, total }) => {
      const lastOrdinalInBatch = (request.pagination.offset ?? 0) + records.length - 1;
      const items = records.map((record): ReactListItem<Record> => ({
        id: record.id,
        text: record.id,
        data: record,
        renderLoading: event => (
          <TableRow<RecordType>
            index={event.ordinal ?? 0}
            columns={columns}
            isLastRow={(event.ordinal ?? 0) === lastOrdinalInBatch}
          />
        ),
        renderItem: event => (
          <TableRow<RecordType>
            record={event.data as RecordType}
            index={event.ordinal ?? 0}
            columns={columns}
            isLastRow={(event.ordinal ?? 0) === lastOrdinalInBatch}
          />
        ),
      })) as ReactListItem<RecordType>[];
      response({ requestId, items, total });
    });
  });

  const handleHorizontalScroll = useBound((event: OnScrollEventData) => {
    if (event.left === lastScrollLeftRef.current) return;
    lastScrollLeftRef.current = event.left;
    onScrollLeft(event.left);
  });

  return (
    <TableColumnsContext.Provider value={columns}>
      <InternalList<RecordType>
        tagName="table-rows"
        onRequest={handleOnRequest}
        onScroll={handleHorizontalScroll}
        actions={actions}
        className={css.rows}
        delayRenderingItems={delayRendering}
        gap={0}
        onError={onError}
      />
    </TableColumnsContext.Provider>
  );
});
