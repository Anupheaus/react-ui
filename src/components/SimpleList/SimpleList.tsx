import { List } from '../List';
import { createComponent } from '../Component';
import type { ReactListItem } from '../../models';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { useMemo } from 'react';
import { useSimpleListItemDialog } from './SimpleListItemDialog';
import { useBound } from '../../hooks';
import { is } from '@anupheaus/common';
import type { InternalList } from '../InternalList';

interface Props<T = void> extends Omit<ComponentProps<typeof List<T>>, 'items' | 'value' | 'onChange'> {
  value?: ReactListItem<T>[];
  allowAdd?: boolean;
  allowDelete?: boolean;
  textFieldLabel?: ReactNode;
  onChange?(value: ReactListItem<T>[]): void;
}


export const SimpleList = createComponent('SimpleList', function <T = void>({
  allowAdd = true,
  allowDelete = true,
  textFieldLabel,
  value,
  onChange,
  ...props
}: Props<T>) {
  const items = useMemo(() => value ?? [], [value]);
  const { SimpleListItemDialog, openSimpleListItemDialog } = useSimpleListItemDialog();

  const addNewItem = useBound(async (event: MouseEvent<HTMLElement>) => {
    if (props.onAdd != null) return await props.onAdd(event);
    const item = await openSimpleListItemDialog();
    if (item == null) return;
    onChange?.([...items, item as ReactListItem<T>]);
  });

  const internalListProps = useMemo<Partial<ComponentProps<typeof InternalList<T>>>>(() => ({
    onItemsChange: async (newValue: ReactListItem<T>[]) => {
      if (onChange == null) return;
      const [newItems] = await Promise.whenAllSettled(newValue.map(async item => await item));
      onChange(newItems);
    },
  }), []);

  return (
    <>
      <List
        {...props}
        {...internalListProps}
        items={items}
        onAdd={is.function(props.onAdd) ? props.onAdd : (allowAdd ? addNewItem : undefined)}
      />
      <SimpleListItemDialog allowDelete={allowDelete} textFieldLabel={textFieldLabel} />
    </>
  );
});