import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { GridColumn, GridOnRequest, GridUseRecordHook } from './GridModels';
import { Record } from '@anupheaus/common';
import { UseActions, useBound } from '../../hooks';
import { OnScrollEventData } from '../Scroller';
import { ReactNode, useRef } from 'react';
import { InternalList } from '../InternalList';
import { ListActions, ListOnRequest } from '../List';
import { GridColumnsContext } from './GridColumnsContext';
import { GridRowRenderer } from './GridRowRenderer';

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

export interface GridRowsProps<RecordType extends Record> {
  columns: GridColumn<RecordType>[];
  delayRendering?: boolean;
  children?: ReactNode;
  useRecordHook?: GridUseRecordHook<RecordType>;
  actions?: UseActions<ListActions>;
  onRequest: GridOnRequest<RecordType | string>;
  onScrollLeft(value: number): void;
}

export const GridRows = createComponent('GridRows', function <RecordType extends Record>({
  columns,
  delayRendering = false,
  useRecordHook,
  children,
  actions,
  onRequest,
  onScrollLeft,
}: GridRowsProps<RecordType>) {
  const { css } = useStyles();
  const lastScrollLeftRef = useRef(0);

  const handleOnRequest = useBound<ListOnRequest<RecordType>>((pagination, response) =>
    onRequest(pagination, ({ requestId, records, total }) => response({ items: records as RecordType[], total, requestId })));

  const handleHorizontalScroll = useBound((event: OnScrollEventData) => {
    if (event.left === lastScrollLeftRef.current) return;
    lastScrollLeftRef.current = event.left;
    onScrollLeft(event.left);
  });

  return (
    <GridColumnsContext.Provider value={columns}>
      <InternalList<RecordType>
        tagName="grid-rows"
        onRequest={handleOnRequest}
        disableShadowsOnScroller
        onScroll={handleHorizontalScroll}
        actions={actions}
        className={css.rows}
        delayRenderingItems={delayRendering}
        gap={0}
      >
        {children ?? <GridRowRenderer useRecordHook={useRecordHook} />}
      </InternalList>
    </GridColumnsContext.Provider>
  );
});