import { FunctionComponent, ReactNode } from 'react';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Field } from '../Field';
import { PromiseMaybe, Record, is } from '@anupheaus/common';
import { InternalList, InternalListProps } from '../InternalList/InternalList';
import { ListItemProps } from '../InternalList/ListItem';
import { UseItemsActions } from '../../hooks/useItems';
import { UseActions, useBound } from '../../hooks';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { Icon } from '../Icon';

export type ListOnRequest<T extends Record = ReactListItem> = Required<InternalListProps<T>>['onRequest'];
export { ListItemProps };

export type ListActions = UseItemsActions;

type Props<T extends ReactListItem = ReactListItem> = Omit<InternalListProps<T>, 'actions'> & {
  className?: string;
  isOptional?: boolean;
  hideOptionalLabel?: boolean;
  borderless?: boolean;
  padding?: number;
  label?: ReactNode;
  help?: ReactNode;
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
  label,
  isOptional,
  hideOptionalLabel,
  help,
  width,
  wide,
  renderItemsUsing: ItemComponent,
  onChange,
  onAdd,
  ...props
}: Props<T>) {
  const { css, join } = useStyles();

  const renderItem = useBound((itemProps: ListItemProps<T>) => ItemComponent == null ? null : <ItemComponent {...itemProps} />);

  const handleAdd = useBound(async () => { await onAdd?.(); });

  return (
    <Field
      tagName="list"
      label={label}
      help={help}
      className={css.list}
      contentClassName={join(css.listContent, className)}
      containerClassName={css.listContainer}
      containerAdornments={is.function(onAdd) && (
        <Flex tagName="list-actions" gap={4} valign="center" className={css.addButton}>
          <Button variant="hover" size="small" iconOnly onSelect={handleAdd}><Icon name="add" size="small" /></Button>
        </Flex>
      )}
      isOptional={isOptional}
      hideOptionalLabel={hideOptionalLabel}
      disableSkeleton
      disableRipple
      width={width}
      wide={wide}
    >
      <InternalList
        tagName="list-content"
        {...props}
        renderItem={ItemComponent != null ? renderItem : undefined}
        contentClassName={css.internalList}
      />
    </Field>
  );
});
