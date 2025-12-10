import { List, ListItem } from '../List';
import { createComponent } from '../Component';
import type { ReactListItem } from '../../models';
import type { ComponentProps, ReactNode } from 'react';
import { useMemo } from 'react';
import { useSimpleListItemDialog } from './SimpleListItemDialog';
import { useBound } from '../../hooks';
import { is } from '@anupheaus/common';

interface Props extends Omit<ComponentProps<typeof List>, 'items'> {
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

  return (
    <>
      <List
        {...props}
        items={items}
        onChange={onChange}
        onAdd={is.function(props.onAdd) ? props.onAdd : (allowAdd ? addNewItem : undefined)}
      >
        <ListItem />
      </List>
      <SimpleListItemDialog allowDelete={allowDelete} textFieldLabel={textFieldLabel} />
    </>
  );
});