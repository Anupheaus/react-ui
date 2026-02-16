import { createComponent } from '../Component';
import type { InternalDropDownProps } from '../InternalDropDown';
import { InternalDropDown } from '../InternalDropDown';
import { useBound } from '../../hooks';
import { Chip } from './Chip';
import type { ReactListItem } from '../../models';
import { useMemo } from 'react';
import { createStyles } from '../../theme';

const useStyles = createStyles(() => ({
  chip: {
    maxHeight: 24,
  },
}));

interface Props<T extends string> extends Omit<InternalDropDownProps, 'value' | 'onChange'> {
  value?: T[];
  onChange?(values: T[]): void;
}

export const Chips = createComponent('Chips', function <T extends string = string>({ value, onChange, ...props }: Props<T>) {
  const { css } = useStyles();

  const handleDelete = useBound((id: T) => {
    onChange?.((value ?? []).filter(itemId => itemId !== id));
  });

  const handleSelected = useBound((id: T) => {
    onChange?.([...(value ?? []), id].distinct());
  });

  const renderedChips = useMemo<ReactListItem>(() => ({
    id: 'fake',
    text: '',
    label: (<>{(value ?? []).map(itemId => {
      const item = props.values?.findById(itemId);
      return (
        <Chip key={itemId} id={itemId} value={item} className={css.chip} onDelete={handleDelete} />
      );
    })}</>),
  }), [value, props.values]);

  return (
    <InternalDropDown
      {...props}
      value={renderedChips.id}
      tagName="chips"
      onChange={handleSelected}
    />
  );
});