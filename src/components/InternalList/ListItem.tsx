import { ReactNode, Ref, useMemo } from 'react';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { useAsync } from '../../hooks';
import { is } from '@anupheaus/common';
import { UIState } from '../../providers';

const useStyles = createStyles({
  listItem: {
    position: 'relative',
    display: 'inline-flex',
    width: '100%',
    height: 'fit-content',
  },
});

export interface ListItemProps<T extends ReactListItem = ReactListItem> {
  item: T | Promise<T>;
  index: number;
}

interface Props<T extends ReactListItem> extends ListItemProps<T> {
  className?: string;
  ref?: Ref<HTMLDivElement | null>;
  renderItem?(props: ListItemProps<T>): ReactNode;
}

export const ListItem = createComponent('ListItem', <T extends ReactListItem>({
  className,
  ref,
  renderItem,
  ...props
}: Props<T>) => {
  const { item: providedItem, index } = props;
  const { css, join } = useStyles();
  const { response: item, isLoading } = useAsync(() => providedItem, [providedItem]);

  const content = useMemo(() => {
    if (is.function(renderItem)) return renderItem({ item: (item ?? providedItem) as T | Promise<T>, index });
    return ReactListItem.render(item);
  }, [providedItem, item, index, renderItem]);

  return (
    <Tag name="list-item" ref={ref} className={join(css.listItem, className)}>
      <UIState isLoading={isLoading || item == null}>
        {content}
      </UIState>
    </Tag>
  );
});