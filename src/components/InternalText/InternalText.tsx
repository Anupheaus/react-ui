import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../Component';
import { useBooleanState, useBound, useDOMRef } from '../../hooks';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { useInputStyles } from './InputStyles';
import { useUIState, useValidation } from '../../providers';
import { useScrollbarStyles } from '../Scroller/ScrollbarStyles';

export interface InternalTextProps<TValue = unknown> extends FieldProps {
  value?: TValue;
  ref?: Ref<HTMLInputElement>;
  initialFocus?: boolean;
  endAdornments?: ReactNode;
  useFloatingEndAdornments?: boolean;
  startAdornments?: ReactNode;
  useFloatingStartAdornments?: boolean;
  maxLength?: number;
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  invalidValueMessage?: ReactNode;
  placeholder?: string;
  fieldWidth?: number | string;
  onChange?(value: TValue): void;
  onFocus?(event: FocusEvent<HTMLInputElement>): void;
  onClick?(event: MouseEvent<HTMLInputElement>): void;
  onBlur?(event: FocusEvent<HTMLInputElement>): void;
  onKeyDown?(event: KeyboardEvent<HTMLInputElement>): void;
  onKeyUp?(event: KeyboardEvent<HTMLInputElement>): void;
  onEnter?(event: KeyboardEvent<HTMLInputElement>): void;
}

interface Props<TValue = unknown> extends InternalTextProps<TValue> {
  tagName: string;
  inputClassName?: string;
  multiline?: number;
  allowDecimals?: boolean;
  allowNegatives?: boolean;
  type: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
}

export const InternalText = createComponent('InternalText', function <T = unknown>({
  tagName,
  type,
  inputClassName,
  value,
  initialFocus,
  maxLength,
  transform = 'none',
  ref: innerRef,
  isOptional,
  requiredMessage,
  allowDecimals = false,
  allowNegatives = false,
  multiline,
  fieldWidth,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  onClick,
  onKeyDown,
  onKeyUp,
  onEnter,
  ...props
}: Props<T>) {
  const { css, join, useInlineStyle } = useInputStyles();
  const { css: scrollbarCss } = useScrollbarStyles();
  const { isReadOnly } = useUIState();
  const [isScrollbarVisible, setScrollbarVisible, setScrollbarInvisible] = useBooleanState();
  const { validate } = useValidation(`${tagName}-${props.label}`);
  const ref = useDOMRef([innerRef]);
  const isMultiline = (multiline ?? 0) > 1;
  const passwordManagerAttributes = useMemo(() => type === 'email' || type === 'password' ? {} : {
    'data-1p-ignore': true,
  }, [type]);

  const { error, enableErrors } = validate(({ validateRequired }) => validateRequired(value, !isOptional, requiredMessage));

  const handleOnBlur = useBound((event: FocusEvent<HTMLInputElement>) => {
    enableErrors();
    onBlur?.(event);
  });

  const handleOnFocus = useBound((event: FocusEvent<HTMLInputElement>) => {
    onFocus?.(event);
  });

  const handleKeyDown = useBound((event: KeyboardEvent<HTMLInputElement>) => {
    switch (type) {
      case 'number': {
        if (event.key === 'e') return event.preventDefault();
        if (event.key === '.' && !allowDecimals) return event.preventDefault();
        if (event.key === '-' && !allowNegatives) return event.preventDefault();
        break;
      }
    }
    onKeyDown?.(event);
  });

  const handleKeyUp = useBound((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') onEnter?.(event);
    onKeyUp?.(event);
  });

  const handleOnChange = useBound((event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value as any));

  const style = useInlineStyle(() => ({
    width: fieldWidth,
  }), [fieldWidth]);

  const containerClassName = isMultiline ? css.textAreaFieldContainer : undefined;

  const inputOrTextArea = isMultiline
    ? <textarea
      ref={ref}
      className={join(css.textArea, scrollbarCss.scrollbars, css[`textTransform_${transform}`], isScrollbarVisible && 'is-scrollbar-visible', inputClassName)}
      value={(value ?? '') as any}
      maxLength={maxLength}
      onChange={handleOnChange as any}
      onFocusCapture={handleOnFocus as any}
      onBlurCapture={handleOnBlur as any}
      onClick={onClick as any}
      onKeyDown={handleKeyDown as any}
      onKeyUp={handleKeyUp as any}
      onMouseOver={setScrollbarVisible}
      onMouseLeave={setScrollbarInvisible}
      autoFocus={initialFocus}
      rows={multiline}
      disabled={isReadOnly}
      placeholder={placeholder}
    />
    : <input
      ref={ref}
      type={type}
      className={join(css.input, css[`textTransform_${transform}`], inputClassName)}
      value={(value ?? '') as any}
      maxLength={maxLength}
      onChange={handleOnChange}
      onFocusCapture={handleOnFocus}
      onBlurCapture={handleOnBlur}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      autoFocus={initialFocus}
      disabled={isReadOnly}
      placeholder={placeholder}
      {...passwordManagerAttributes}
    />;

  return (
    <Field {...props} containerClassName={containerClassName} isOptional={isOptional} error={props.error ?? error} tagName={tagName} containerStyle={style}>
      {inputOrTextArea}
    </Field>
  );
});
