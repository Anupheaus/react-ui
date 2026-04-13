import { createComponent } from '../Component';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import type { SelectorItem, SelectorSubItem } from './selector-models';
import { useValidation } from '../../providers';
import { useBound, useUpdatableState } from '../../hooks';
import { useListStyles } from '../List/ListStyles';
import { InternalSelector } from './InternalSelector';

export interface SelectorSelectionConfiguration {
  totalSelectableItems?: number;
  maxSectionsWithSelectableItems?: number;
}

interface Props extends FieldProps {
  items: SelectorItem[];
  selectionConfiguration?: SelectorSelectionConfiguration;
  height?: string | number;
  fullHeight?: boolean;
  onSelect?(selectedItems: SelectorSubItem[]): void;
}

export const Selector = createComponent('Selector', ({
  items,
  selectionConfiguration,
  isOptional,
  requiredMessage,
  height,
  fullHeight,
  onSelect,
  ...props
}: Props) => {
  const { css } = useListStyles();
  const [selectedCount, setSelectedCount] = useUpdatableState<number>(
    () => items.mapMany(item => item.subItems).filter(si => si.isSelected === true).length,
    [items],
  );
  const { validate } = useValidation();

  const { error, enableErrors } = validate(({ validateRequired }) =>
    validateRequired(selectedCount > 0 ? 1 : undefined, isOptional !== true, requiredMessage ?? 'Please select at least one item'),
  );

  const handleSelect = useBound((selectedItems: SelectorSubItem[]) => {
    setSelectedCount(selectedItems.length);
    onSelect?.(selectedItems);
    enableErrors();
  });

  return (
    <Field
      tagName="selector"
      disableRipple
      skeleton="outlineOnly"
      {...props}
      disableOverflow
      height={height}
      fullHeight={fullHeight}
      className={css.list}
      containerClassName={css.listContainer}
      error={error ?? props.error}
    >
      <InternalSelector items={items} selectionConfiguration={selectionConfiguration} onSelect={handleSelect} />
    </Field>
  );
});
