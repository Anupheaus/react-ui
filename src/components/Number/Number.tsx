import { is, to } from '@anupheaus/common';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../Component';
import { useBooleanState, useBound } from '../../hooks';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import type { InternalTextProps } from '../InternalText';
import { InternalText } from '../InternalText';
import { Icon } from '../Icon';
import { useLocale, useUIState } from '../../providers';

interface Props extends InternalTextProps<number | undefined> {
  min?: number;
  max?: number;
  step?: number;
  endAdornments?: ReactElement[];
  allowDecimals?: boolean | number;
  allowNegatives?: boolean;
  type?: 'number' | 'currency' | 'percent' | 'count'; // | 'phoneNumber';
}

const useStyles = createStyles({
  number: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },

    '&.reduced-padding': {
      padding: '0 4px',
    },

    '&.number-mode': {
    },

    '&.count-mode': {
      textAlign: 'center',
    },

    '&.currency-mode': {
      textAlign: 'right',
    },

    '&.percent-mode': {
      textAlign: 'center',
    },
  },
});

function allowDecimalsResult(allowDecimals: boolean | number | undefined, type: Props['type']): boolean {
  if (allowDecimals === true) return true;
  if (is.number(allowDecimals)) return (allowDecimals ?? 0) > 0;
  if (type === 'currency') return true;
  return false;
}

export const Number = createComponent('Number', ({
  endAdornments: providedEndAdornments,
  value,
  min,
  max,
  step = 1,
  error: providedError,
  type = 'number',
  allowDecimals,
  onChange,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const { isReadOnly } = useUIState();
  const { formatCurrency, formatPercentage } = useLocale();
  const increase = useBound(() => onChange?.(to.number(value, 0) + step));
  const decrease = useBound(() => onChange?.(to.number(value, 0) - step));
  const [isBlurred, setIsBlurred, setIsNotBlurred] = useBooleanState(true);
  const blurredValue = useMemo(() => {
    switch (type) {
      case 'currency': return formatCurrency(value);
      case 'percent': return formatPercentage((value ?? 0) / 100, is.boolean(allowDecimals) ? (allowDecimals === true ? 2 : 0) : is.number(allowDecimals) ? allowDecimals : 0);
      default: return value;
    }
  }, [value, type]);

  const startAdornments = useMemo(() => {
    switch (type) {
      case 'count': case 'percent': return [
        ...(isReadOnly ? [] : [
          <Button
            key="decrease"
            onClick={decrease}
          >
            <Icon name="number-decrease" size="small" />
          </Button>
        ]),
      ];
    }
  }, []);

  const endAdornments = useMemo(() => {
    switch (type) {
      case 'count': case 'percent': return [
        ...(isReadOnly ? [] : [
          <Button
            key="increase"
            onClick={increase}
          >
            <Icon name="number-increase" size="small" />
          </Button>
        ]),
        ...(providedEndAdornments ?? []),
      ];
    }
  }, [providedEndAdornments, type]);

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
      value={isBlurred ? blurredValue : value}
      tagName={'number'}
      inputClassName={join(css.number, `${type}-mode`, type !== 'count' && 'reduced-padding')}
      type={isBlurred ? 'text' : 'number'}
      endAdornments={endAdornments}
      useFloatingEndAdornments
      startAdornments={startAdornments}
      useFloatingStartAdornments
      error={error}
      onChange={handleChange}
      onBlur={setIsBlurred}
      onFocus={setIsNotBlurred}
      allowDecimals={allowDecimalsResult(allowDecimals, type)}
      allowNegatives={type === 'currency' || type === 'percent'}
    />
  );
});
