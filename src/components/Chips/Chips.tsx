import { createComponent } from '../Component';
import { InternalDropDown, InternalDropDownProps } from '../InternalDropDown';
import { useBound } from '../../hooks';
import { Chip } from './Chip';
import { ReactListItem } from '../../models';
import { useMemo } from 'react';
import { createStyles } from '../../theme';

const useStyles = createStyles(() => ({
  chip: {
    maxHeight: 24,
  },
}));

interface Props extends Omit<InternalDropDownProps, 'value' | 'onChange'> {
  value?: string[];
  onChange?(values: string[]): void;
}

export const Chips = createComponent('Chips', ({ value, onChange, ...props }: Props) => {
  const { css } = useStyles();

  const handleDelete = useBound((id: string) => {
    onChange?.((value ?? []).filter(itemId => itemId !== id));
  });

  const handleSelected = useBound((id: string) => {
    onChange?.([...(value ?? []), id].distinct());
  });

  const fakeValue = useMemo<ReactListItem>(() => ({
    id: 'fake',
    text: '',
    label: (<>{(value ?? []).map(itemId => {
      const item = props.values?.findById(itemId);
      return (
        <Chip key={itemId} id={itemId} value={item} className={css.chip} onDelete={handleDelete} />
      );
    })}</>),
  }), [value]);

  return (
    <InternalDropDown
      {...props}
      value={fakeValue}
      tagName="chips"
      onChange={handleSelected}
    />
  );
});