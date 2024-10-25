import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import type { TableColumn, TableOnRequest, TableUseRecordHook } from './TableModels';
import type { Record } from '@anupheaus/common';
import type { UseActions } from '../../hooks';
import { useBound } from '../../hooks';
import type { OnScrollEventData } from '../Scroller';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { InternalList } from '../InternalList';
import type { ListActions, ListOnRequest } from '../List';
import { TableColumnsContext } from './TableColumnsContext';
import { TableRowRenderer } from './TableRowRenderer';

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
  children?: ReactNode;
  useRecordHook?: TableUseRecordHook<RecordType>;
  actions?: UseActions<ListActions>;
  onRequest: TableOnRequest<RecordType | string>;
  onScrollLeft(value: number): void;
  onError?(error: Error): void;
}

export const TableRows = createComponent('TableRows', function <RecordType extends Record>({
  columns,
  delayRendering = false,
  useRecordHook,
  children,
  actions,
  onRequest,
  onScrollLeft,
  onError,
}: TableRowsProps<RecordType>) {
  const { css } = useStyles();
  const lastScrollLeftRef = useRef(0);

  const handleOnRequest = useBound<ListOnRequest<RecordType>>((request, response) => onRequest(request, ({ requestId, records, total }) => response({ items: records as RecordType[], total, requestId })));

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
      >
        {children ?? <TableRowRenderer useRecordHook={useRecordHook} />}
      </InternalList>
    </TableColumnsContext.Provider>
  );
});