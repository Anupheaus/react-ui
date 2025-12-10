import { useMemo } from 'react';
import { useDistributedState } from '../../hooks';
import type { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { RadioOption } from './RadioOption';
import { useValidation } from '../../providers';

const useStyles = createStyles({
  radioGroupOptions: {
    padding: 4,
    margin: -4,
    marginLeft: 0,
    maxWidth: '100%',
    overflow: 'hidden',
  },
});

interface Props extends FieldProps {
  isHorizontal?: boolean;
  value?: string;
  values?: ReactListItem[];
  onChange?(value: string): void;
}

export const Radio = createComponent('Radio', ({
  isHorizontal = false,
  values,
  value,
  onChange,
  isOptional,
  requiredMessage,
  ...props
}: Props) => {
  const { css } = useStyles();
  const { state, onChange: onSelectedChange } = useDistributedState(() => value, [value]);
  const { validate } = useValidation();

  const { error } = validate(({ validateRequired }) => validateRequired(value, isOptional !== true, requiredMessage ?? 'You must select an option'));

  const renderedOptions = useMemo(() => (values ?? []).map(item => (
    <RadioOption key={item.id} item={item} state={state} />
  )), [values, state]);

  onSelectedChange((newId: string | undefined) => {
    if (newId != null) onChange?.(newId);
  });

  return (
    <Field tagName="radio-group" {...props} noContainer isOptional={isOptional} requiredMessage={requiredMessage} error={error}>
      <Flex tagName="radio-group-options" isVertical={!isHorizontal} align={'left'} disableGrow gap={isHorizontal ? 16 : 8} className={css.radioGroupOptions}>
        {renderedOptions}
      </Flex>
    </Field>
  );
});
