import { is } from '@anupheaus/common';
import { ReactListItem } from '../../../models';
import { useUIState } from '../../../providers';
import { createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';
import { ListItemProps } from '../List';

const useStyles = createStyles(({ pseudoClasses, list: { item } }, tools) => ({
  selectableListItem: {
    position: 'relative',
    padding: item.normal.padding,
    borderRadius: item.normal.borderRadius,
    borderColor: item.normal.borderColor,
    borderWidth: item.normal.borderWidth,
    borderStyle: 'solid',
    backgroundColor: item.normal.backgroundColor,
    color: item.normal.textColor,
    fontSize: item.normal.textSize,
    fontWeight: item.normal.textWeight,
    cursor: 'pointer',
    width: '100%',
    ...tools.applyTransition('background-color,border-color,opacity'),

    [pseudoClasses.active]: {
      backgroundColor: item.active.backgroundColor ?? item.normal.backgroundColor,
      borderRadius: item.active.borderRadius ?? item.normal.borderRadius,
      borderColor: item.active.borderColor ?? item.normal.borderColor,
      borderWidth: item.active.borderWidth ?? item.normal.borderWidth,
      color: item.active.textColor ?? item.normal.textColor,
      fontSize: item.active.textSize ?? item.normal.textSize,
      fontWeight: item.active.textWeight ?? item.normal.textWeight,
      padding: item.active.padding ?? item.normal.padding,
    },

  },
}));

interface Props<T extends ReactListItem> extends ListItemProps<T> {
  className?: string;
}

export const ListItem = createComponent('ListItem', function <T extends ReactListItem>({
  className,
  item,
}: Props<T>) {
  const { css, join } = useStyles();
  const { isLoading, isReadOnly } = useUIState();

  return (
    <Flex tagName="list-item" className={join(css.selectableListItem, isLoading && 'is-loading', isReadOnly && 'is-read-only', !is.promise(item) && item.className, className)}>
      {ReactListItem.render(item)}
    </Flex>
  );
});