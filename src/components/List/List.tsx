import type { ReactNode } from 'react';
import { useState } from 'react';
import type { ListItemType } from '../../models';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import type { PromiseMaybe } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import type { InternalListActions, InternalListProps } from '../InternalList';
import { InternalList } from '../InternalList';
import type { UseActions } from '../../hooks';
import { useBound } from '../../hooks';
import { Flex } from '../Flex';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useValidation } from '../../providers';
import { ListItem } from './Items';
import { SelectableListProvider } from './SelectableListContext';

export type ListOnRequest<T extends ListItemType = ListItemType> = Required<InternalListProps<T>>['onRequest'];

export type ListActions = InternalListActions;

type Props<T extends ListItemType = ListItemType> = Omit<InternalListProps<T>, 'actions'> & {
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
  delayRenderingItems?: boolean;
  autoHeight?: boolean;
  error?: ReactNode;
  adornments?: ReactNode;
  children?: ReactNode;
  assistiveHelp?: FieldProps['assistiveHelp'];
  value?: string | string[];
  allowMultiSelect?: boolean;
  selectionRequiredMessage?: ReactNode;
  actions?: UseActions<ListActions>;
  onChange?(newValue: string | string[]): void;
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
  },
  listContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  adornments: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  internalList: {
    padding: `0 ${tools.gap(list.normal.gap, 4)}px`,
  },
}));

export const List = createComponent('List', function <T extends ListItemType = ListItemType>({
  className,
  containerClassName,
  contentClassName,
  label,
  isOptional,
  isRequiredMessage,
  hideOptionalLabel,
  help,
  width,
  minHeight = 130,
  autoHeight = false,
  wide,
  delayRenderingItems,
  error: providedError,
  adornments,
  assistiveHelp,
  allowMultiSelect = false,
  selectionRequiredMessage,
  value,
  onChange,
  onAdd,
  ...props
}: Props<T>) {
  const { css, join } = useStyles();
  const { validate } = useValidation(`list-${label}`);
  const [hasItems, setHasItems] = useState(false);
  const [hasSelectedItems, setHasSelectedItems] = useState(false);

  const handleAdd = useBound(async () => {
    await onAdd?.();
    enableErrors();
  });

  if (autoHeight) minHeight = 'auto';

  const { error, enableErrors } = validate(
    ({ validateRequired }) => validateRequired(hasItems ? 1 : undefined, isOptional !== true, isRequiredMessage),
    () => onChange != null && !hasSelectedItems ? (selectionRequiredMessage ?? (allowMultiSelect ? 'Please select at least one item' : 'Please select an item')) : undefined,
  );

  const handleItemsChanged = useBound((items: T[]) => setHasItems(items.length > 0));

  const changeSelectedItems = useBound((newSelectedItems: string[]) => {
    setHasSelectedItems(newSelectedItems.length > 0);
    onChange?.(newSelectedItems);
  });

  return (
    <Field
      tagName="list"
      label={label}
      help={help}
      className={join(css.list, className)}
      contentClassName={css.listContent}
      containerClassName={join(css.listContainer, containerClassName)}
      containerAdornments={(is.function(onAdd) || adornments != null) && (
        <Flex tagName="list-actions" gap={4} valign="center" className={css.adornments}>
          {adornments}
          {is.function(onAdd) && <Button variant="hover" size="small" iconOnly onSelect={handleAdd}><Icon name="add" size="small" /></Button>}
        </Flex>
      )}
      error={providedError ?? error}
      isOptional={isOptional}
      hideOptionalLabel={hideOptionalLabel}
      disableRipple
      disableSkeleton
      width={width}
      wide={wide}
      assistiveHelp={assistiveHelp}
    >
      <SelectableListProvider value={value} multiSelect={allowMultiSelect} onChange={changeSelectedItems}>
        <InternalList
          tagName="list-content"
          {...props}
          preventContentFromDeterminingHeight={minHeight !== 'auto'}
          contentClassName={join(css.internalList, contentClassName)}
          onItemsChange={handleItemsChanged}
          delayRenderingItems={delayRenderingItems}
          minHeight={minHeight}
        >
          {props.children ?? <ListItem />}
        </InternalList>
      </SelectableListProvider>
    </Field>
  );
});
