import { FunctionComponent, ReactNode, useState } from 'react';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Field } from '../Field';
import { PromiseMaybe, Record, is } from '@anupheaus/common';
import { InternalList, InternalListActions, InternalListProps } from '../InternalList/InternalList';
import { ListItemProps } from '../InternalList/ListItem';
import { UseActions, useBound } from '../../hooks';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ListItem } from './Items';
import { useValidation } from '../../providers';

export type ListOnRequest<T extends Record = ReactListItem> = Required<InternalListProps<T>>['onRequest'];
export { ListItemProps };

export type ListActions = InternalListActions;

type Props<T extends ReactListItem = ReactListItem> = Omit<InternalListProps<T>, 'actions'> & {
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  hideOptionalLabel?: boolean;
  borderless?: boolean;
  padding?: number;
  label?: ReactNode;
  help?: ReactNode;
  isOptional?: boolean;
  isRequiredMessage?: ReactNode;
  width?: string | number;
  wide?: boolean;
  addButtonTooltip?: ReactNode;
  renderItemsUsing?: FunctionComponent<ListItemProps<T>>;
  actions?: UseActions<ListActions>;
  onChange?(items: T[]): void;
  onAdd?(): PromiseMaybe<T | void>;
};

const useStyles = createStyles(({ list }, tools) => ({
  list: {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',
    position: 'relative',
  },
  listContent: {
    overflow: 'unset',
  },
  listContainer: {
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'unset',
  },
  addButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  internalList: {
    padding: `0 ${tools.gap(list.normal.gap, 4)}px`,
  },
}));

export const List = createComponent('List', function <T extends ReactListItem = ReactListItem>({
  className,
  containerClassName,
  contentClassName,
  label,
  isOptional,
  isRequiredMessage,
  hideOptionalLabel,
  help,
  width,
  wide,
  renderItemsUsing: ItemComponent,
  onAdd,
  ...props
}: Props<T>) {
  const { css, join } = useStyles();
  const { validate } = useValidation();
  const [hasItems, setHasItems] = useState(false);

  const renderItem = useBound((itemProps: ListItemProps<T>) => ItemComponent == null ? <ListItem {...itemProps} /> : <ItemComponent {...itemProps} />);

  const handleAdd = useBound(async () => {
    await onAdd?.();
    enableErrors();
  });

  const { error, enableErrors } = validate(({ validateRequired }) => validateRequired(hasItems ? 1 : undefined, isOptional !== true, isRequiredMessage));

  const handleItemsChanged = useBound((items: T[]) => {
    setHasItems(items.length > 0);
  });

  return (
    <Field
      tagName="list"
      label={label}
      help={help}
      className={join(css.list, className)}
      contentClassName={join(css.listContent, contentClassName)}
      containerClassName={join(css.listContainer, containerClassName)}
      containerAdornments={is.function(onAdd) && (
        <Flex tagName="list-actions" gap={4} valign="center" className={css.addButton}>
          <Button variant="hover" size="small" iconOnly onSelect={handleAdd}><Icon name="add" size="small" /></Button>
        </Flex>
      )}
      error={error}
      isOptional={isOptional}
      hideOptionalLabel={hideOptionalLabel}
      disableRipple
      width={width}
      wide={wide}
    >
      <InternalList
        tagName="list-content"
        {...props}
        renderItem={ItemComponent != null ? renderItem : undefined}
        contentClassName={css.internalList}
        onItemsChange={handleItemsChanged}
      />
    </Field>
  );
});
