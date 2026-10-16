import { useCallback } from 'react';
import { createComponent } from '../Component';
import type { InternalDropDownProps } from '../InternalDropDown';
import { InternalDropDown } from '../InternalDropDown';
import { useBound } from '../../hooks';
import { Chip } from './Chip';
import { createStyles } from '../../theme';

/** A non-empty value keeps InternalDropDown treating the field as filled; the chips themselves are rendered by renderSelectedValue. */
const SELECTION_ID = 'chips-selection';

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

  /**
   * The selected people, rendered as chips.
   *
   * Passed through `renderSelectedValue` rather than as a synthetic `values` entry: `InternalDropDown`
   * resolves its `value` with `values.findById`, so anything not in the option list resolves to nothing and
   * the field renders blank. `renderSelectedValue` runs whatever that lookup returned, which is what a
   * multi-select needs — its selection is a list, never one of the options.
   */
  // A fresh function whenever the selection or options change, deliberately not `useBound`: InternalDropDown caches what
  // `renderSelectedValue` returns against that function's identity, so a stable one leaves the chips frozen as they were
  // on first render — blank for a record that loads after the form opens.
  const renderChips = useCallback(() => (<>{(value ?? []).map(itemId => {
    const item = props.values?.findById(itemId);
    return (
      <Chip key={itemId} id={itemId} value={item} className={css.chip} onDelete={handleDelete} />
    );
  })}</>), [value, props.values, css.chip, handleDelete]);

  return (
    <InternalDropDown
      {...props}
      value={SELECTION_ID}
      renderSelectedValue={renderChips}
      selectionCount={value?.length ?? 0}
      tagName="chips"
      onChange={handleSelected}
    />
  );
});