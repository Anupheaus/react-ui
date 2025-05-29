import { is } from '@anupheaus/common';
import { useValidation } from '../../providers';
import { createComponent } from '../Component';
import { InternalText, type InternalTextProps } from '../InternalText';
import { useBound } from '../../hooks';
import { useMemo, type FocusEvent } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';

export interface EmailProps extends InternalTextProps<string> {
  disableSendEmailButton?: boolean;
}

export const Email = createComponent('Email', ({
  disableSendEmailButton = false,
  ...props
}: EmailProps) => {
  const {
    value,
  } = props;
  const { validate } = useValidation();

  const { error, enableErrors } = validate(() => {
    if (is.empty(value)) return;
    if (!is.email(value)) return 'Invalid email address';
  });

  const sendEmail = useBound(() => {
    if (is.empty(value) || error != null) return;
    window.open(`mailto:${value}`);
  });

  const sendEmailButton = useMemo(() => disableSendEmailButton ? null : (
    <Button size="small" iconOnly onClick={sendEmail}><Icon name="email" size="small" /></Button>
  ), [disableSendEmailButton]);

  const handleOnBlur = useBound((event: FocusEvent<HTMLInputElement>) => {
    enableErrors();
    props.onBlur?.(event);
  });

  return (
    <InternalText
      {...props}
      type={'email'}
      tagName={'email'}
      error={props.error ?? error}
      onBlur={handleOnBlur}
      endAdornments={sendEmailButton}
    />
  );
});
