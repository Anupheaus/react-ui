import { List, ListItem } from '../List';
import { createComponent } from '../Component';
import type { ReactListItem } from '../../models';
import type { ComponentProps, ReactNode } from 'react';
import { useMemo } from 'react';
import { useSimpleListItemDialog } from './SimpleListItemDialog';
import { useBound } from '../../hooks';
import { is } from '@anupheaus/common';
import type { InternalList } from '../InternalList';

interface Props extends Omit<ComponentProps<typeof List>, 'items' | 'value' | 'onChange'> {
  value?: ReactListItem[];
  allowAdd?: boolean;
  allowDelete?: boolean;
  textFieldLabel?: ReactNode;
  onChange?(value: ReactListItem[]): void;
}


export const SimpleList = createComponent('SimpleList', ({
  allowAdd = true,
  allowDelete = true,
  textFieldLabel,
  value,
  onChange,
  ...props
}: Props) => {
  const items = useMemo(() => value ?? [], [value]);
  const { SimpleListItemDialog, openSimpleListItemDialog } = useSimpleListItemDialog();

  const addNewItem = useBound(async () => {
    if (props.onAdd != null) return props.onAdd();
    const item = await openSimpleListItemDialog();
    if (item == null) return;
    onChange?.([...items, item]);
  });

  const internalListProps = useMemo<Partial<ComponentProps<typeof InternalList<ReactListItem>>>>(() => ({
    onItemsChange: async (newValue: (ReactListItem | Promise<ReactListItem>)[]) => {
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
      >
        <ListItem />
      </List>
      <SimpleListItemDialog allowDelete={allowDelete} textFieldLabel={textFieldLabel} />
    </>
  );
});