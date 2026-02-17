import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import type { ReactListItem } from '../../models';
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
import { useValidation } from '../../providers';

export type ListOnRequest<T = void> = Required<ListProps<T>>['onRequest'];

export type ListActions = InternalListActions;

export type ListProps<T = void, V extends string | string[] = string | string[]> = Omit<InternalListProps<T>, 'actions'> & {
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
  addTooltip?: ReactNode;
  delayRenderingItems?: boolean;
  error?: ReactNode;
  adornments?: ReactNode;
  children?: ReactNode;
  assistiveHelp?: FieldProps['assistiveHelp'];
  allowMultiSelect?: boolean;
  selectionRequiredMessage?: ReactNode;
  actions?: UseActions<ListActions>;
  onAdd?(): PromiseMaybe<T | void>;
  value?: V;
  onChange?(newValue: V): void;
};

const useStyles = createStyles(({ list }, { applyTransition, gap }) => ({
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
    padding: `0 ${gap(list.normal.gap, 4)}px`,
  },
  floatingActionButton: {
    opacity: 0,
    ...applyTransition('opacity'),

    '&.is-visible': {
      opacity: 1,
    },
  },
}));

export const List = createComponent('List', function <T = void>({
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
  wide,
  delayRenderingItems,
  error: providedError,
  adornments,
  assistiveHelp,
  maxSelectableItems,
  selectionRequiredMessage,
  addTooltip = 'Add a new item to this list',
  onAdd,
  ...props
}: ListProps<T>) {
  const { css, join } = useStyles();
  const { validate } = useValidation(`list-${label}`);
  const [hasItems, setHasItems] = useState(false);
  const [hasSelectedItems, setHasSelectedItems] = useState(false);
  const value = 'value' in props ? props.value : undefined;
  const onChange = 'onChange' in props ? props.onChange : undefined;
  if (value != null) maxSelectableItems = maxSelectableItems ?? (is.array(value) ? 0 : 1);
  const selectedItemIds = useMemo(() => (is.array(value) ? value : [value]).removeNull(), [value]);

  const handleAdd = useBound(async () => {
    await onAdd?.();
    enableErrors();
  });

  const { error, enableErrors } = validate(
    ({ validateRequired }) => validateRequired(hasItems ? 1 : undefined, isOptional !== true, isRequiredMessage),
    () => onChange != null && !hasSelectedItems ? (selectionRequiredMessage ?? ((maxSelectableItems ?? 0) > 1 ? 'Please select at least one item' : 'Please select an item')) : undefined,
  );

  const handleItemsChanged = useBound((items: ReactListItem<T>[]) => setHasItems(items.length > 0));

  const changeSelectedItems = useBound((newSelectedItems: string[]) => {
    setHasSelectedItems(newSelectedItems.length > 0);
    if (is.array(value) || (maxSelectableItems ?? 0) > 1) onChange?.(newSelectedItems as never); else onChange?.(newSelectedItems[0] as never);
  });

  return (
    <Field
      tagName="list"
      label={label}
      help={help}
      className={join(css.list, className)}
      contentClassName={css.listContent}
      containerClassName={join(css.listContainer, containerClassName)}
      containerAdornments={adornments != null && (
        <Flex tagName="list-actions" gap={4} valign="center" className={css.adornments}>
          {adornments}
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
      <InternalList
        tagName="list-content"
        {...props}
        addTooltip={addTooltip}
        onAdd={onAdd != null ? handleAdd : undefined}
        showSkeletons
        contentClassName={join(css.internalList, contentClassName)}
        onItemsChange={handleItemsChanged}
        onSelectedItemsChange={changeSelectedItems}
        delayRenderingItems={delayRenderingItems}
        minHeight={minHeight}
        selectedItemIds={selectedItemIds}
        maxSelectableItems={maxSelectableItems}
      />
    </Field>
  );
});
