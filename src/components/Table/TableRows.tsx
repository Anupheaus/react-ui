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

const useStyles = createStyles(({ surface: { asAContainer: { normal: container } } }) => ({
  rows: {
    flex: 'auto',
    overflow: 'hidden',
    ...container,

    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      boxShadow: 'inset 0 0 6px rgba(0 0 0 / 24%)',
      pointerEvents: 'none',
    },
  },
}));

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
      const items = records.map((record): ReactListItem<Record> => ({
        id: record.id,
        text: record.id,
        data: record,
        renderLoading: (_id, index) => (
          <TableRow<RecordType> index={index} columns={columns} />
        ),
        renderItem: (_item: ReactListItem<RecordType>, index: number, resolvedData?: RecordType) => (
          <TableRow<RecordType> record={resolvedData} index={index} columns={columns} />
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
        disableShadowsOnScroller
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