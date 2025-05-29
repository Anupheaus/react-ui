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
  error?: ReactNode;
  adornments?: ReactNode;
  children?: ReactNode;
  assistiveHelp?: FieldProps['assistiveHelp'];
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
    overflow: 'hidden',
  },
  listContent: {
    overflow: 'unset',
  },
  listContainer: {
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'unset',
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
  wide,
  delayRenderingItems,
  error: providedError,
  adornments,
  onAdd,
  assistiveHelp,
  ...props
}: Props<T>) {
  const { css, join } = useStyles();
  const { validate } = useValidation(`list-${label}`);
  const [hasItems, setHasItems] = useState(false);

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
      <InternalList
        tagName="list-content"
        {...props}
        preventContentFromDeterminingHeight
        contentClassName={join(css.internalList, contentClassName)}
        onItemsChange={handleItemsChanged}
        delayRenderingItems={delayRenderingItems}
      >
        {props.children ?? <ListItem />}
      </InternalList>
    </Field>
  );
});
