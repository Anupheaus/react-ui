import { useMemo } from 'react';
import { is } from '@anupheaus/common';
import type { ListItemClickEvent, ReactListItem } from '../../models';
import { createComponent } from '../Component';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { ToggleButton } from './ToggleButton';
import { useBound } from '../../hooks';
import { useValidation } from '../../providers';

interface SingleSelectProps {
  // Omitted or undefined value puts the group into single-select mode.
  value?: string;
  onChange?: (value: string) => void;
}

interface MultiSelectProps {
  // An array value (including an empty array) puts the group into multi-select mode.
  value?: string[];
  onChange?: (values: string[]) => void;
}

type Props = FieldProps & {
  items: ReactListItem[];
} & (SingleSelectProps | MultiSelectProps);

export const ToggleButtonGroup = createComponent('ToggleButtonGroup', ({
  items,
  value,
  isOptional = false,
  requiredMessage = 'Please select an option',
  onChange,
  ...props
}: Props) => {
  const { validate } = useValidation();

  const isMultiSelect = is.array(value);
  const selectedIds = isMultiSelect ? value : (value != null ? [value] : []);

  const clicked = useBound((event: ListItemClickEvent) => {
    const originalClick = items.findById(event.id)?.onClick;
    originalClick?.(event);
    if (is.array(value)) {
      // Toggle the clicked id in/out of the current selection.
      const newValues = value.includes(event.id) ? value.filter(id => id !== event.id) : [...value, event.id];
      (onChange as MultiSelectProps['onChange'])?.(newValues);
      return;
    }
    (onChange as SingleSelectProps['onChange'])?.(event.id);
  });

  // validateRequired does not understand arrays, so treat an empty multi-select as "nothing selected".
  const validationValue = isMultiSelect ? (value.length > 0 ? value : undefined) : value;
  const { error } = validate(({ validateRequired }) => validateRequired(validationValue, !isOptional, requiredMessage));

  const renderedItems = useMemo(() => items.map(item => {
    const newItem: ReactListItem = {
      ...item,
      isSelected: item.isSelected ?? selectedIds.includes(item.id),
      onClick: clicked,
    };
    return (
      <ToggleButton key={item.id} item={newItem} />
    );
  }), [items, value]);

  return (
    <Field {...props} tagName="toggle-button-group" disableRipple isOptional={isOptional} error={error} requiredMessage={requiredMessage}>
      {renderedItems}
    </Field>
  );
});