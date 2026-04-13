import { useMemo } from 'react';
import type { ListItemClickEvent, ReactListItem } from '../../models';
import { createComponent } from '../Component';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { ToggleButton } from './ToggleButton';
import { useBound } from '../../hooks';
import { useValidation } from '../../providers';

interface Props extends FieldProps {
  items: ReactListItem[];
  value?: string;
  onChange?: (value: string) => void;
}

export const ToggleButtonGroup = createComponent('ToggleButtonGroup', ({
  items,
  value,
  isOptional = false,
  requiredMessage = 'Please select an option',
  onChange,
  ...props
}: Props) => {
  const { validate } = useValidation();

  const clicked = useBound((event: ListItemClickEvent) => {
    const originalClick = items.findById(event.id)?.onClick;
    originalClick?.(event);
    onChange?.(event.id);
  });

  const { error } = validate(({ validateRequired }) => validateRequired(value, !isOptional, requiredMessage));

  const renderedItems = useMemo(() => items.map(item => {
    const newItem: ReactListItem = {
      ...item,
      isSelected: item.isSelected ?? (item.id === value),
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