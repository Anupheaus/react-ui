import { to } from '@anupheaus/common';
import { KeyboardEvent, useMemo, useRef } from 'react';
import { useBinder, useDelegatedBound, useId } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { InternalField, InternalFieldProps } from '../InternalField';
import { Number } from '../Number';

const useStyles = createStyles({
  pinInputs: {
    width: 'min-content',
  },
  pinInput: {
    minWidth: 24,
    '& assistive-label': {
      display: 'none',
    },
  },
});

const validKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(v => v.toString());

interface Props extends InternalFieldProps {
  value?: string;
  initialFocus?: boolean;
  onChange?(value: string): void;
  onComplete?(value: string): void;
}

export const PIN = createComponent('PIN', ({
  ref,
  value: providedValue,
  initialFocus,
  onChange,
  onComplete,
  ...props
}: Props) => {
  const id = useId();
  const { css } = useStyles();
  const bind = useBinder();
  const value = useMemo(() => Array.ofSize(4).map((_, index) => to.number(providedValue?.[index])), [providedValue]);
  const lastKeyDownIndexRef = useRef(0);

  const updatePINValue = useDelegatedBound((index: number) => (newValue: number | undefined) => {
    if (!onChange) return;
    const newFullValue = value.slice();
    newFullValue[index] = newValue;
    const pin = newFullValue.map(v => v ?? ' ').join('');
    onChange(pin);
  });

  const moveToNextInput = (index: number) => {
    const nextPinInputId = `pin-input-${id}-${index + 1}`;
    const nextPinInput = document.querySelector(`[data-id="${nextPinInputId}"] input`) as HTMLInputElement | null;
    if (nextPinInput == null) return;
    nextPinInput.focus();
  };

  const preventDefaultIfNoneSelected = (event: KeyboardEvent<HTMLInputElement>) => {
    const selection = window.getSelection();
    if (event.currentTarget.value.length === 0 || (selection != null && selection.rangeCount === 1 && selection.type === 'Range')) return;
    event.preventDefault();
  };

  const completeIfPossible = () => {
    if (!onComplete) return;
    const pin = value.map(v => v ?? ' ').join('');
    if (pin.length === 4 && !pin.includes(' ')) onComplete?.(pin);
  };

  const handleKeyDown = useDelegatedBound((index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    lastKeyDownIndexRef.current = index;
    if (index < 3) return;
    preventDefaultIfNoneSelected(event);
  });

  const handleKeyUp = useDelegatedBound((index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (lastKeyDownIndexRef.current !== index) { event.preventDefault(); return; }
    if (index !== 3 && validKeys.includes(event.key)) moveToNextInput(index);
    if (index === 3) completeIfPossible();
  });

  return (
    <InternalField
      {...props}
      tagName="pin"
      noContainer
    >
      <Flex tagName="pin-inputs" gap={8} fixedSize className={css.pinInputs}>
        {Array.ofSize(4).map((_, index) => (
          <Number
            key={`pin-input-${index}`}
            ref={index === 0 ? ref : undefined}
            className={css.pinInput}
            hideIncreaseDecreaseButtons
            min={0}
            max={9}
            width={24}
            initialFocus={initialFocus && index === 0}
            value={value[index]}
            onChange={updatePINValue(index)}
            onFocus={bind(event => event.currentTarget.select())}
            onClick={bind(event => event.currentTarget.select())}
            onKeyDown={handleKeyDown(index)}
            onKeyUp={handleKeyUp(index)}
            data-id={`pin-input-${id}-${index}`}
          />
        ))}
      </Flex>
    </InternalField>
  );
});
