import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
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
import type { InternalListFooterProps } from '../InternalList/InternalListFooter';
import { InternalListFooter } from '../InternalList/InternalListFooter';
import type { UseActions } from '../../hooks';
import { useBound } from '../../hooks';
import { Flex } from '../Flex';
import { UIState, useValidation } from '../../providers';
import { useListStyles } from './ListStyles';
import type { UseDataRequest, UseDataResponse } from '../../extensions';

export type ListOnRequest<T = void> = Required<ListProps<T>>['onRequest'];

export type ListActions = InternalListActions;

export type ListProps<T = void, V extends string | string[] = string | string[]> = Omit<InternalListProps<T>, 'actions'> & Pick<InternalListFooterProps, 'addLabel' | 'addTooltip' | 'summary' | 'hideRecordCount'> & {
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
  fullHeight?: boolean;
  unitName?: string;
  deleteTooltip?: ReactNode;
  delayRenderingItems?: boolean;
  error?: ReactNode;
  adornments?: ReactNode;
  children?: ReactNode;
  assistiveHelp?: FieldProps['assistiveHelp'];
  allowMultiSelect?: boolean;
  selectionRequiredMessage?: ReactNode;
  actions?: UseActions<ListActions>;
  onAdd?(event: MouseEvent | KeyboardEvent): PromiseMaybe<T | void>;
  value?: V;
  onChange?: V extends string[] ? (newValue: string[]) => void : (newValue: string) => void;
};

const useStyles = createStyles(({ list }, { gap }) => ({
  adornments: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  internalList: {
    padding: `0 ${gap(list.normal.gap, 4)}px`,
  },
  fieldContent: {
    flexDirection: 'column',
  },
  listContent: {
    minHeight: 0,
  },
}));

export const List = createComponent('List', function <T = void, V extends string | string[] = string | string[]>({
  className,
  containerClassName,
  contentClassName,
  label,
  isOptional,
  isRequiredMessage,
  hideOptionalLabel,
  help,
  width,
  minHeight,
  wide,
  fullHeight,
  delayRenderingItems,
  error: providedError,
  adornments,
  assistiveHelp,
  maxSelectableItems,
  selectionRequiredMessage,
  addTooltip = 'Add a new item to this list',
  deleteTooltip = 'Delete this item from this list',
  addLabel,
  summary,
  hideRecordCount,
  unitName = 'item',
  onAdd,
  onRequest,
  onError,
  ...props
}: ListProps<T, V>) {
  const { css: listCss } = useListStyles();
  const { css, join, useInlineStyle, toPx } = useStyles();
  const fieldContentStyle = useInlineStyle(() => ({ minHeight: toPx(minHeight) }), [minHeight]);
  const { validate } = useValidation({ id: `list-${label}` });
  const [hasItems, setHasItems] = useState(false);
  const [hasSelectedItems, setHasSelectedItems] = useState(false);
  const [total, setTotal] = useState<number | undefined>();
  const [requestError, setRequestError] = useState<Error | undefined>();
  const value = 'value' in props ? props.value : undefined;
  const onChange = 'onChange' in props ? props.onChange : undefined;
  if (value != null) maxSelectableItems = maxSelectableItems ?? (is.array(value) ? 0 : 1);
  const selectedItemIds = useMemo(() => (is.array(value) ? value : [value]).removeNull(), [value]);

  const handleAdd = useBound(async (event: MouseEvent | KeyboardEvent) => {
    await onAdd?.(event);
    enableErrors();
  });

  const handleRequest = useBound(async (request: UseDataRequest, response: (data: UseDataResponse<ReactListItem<T>>) => void) => {
    await onRequest?.(request, (data) => {
      setTotal(data.total);
      setRequestError(undefined);
      response(data);
    });
  });

  const handleError = useBound((error: Error) => {
    setRequestError(error);
    onError?.(error);
  });

  const { error, enableErrors } = validate(
    ({ validateRequired }) => validateRequired(hasItems ? 1 : undefined, isOptional !== true, isRequiredMessage),
    () => onChange != null && isOptional !== true && !hasSelectedItems ? (selectionRequiredMessage ?? ((maxSelectableItems ?? 0) > 1 ? 'Please select at least one item' : 'Please select an item')) : undefined,
  );

  const handleItemsChanged = useBound((items: ReactListItem<T>[]) => {
    setHasItems(items.length > 0);
    if (onRequest == null) setTotal(items.length);
  });

  const changeSelectedItems = useBound((newSelectedItems: string[]) => {
    setHasSelectedItems(newSelectedItems.length > 0);
    if (is.array(value) || (maxSelectableItems ?? 0) > 1) onChange?.(newSelectedItems as never); else onChange?.(newSelectedItems[0] as never);
  });

  const showFooter = onAdd != null || (!hideRecordCount && unitName != null) || summary != null || requestError != null;

  return (
    <Field
      tagName="list"
      label={label}
      help={help}
      className={join(listCss.list, fullHeight && 'full-height', className)}
      containerClassName={join(listCss.listContainer, containerClassName)}
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
      fullHeight={fullHeight}
      assistiveHelp={assistiveHelp}
      disableOverflow
      contentClassName={css.fieldContent}
      contentStyle={fieldContentStyle}
    >
      <InternalList
        tagName="list-content"
        className={css.listContent}
        {...props}
        deleteTooltip={deleteTooltip}
        onRequest={onRequest != null ? handleRequest : undefined}
        onError={handleError}
        showSkeletons
        contentClassName={join(css.internalList, contentClassName)}
        onItemsChange={handleItemsChanged}
        onSelectedItemsChange={changeSelectedItems}
        delayRenderingItems={delayRenderingItems}
        selectedItemIds={selectedItemIds}
        maxSelectableItems={maxSelectableItems}
      />
      {showFooter && (
        <UIState isLoading={total == null && onRequest != null}>
          <InternalListFooter
            total={total}
            unitName={unitName}
            error={requestError}
            summary={summary}
            hideRecordCount={hideRecordCount}
            onAdd={onAdd != null ? handleAdd : undefined}
            addLabel={addLabel}
            addTooltip={addTooltip}
          />
        </UIState>
      )}
    </Field>
  );
});
