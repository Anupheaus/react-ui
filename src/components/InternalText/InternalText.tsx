import { FocusEvent, KeyboardEvent, MouseEvent, ReactElement, ReactNode, Ref } from 'react';
import { createComponent } from '../Component';
import { useBinder } from '../../hooks';
import { Field, FieldProps } from '../Field';
import { useInputStyles } from './InputStyles';

export interface InternalTextProps<TValue = unknown> extends FieldProps {
  value?: TValue;
  ref?: Ref<HTMLInputElement>;
  initialFocus?: boolean;
  endAdornments?: ReactNode;
  onChange?(value: TValue): void;
  onFocus?(event: FocusEvent<HTMLInputElement>): void;
  onClick?(event: MouseEvent<HTMLInputElement>): void;
  onBlur?(event: FocusEvent<HTMLInputElement>): void;
  onKeyDown?(event: KeyboardEvent<HTMLInputElement>): void;
  onKeyUp?(event: KeyboardEvent<HTMLInputElement>): void;
}

interface Props<TValue = unknown> extends InternalTextProps<TValue> {
  tagName: string;
  inputClassName?: string;
  type: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
  startAdornments?: ReactElement[];

}

export const InternalText = createComponent('InternalText', function <T = unknown>({
  tagName,
  type,
  inputClassName,
  value,
  initialFocus,
  ref: innerRef,
  onChange,
  onFocus,
  onBlur,
  onClick,
  onKeyDown,
  onKeyUp,
  ...props
}: Props<T>) {
  const { css, join } = useInputStyles();
  const bind = useBinder();

  return (
    <Field {...props} tagName={tagName}>
      <input
        ref={innerRef}
        type={type}
        className={join(css.input, inputClassName)}
        value={(value ?? '') as any}
        onChange={bind(event => onChange?.(event.target.value as any))}
        onFocus={onFocus}
        onBlurCapture={onBlur}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        autoFocus={initialFocus}
      />
    </Field>
  );
});
