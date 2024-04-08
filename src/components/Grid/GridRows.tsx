import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { GridColumn, GridOnRequest } from './GridModels';
import { Record } from '@anupheaus/common';
import { UseActions, useBound } from '../../hooks';
import { ReactListItem } from '../../models';
import { GridRow } from './GridRow';
import { OnScrollEventData } from '../Scroller';
import { useRef } from 'react';
import { InternalList } from '../InternalList/InternalList';
import { ListActions, ListOnRequest } from '../List';

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
  actions?: UseActions<ListActions>;
  onRequest: GridOnRequest<RecordType>;
  onScrollLeft(value: number): void;
}

export const GridRows = createComponent('GridRows', function <RecordType extends Record>({
  columns,
  actions,
  onRequest,
  onScrollLeft,
}: GridRowsProps<RecordType>) {
  const { css } = useStyles();
  const lastScrollLeftRef = useRef(0);

  const handleOnRequest = useBound<ListOnRequest>(async pagination => {
    const { records: data, total } = await onRequest(pagination);
    const items = data.map((record, rowIndex): ReactListItem => ({
      id: record.id,
      text: '',
      label: (<GridRow key={record.id} columns={columns} record={record} rowIndex={rowIndex} />),
    }));
    return { items, total };
  });

  const handleHorizontalScroll = useBound((event: OnScrollEventData) => {
    if (event.left === lastScrollLeftRef.current) return;
    lastScrollLeftRef.current = event.left;
    onScrollLeft(event.left);
  });

  // const LoadingComponent = useMemo(() => createComponent('LoadingComponent', ({ index }: ListItemProps) => (
  //   <GridRow columns={columns} rowIndex={index} />
  // )), [columns]);

  return (
    // <Flex tagName="grid-rows" className={css.rows}>
    <InternalList
      tagName="grid-rows"
      onRequest={handleOnRequest}
      disableShadowsOnScroller
      onScroll={handleHorizontalScroll}
      actions={actions}
      className={css.rows}
    />
    // </Flex>
  );
});