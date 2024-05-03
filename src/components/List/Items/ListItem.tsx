import { is } from '@anupheaus/common';
import { createStyles } from '../../../theme';
import { ReactListItem } from '../../../models';
import { createComponent } from '../../Component';
import { UIState, useUIState } from '../../../providers';
import { useRipple } from '../../Ripple';
import { useBound } from '../../../hooks';
import { Flex } from '../../Flex';
import { useListItem } from '../../InternalList';

const useStyles = createStyles(({ pseudoClasses, list: { selectableItem: item } }, { applyTransition, valueOf }) => {
  const activeValues = valueOf(item).using('active', 'normal');
  return {
    listItem: {
      position: 'relative',
      padding: item.normal.padding,
      borderRadius: 4,
      backgroundColor: item.normal.backgroundColor,
      color: item.normal.textColor,
      fontSize: item.normal.textSize,
      fontWeight: item.normal.textWeight,
      userSelect: 'none',
      cursor: 'default',
      width: '100%',
      overflow: 'hidden', // prevents the ripple from going out of the border radius
      ...applyTransition('background-color'),

      '&.is-clickable': {
        cursor: 'pointer',
      },

      [pseudoClasses.active]: {
        backgroundColor: activeValues.andProperty('backgroundColor'),
        borderRadius: activeValues.andProperty('borderRadius'),
        borderColor: activeValues.andProperty('borderColor'),
        borderWidth: activeValues.andProperty('borderWidth'),
        color: activeValues.andProperty('textColor'),
        fontSize: activeValues.andProperty('textSize'),
        fontWeight: activeValues.andProperty('textWeight'),
        padding: activeValues.andProperty('padding'),
      },

    },
  };
});

interface Props<T extends ReactListItem> {
  className?: string;
  onSelect?(item: T, index: number): void;
}

export const ListItem = createComponent('ListItem', <T extends ReactListItem = ReactListItem>({
  className,
  onSelect,
}: Props<T>) => {
  const { css, join } = useStyles();
  const { item, index, isLoading } = useListItem<T>();
  const { isReadOnly } = useUIState();
  const { Ripple, rippleTarget } = useRipple();
  const isClickable = is.function(onSelect) || is.function(item?.onSelect);

  const handleSelect = useBound(() => {
    if (isReadOnly) return;
    if (item == null || is.promise(item)) return;
    if (is.function(onSelect)) onSelect(item, index);
    if (is.function(item?.onSelect)) item.onSelect();
  });

  return (
    <UIState isLoading={isLoading}>
      <Flex
        tagName="list-item"
        ref={rippleTarget}
        className={join(css.listItem, isLoading && 'is-loading', isReadOnly && 'is-read-only', isClickable && 'is-clickable', className)}
        allowFocus
        onClick={handleSelect}
      >
        <Ripple stayWithinContainer />
        {ReactListItem.render(item)}
      </Flex>
    </UIState>
  );
});
