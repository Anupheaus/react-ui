import type { KeyboardEvent } from 'react';
import { useMemo } from 'react';
import { useBound, useDistributedState } from '../../hooks';
import type { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { FieldProps } from '../Field';
import { Field, useFieldAria } from '../Field';
import { RadioOption } from './RadioOption';
import { getNextRadioIndex } from './getNextRadioIndex';
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

  const { ids: ariaIds, controlProps: ariaProps } = useFieldAria({ label: props.label, error, assistiveHelp: props.assistiveHelp });

  const renderedOptions = useMemo(() => {
    const optionIds = (values ?? []).map(item => item.id);
    return (values ?? []).map(item => (
      <RadioOption key={item.id} item={item} state={state} optionIds={optionIds} />
    ));
  }, [values, state]);

  onSelectedChange((newId: string | undefined) => {
    if (newId != null) onChange?.(newId);
  });

  // Arrow keys move between the choices and choose the one they land on, as a native radio group does. Clicking the
  // next choice runs the option's own selection, so the read-only and loading guards apply as they do for a click.
  const moveBetweenOptions = useBound((event: KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('radio'));
    const currentIndex = options.findIndex(option => option === document.activeElement);
    const nextIndex = getNextRadioIndex({ key: event.key, currentIndex, count: options.length });
    if (nextIndex == null) return;
    event.preventDefault();
    options[nextIndex].focus();
    options[nextIndex].click();
  });

  return (
    <Field tagName="radio-group" {...props} ariaIds={ariaIds} noContainer isOptional={isOptional} requiredMessage={requiredMessage} error={error}>
      <Flex
        tagName="radio-group-options"
        role="radiogroup"
        aria-labelledby={ariaProps['aria-labelledby']}
        aria-describedby={ariaProps['aria-describedby']}
        aria-invalid={ariaProps['aria-invalid']}
        isVertical={!isHorizontal}
        align={'left'}
        disableGrow
        gap={isHorizontal ? 16 : 8}
        className={css.radioGroupOptions}
        onKeyDown={moveBetweenOptions}
      >
        {renderedOptions}
      </Flex>
    </Field>
  );
});
