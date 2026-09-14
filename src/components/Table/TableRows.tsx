import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import type { TableColumn, TableOnRequest } from './TableModels';
import type { Record } from '@anupheaus/common';
import type { UseActions } from '../../hooks';
import { useBound } from '../../hooks';
import type { CreateSkeletonItemContext } from '../../hooks/useItems';
import type { OnScrollEventData } from '../Scroller';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { InternalList } from '../InternalList';
import type { ListActions, ListOnRequest } from '../List';
import type { ReactListItem } from '../../models';
import { UIState } from '../../providers';
import { TableColumnsContext } from './TableColumnsContext';
import { resolveTableTheme } from './resolveTableTheme';
import { createPlaceholderRecord } from './createPlaceholderRecord';
import { createTableRowListItem } from './createTableRowListItem';
import { TABLE_BODY_SCROLLER_GUTTER_OVERRIDE } from './tableBodyScrollerLayout';

const useStyles = createStyles((theme, { applyTransition }) => {
  const { fields: { content: { normal } } } = theme;
  const { rowBackgroundColor } = resolveTableTheme(theme);

  return {
    rows: {
      flex: 'auto',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: rowBackgroundColor,
      borderColor: normal.borderColor,
      borderRadius: normal.borderRadius,
      borderWidth: 1,
      borderStyle: 'solid',
      boxSizing: 'border-box',
      minHeight: 0,
      minWidth: 0,
      position: 'relative',
      ...applyTransition('border-color, background-color'),

      ...TABLE_BODY_SCROLLER_GUTTER_OVERRIDE,
    },
    rowsScrollerContent: {
      '& table-row:last-of-type': {
        borderBottomWidth: 0,
      },
    },
  };
});

export interface TableRowsProps<RecordType extends Record> {
  columns: TableColumn<RecordType>[];
  delayRendering?: boolean;
  isInitialLoading?: boolean;
  onVerticalScrollbarWidthChange?(width: number): void;
  actions?: UseActions<ListActions>;
  onRequest: TableOnRequest<RecordType>;
  onScrollLeft(value: number): void;
  onError?(error: Error): void;
  emptyMessage?: ReactNode;
}

export const TableRows = createComponent('TableRows', function <RecordType extends Record>({
  columns,
  delayRendering = false,
  isInitialLoading = false,
  onVerticalScrollbarWidthChange,
  actions,
  onRequest,
  onScrollLeft,
  onError,
  emptyMessage,
}: TableRowsProps<RecordType>) {
  const { css } = useStyles();
  const lastScrollLeftRef = useRef(0);

  const handleOnRequest = useBound<ListOnRequest<RecordType>>((request, response) => {
    return onRequest(request, ({ requestId, records, total }) => {
      const offset = request.pagination.offset ?? 0;
      const items = records.map((record, recordIndex) => createTableRowListItem({
        record,
        ordinal: offset + recordIndex,
        columns,
      })) as ReactListItem<RecordType>[];
      response({ requestId, items, total });
    });
  });

  const createSkeletonItem = useBound(({ index }: CreateSkeletonItemContext): ReactListItem<RecordType> => {
    return createTableRowListItem({
      record: createPlaceholderRecord(columns, index),
      ordinal: index,
      columns,
    });
  });

  const handleHorizontalScroll = useBound((event: OnScrollEventData) => {
    if (event.left === lastScrollLeftRef.current) return;
    lastScrollLeftRef.current = event.left;
    onScrollLeft(event.left);
  });

  return (
    <TableColumnsContext.Provider value={columns}>
      <UIState isLoading={isInitialLoading}>
        <InternalList<RecordType>
          tagName="table-rows"
          onRequest={handleOnRequest}
          onScrollHorizontal={handleHorizontalScroll}
          onVerticalScrollbarWidthChange={onVerticalScrollbarWidthChange}
          actions={actions}
          className={css.rows}
          contentClassName={css.rowsScrollerContent}
          delayRenderingItems={delayRendering}
          showSkeletons={isInitialLoading}
          createSkeletonItem={createSkeletonItem}
          gap={0}
          fullHeight
          minWidth={0}
          minHeight={0}
          onError={onError}
          emptyMessage={emptyMessage}
        />
      </UIState>
    </TableColumnsContext.Provider>
  );
});
