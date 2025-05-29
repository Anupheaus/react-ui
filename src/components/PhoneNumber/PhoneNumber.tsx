import { is } from '@anupheaus/common';
import { useValidation } from '../../providers';
import { createComponent } from '../Component';
import { InternalText, type InternalTextProps } from '../InternalText';
import { useBound } from '../../hooks';
import type { KeyboardEvent } from 'react';
import { useMemo, type FocusEvent } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';

const allowedChars = '0123456789+() -';
const allowedSpecialKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

export interface PhoneNumberProps extends InternalTextProps<string> {
  disableMakeCallButton?: boolean;
}

export const PhoneNumber = createComponent('PhoneNumber', ({
  disableMakeCallButton = false,
  ...props
}: PhoneNumberProps) => {
  const {
    value,
  } = props;
  const { validate } = useValidation();

  const { error, enableErrors } = validate(() => {
    if (is.empty(value)) return;
    if (!is.phoneNumber(value)) return 'Invalid phone number';
  });

  const makeCall = useBound(() => {
    if (is.empty(value) || error != null) return;
    window.open(`tel:${value.trim()}`);
  });

  const makeCallButton = useMemo(() => disableMakeCallButton ? null : (
    <Button size="small" iconOnly onClick={makeCall}><Icon name="phone" size="small" /></Button>
  ), [disableMakeCallButton]);

  const handleOnBlur = useBound((event: FocusEvent<HTMLInputElement>) => {
    enableErrors();
    props.onBlur?.(event);
  });

  const handleOnKeyDown = useBound((event: KeyboardEvent<HTMLInputElement>) => {
    if (!allowedSpecialKeys.includes(event.key) && !allowedChars.includes(event.key)) event.preventDefault();
  });

  return (
    <InternalText
      {...props}
      type={'tel'}
      tagName={'telephone-number'}
      error={props.error ?? error}
      onBlur={handleOnBlur}
      onKeyDown={handleOnKeyDown}
      endAdornments={makeCallButton}
      maxLength={15}
    />
  );
});
