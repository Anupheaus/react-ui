import { to } from '@anupheaus/common';
import { ReactElement, useMemo } from 'react';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import { createStyles2 } from '../../theme';
import { Icon } from '../Icon';
import { InternalText, InternalTextProps } from '../InternalText';
import { Button } from '../Button';

interface Props extends InternalTextProps<number | undefined> {
  min?: number;
  max?: number;
  endAdornments?: ReactElement[];
  hideIncreaseDecreaseButtons?: boolean;
}

const useStyles = createStyles2({
  number: {
    minWidth: 100,
  },
  input: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    textAlign: 'center',

    '&.hidden-buttons': {
      'padding': '0 4px',
    },
  },
});

export const Number = createComponent('Number', ({
  endAdornments: providedEndAdornments,
  hideIncreaseDecreaseButtons = false,
  value,
  min,
  max,
  error: providedError,
  onChange,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const increase = useBound(() => onChange?.(to.number(value, 0) + 1));
  const decrease = useBound(() => onChange?.(to.number(value, 0) - 1));

  const buttons = useMemo(() => [
    ...(hideIncreaseDecreaseButtons ? [] : [
      <Button
        key="increase"
        onClick={increase}
      >
        <Icon name="number-increase" size="small" />
      </Button>
    ]),
    ...(providedEndAdornments ?? []),
  ], [providedEndAdornments]);

  const startButtons = useMemo(() => hideIncreaseDecreaseButtons ? [] : [
    <Button
      key="decrease"
      onClick={decrease}
    >
      <Icon name="number-decrease" size="small" />
    </Button>,
  ], []);

  const error = useMemo(() => {
    if (providedError) return providedError;
    if (min == null && max == null) return;
    if (value == null) return;
    if (min != null && value < min) return `Value cannot be less than ${min}`;
    if (max != null && value > max) return `Value cannot be greater than ${max}`;
  }, [providedError, min, max, value]);

  return (
    <InternalText
      {...props}
      className={join(css.number, props.className)}
      value={value}
      tagName={'number'}
      inputClassName={join(css.input, hideIncreaseDecreaseButtons && 'hidden-buttons')}
      type={'number'}
      endAdornments={buttons}
      startAdornments={startButtons}
      error={error}
      onChange={onChange}
    />
  );
});
