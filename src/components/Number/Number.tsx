import { to } from '@anupheaus/common';
import { ReactElement, useMemo } from 'react';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { InternalText, InternalTextProps } from '../InternalText';
import { Icon } from '../Icon';

interface Props extends InternalTextProps<number | undefined> {
  min?: number;
  max?: number;
  step?: number;
  endAdornments?: ReactElement[];
  hideIncreaseDecreaseButtons?: boolean;
}

const useStyles = createStyles({
  number: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    textAlign: 'center',
  },
  hiddenButtons: {
    'padding': '0 4px',
  },
});

export const Number = createComponent('Number', ({
  endAdornments: providedEndAdornments,
  hideIncreaseDecreaseButtons = false,
  value,
  min,
  max,
  step = 1,
  error: providedError,
  onChange,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const increase = useBound(() => onChange?.(to.number(value, 0) + step));
  const decrease = useBound(() => onChange?.(to.number(value, 0) - step));

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

  const handleChange = useBound((newValue: number | undefined) => onChange?.(to.number(newValue)));

  return (
    <InternalText
      {...props}
      value={value}
      tagName={'number'}
      inputClassName={join(css.number, hideIncreaseDecreaseButtons && css.hiddenButtons)}
      type={'number'}
      endAdornments={buttons}
      useFloatingEndAdornments
      startAdornments={startButtons}
      useFloatingStartAdornments
      error={error}
      onChange={handleChange}
    />
  );
});
