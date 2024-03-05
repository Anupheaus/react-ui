import { is } from '@anupheaus/common';
import { createStyles } from '../../../theme';
import { ReactListItem } from '../../../models';
import { createComponent } from '../../Component';
import { useUIState } from '../../../providers';
import { useRipple } from '../../Ripple';
import { useBound } from '../../../hooks';
import { Flex } from '../../Flex';

const useStyles = createStyles(({ pseudoClasses, list: { selectableItem: item } }, tools) => ({
  selectableListItem: {
    position: 'relative',
    padding: item.normal.padding,
    borderRadius: 4,
    backgroundColor: item.normal.backgroundColor,
    color: item.normal.textColor,
    fontSize: item.normal.textSize,
    fontWeight: item.normal.textWeight,
    cursor: 'pointer',
    width: '100%',
    ...tools.applyTransition('background-color'),

    [pseudoClasses.active]: {
      backgroundColor: item.active.backgroundColor ?? item.normal.backgroundColor,
      color: item.active.textColor ?? item.normal.textColor,
      fontSize: item.active.textSize ?? item.normal.textSize,
      fontWeight: item.active.textWeight ?? item.normal.textWeight,
      padding: item.active.padding ?? item.normal.padding,
    },

  },
}));

interface Props<T extends ReactListItem> {
  className?: string;
  item?: T | Promise<T>;
  onSelect?(item: T): void;
}

export const SelectableListItem = createComponent('SelectableListItem', <T extends ReactListItem = ReactListItem>({
  className,
  item,
  onSelect,
}: Props<T>) => {
  const { css, join } = useStyles();
  const { isLoading, isReadOnly } = useUIState();
  const { Ripple, rippleTarget } = useRipple();

  const handleSelect = useBound(() => {
    if (isReadOnly) return;
    if (item == null || is.promise(item)) return;
    if (is.function(onSelect)) onSelect(item);
    if (is.function(item?.onSelect)) item.onSelect();
  });

  return (
    <Flex
      tagName="selectable-list-item"
      ref={rippleTarget}
      className={join(css.selectableListItem, isLoading && 'is-loading', isReadOnly && 'is-read-only', className)}
      allowFocus
      onClick={handleSelect}
    >
      <Ripple stayWithinContainer />
      {ReactListItem.render(item)}
    </Flex>
  );
});
