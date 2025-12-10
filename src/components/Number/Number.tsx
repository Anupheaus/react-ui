import { is, to } from '@anupheaus/common';
import type { FocusEvent, ReactNode } from 'react';
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
  endAdornments?: ReactNode;
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
      textAlign: 'right',
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

function fixDecimals(value: number | undefined, type: Props['type'], allowDecimals: boolean | number | undefined): number | undefined {
  if (!is.number(value)) return value;
  if (allowDecimals == null || allowDecimals === false) {
    return Math.roundTo(value, (type === 'percent' ? 2 : 0));
  } else if (is.number(allowDecimals)) {
    return Math.roundTo(value, allowDecimals + (type === 'percent' ? 2 : 0));
  }
}

function convertValueComingIn(value: number | undefined, type: Props['type'], allowDecimals: boolean | number | undefined, isOptional: boolean): number | undefined {
  if (value == null && isOptional) return;
  if (is.string(value)) value = to.number(value);
  if (type === 'percent' && value != null) value *= 100;
  return fixDecimals(value, 'number', allowDecimals); // always use number as at this point, a percent is just a number too
}

function convertValueGoingOut(value: number | string | undefined, type: Props['type'], allowDecimals: boolean | number | undefined): number | undefined {
  if (is.string(value)) value = to.number(value);
  if (!is.number(value)) return value;
  if (type === 'percent') value /= 100;
  return fixDecimals(value, type, allowDecimals);
}

export const Number = createComponent('Number', ({
  startAdornments: providedStartAdornments,
  endAdornments: providedEndAdornments,
  value: providedValue,
  min,
  max,
  step = 1,
  error: providedError,
  type = 'number',
  allowDecimals,
  isOptional = false,
  onChange: providedOnChange,
  onBlur: providedOnBlur,
  onFocus: providedOnFocus,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const { isReadOnly } = useUIState();
  const { formatCurrency, formatPercentage } = useLocale();
  if (allowDecimals == null && type === 'currency') allowDecimals = 2;
  const onChange = useBound((newValue: number | string | undefined) => providedOnChange?.(convertValueGoingOut(newValue, type, allowDecimals)));
  const increase = useBound(() => onChange(to.number(value, 0) + step));
  const decrease = useBound(() => onChange(to.number(value, 0) - step));
  const [isBlurred, setIsBlurred, setIsNotBlurred] = useBooleanState(true);
  const value = useMemo(() => convertValueComingIn(providedValue, type, allowDecimals, isOptional), [providedValue, type, allowDecimals, isOptional]);
  const blurredValue = useMemo(() => {
    if (value == null && isOptional) return;
    switch (type) {
      case 'currency': return formatCurrency(value);
      case 'percent': return formatPercentage((value ?? 0) / 100, is.boolean(allowDecimals) ? (allowDecimals === true ? 2 : 0) : is.number(allowDecimals) ? allowDecimals : 0);
      default: return value;
    }
  }, [value, type]);

  const startAdornments = useMemo(() => {
    const ownStartAdornments = (() => {
      if (isReadOnly) return null;
      switch (type) {
        case 'count': case 'percent': return (
          <Button
            key="decrease"
            onClick={decrease}
          >
            <Icon name="number-decrease" size="small" />
          </Button>
        );
      }
      return null;
    })();
    if (ownStartAdornments == null && providedStartAdornments == null) return null;
    return <>{ownStartAdornments}{providedStartAdornments ?? null}</>;
  }, [type, providedStartAdornments, isReadOnly]);

  const endAdornments = useMemo(() => {
    if (isReadOnly) return null;
    const ownEndAdornments = (() => {
      switch (type) {
        case 'count': case 'percent': return (
          <Button
            key="increase"
            onClick={increase}
          >
            <Icon name="number-increase" size="small" />
          </Button>
        );
      }
      return null;
    })();
    if (ownEndAdornments == null && providedEndAdornments == null) return null;
    return <>{ownEndAdornments}{providedEndAdornments ?? null}</>;
  }, [providedEndAdornments, type, isReadOnly]);

  const error = useMemo(() => {
    if (providedError) return providedError;
    if (min == null && max == null) return;
    if (value == null) return;
    if (min != null && value < min) return `Value cannot be less than ${min}`;
    if (max != null && value > max) return `Value cannot be greater than ${max}`;
  }, [providedError, min, max, value]);

  const blur = useBound((event: FocusEvent<HTMLInputElement>) => {
    setIsBlurred();
    providedOnBlur?.(event);
  });

  const focus = useBound((event: FocusEvent<HTMLInputElement>) => {
    setIsNotBlurred();
    providedOnFocus?.(event);
  });

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
      onChange={onChange}
      onBlur={blur}
      onFocus={focus}
      allowDecimals={allowDecimalsResult(allowDecimals, type)}
      allowNegatives={type === 'currency' || type === 'percent'}
      isOptional={isOptional}
    />
  );
});
