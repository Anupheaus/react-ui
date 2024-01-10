import { FocusEvent, KeyboardEvent, MouseEvent, ReactElement, Ref } from 'react';
import { createComponent } from '../Component';
import { useBinder } from '../../hooks';
import { InternalField, InternalFieldProps } from '../InternalField';
import { useInputStyles } from './InputStyles';
import { useUIState } from '../../providers';

export interface InternalTextProps<TValue = unknown> extends InternalFieldProps {
  value?: TValue;
  ref?: Ref<HTMLInputElement>;
  initialFocus?: boolean;
  endAdornments?: ReactElement[];
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
  const { isReadOnly } = useUIState();
  const bind = useBinder();

  return (
    <InternalField {...props} tagName={tagName}>
      <input
        ref={innerRef}
        type={type}
        className={join(css.input, isReadOnly && 'is-read-only', inputClassName)}
        value={(value ?? '') as any}
        onChange={bind(event => onChange?.(event.target.value as any))}
        onFocus={onFocus}
        onBlurCapture={onBlur}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        autoFocus={initialFocus}
      />
    </InternalField>
  );
});
