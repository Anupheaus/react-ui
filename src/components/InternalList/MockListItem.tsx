import { Ref, useMemo } from 'react';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { UIState } from '../../providers';
import { useListItem } from './useListItem';

const useStyles = createStyles({
  listItem: {
    position: 'relative',
    display: 'inline-flex',
    width: '100%',
    height: 'fit-content',
  },
});

interface Props {
  className?: string;
  ref?: Ref<HTMLDivElement | null>;
}

export const MockListItem = createComponent('MockListItem', ({
  className,
  ref,
}: Props) => {
  const { item, index, isLoading } = useListItem<ReactListItem>();
  const { css, join } = useStyles();

  const content = useMemo(() => {
    return ReactListItem.render(item);
  }, [item, index]);

  return (
    <Tag name="list-item" ref={ref} className={join(css.listItem, className, item?.className)}>
      <UIState isLoading={isLoading || item == null}>
        {content}
      </UIState>
    </Tag>
  );
});