import { ReactNode, useMemo, useRef } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { PINDigit } from './PINDigit';
import { useDelegatedBound } from '../../hooks';
import { Field, FieldProps } from '../Field';

interface Props extends FieldProps {
  className?: string;
  label?: ReactNode;
  isOptional?: boolean;
  length?: number;
  help?: ReactNode;
  isCensored?: boolean;
  initialFocus?: boolean;
  value?: string;
  onChange?(value: string): void;
  onSubmit?(value: string): void;
}

function padValue(value: string, length: number) {
  return `${value}${' '.repeat(length - (value?.length ?? 0))}`;
}

function replace(value: string, length: number, index: number, replacement: string | undefined) {
  const paddedValue = padValue(value, length);
  if (replacement == null || replacement.length === 0) replacement = ' ';
  return `${paddedValue.slice(0, index)}${replacement[0]}${paddedValue.slice(index + 1)}`;
}

export const PIN = createComponent('PIN', ({
  length = 4,
  value: rawValue,
  isCensored,
  initialFocus,
  onChange,
  onSubmit,
  ...props
}: Props) => {
  const value = useMemo(() => padValue(rawValue ?? '', length), [rawValue]);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleChangeDigit = useDelegatedBound((index: number) => (replacement: string | undefined) => {
    if (replacement === ' ' && index > 0) {
      if (value[index] === ' ') {
        elementsRef.current[index - 1]?.focus();
        index -= 1;
      }
    } else if (replacement !== ' ' && index < length - 1) {
      elementsRef.current[index + 1]?.focus();
    }
    const newValue = replace(value, length, index, replacement).trim();
    onChange?.(newValue);
    if (index === length - 1 && newValue.length === length) onSubmit?.(newValue);
  });

  const saveElement = useDelegatedBound((index: number) => (element: HTMLDivElement | null) => { elementsRef.current[index] = element; });

  const digits = useMemo(() => new Array(length).fill(undefined).map((_, index) => (
    <PINDigit
      key={index}
      ref={saveElement(index)}
      isCensored={isCensored}
      value={value?.[index]}
      onChange={handleChangeDigit(index)}
      initialFocus={initialFocus && index === 0}
    />
  )), [length, value]);

  return (
    <Field {...props} tagName="pin" noContainer>
      <Flex tagName='digits-container' gap={8}>
        {digits}
      </Flex>
    </Field>
  );
});