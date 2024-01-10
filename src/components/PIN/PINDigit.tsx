import { KeyboardEvent, Ref } from 'react';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { useRipple } from '../Ripple';
import { createStyles } from '../../theme/createStyles';
import { is } from '@anupheaus/common';
import { useUIState } from '../../providers';
import { Skeleton } from '../Skeleton';
import { PINTheme } from './PINTheme';

const useStyles = createStyles(({ useTheme, activePseudoClasses }) => {
  const { default: defaultField, active: activeField, disabled: disabledField } = useTheme(PINTheme);
  return {
    styles: {
      digit: {
        minWidth: 28,
        maxWidth: 28,
        minHeight: 28,
        maxHeight: 28,
        ...defaultField,
        borderWidth: 1,
        borderStyle: 'solid',
        overflow: 'hidden',

        [activePseudoClasses]: {
          ...activeField,
        },

        '&.is-read-only': {
          ...disabledField,
        },

        '&.is-loading': {
          borderColor: 'transparent',
        },
      },
      digitValue: {
        width: 40,
        height: 40,
        opacity: 0,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        transitionProperty: 'opacity, width, height',
        transitionDuration: '0.4s',
        transitionTimingFunction: 'ease-out',

        '&.is-censored': {
          backgroundColor: defaultField.borderColor,
          borderRadius: '50%',
        },

        '&.has-value': {
          '&.is-censored': {
            width: 12,
            height: 12,
          },
          opacity: 1,
        },
      },
      input: {
        position: 'absolute',
        inset: 0,
        border: 0,
        appearance: 'none',
        backgroundColor: 'transparent',
        textAlign: 'center',
        outline: 'none',

        '&.is-read-only': {

        },

        '&.has-value-and-not-censored': {
          paddingLeft: 10,
        },
      },
    },
  };
});

const ignoreOnChange = () => void 0;

interface Props {
  className?: string;
  ref?: Ref<HTMLInputElement | null>;
  value?: string;
  isCensored?: boolean;
  initialFocus?: boolean;
  onChange(value: string | undefined): void;
}

export const PINDigit = createComponent('PINDigit', ({
  className,
  isCensored = true,
  initialFocus,
  ref,
  value,
  onChange,
}: Props) => {
  const { css, join } = useStyles();
  const { Ripple, rippleTarget } = useRipple();
  const hasValue = is.numeric(value ?? '');
  const { isLoading, isReadOnly } = useUIState();

  const handleKeyDown = useBound((event: KeyboardEvent) => {
    event.stopPropagation();
  });

  const handleKeyUp = useBound((event: KeyboardEvent) => {
    event.persist();
    event.stopPropagation();
    if (is.numeric(event.key)) onChange(event.key);
    if (event.key === 'Backspace') onChange(' ');
  });

  const saveElement = useBound((element: HTMLInputElement | null) => {
    rippleTarget(element);
    if (is.function(ref)) ref?.(element);
  });

  return (
    <Flex tagName="pin-digit" className={join(css.digit, isReadOnly && !isLoading && 'is-read-only', isLoading && 'is-loading', className)} alignCentrally>
      {isLoading && <Skeleton type="full" />}
      {!isLoading && (<>
        <Ripple stayWithinContainer ignoreMouseCoords />
        <Flex tagName="digit-value" className={join(css.digitValue, hasValue && 'has-value', isCensored && 'is-censored')} disableGrow >{isCensored ? null : value}</Flex>
        <input
          type="text"
          value=""
          ref={saveElement}
          className={join(css.input, isReadOnly && 'is-read-only', hasValue && !isCensored && 'has-value-and-not-censored')}
          disabled={isReadOnly}
          onChange={ignoreOnChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          autoFocus={initialFocus}
        />
      </>)}
    </Flex>
  );
});