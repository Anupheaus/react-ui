import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, ReactNode, Ref } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createComponent } from '../Component';
import { useBound, useDOMRef } from '../../hooks';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { useInputStyles } from './InputStyles';
import { useUIState, useValidation } from '../../providers';
import { Scroller } from '../Scroller';

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
  const { isReadOnly } = useUIState();
  const { validate } = useValidation(`${tagName}-${props.label}`);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const ref = useDOMRef([innerRef, textareaRef as any]);
  const isMultiline = (multiline ?? 0) > 1;
  const [rowsHeight, setRowsHeight] = useState<number | undefined>(undefined);
  const passwordManagerAttributes = useMemo(() => type === 'email' || type === 'password' ? {} : {
    'data-1p-ignore': true,
  }, [type]);

  useLayoutEffect(() => {
    if (!isMultiline || textareaRef.current == null) return;
    setRowsHeight(textareaRef.current.offsetHeight);
  }, [isMultiline]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el == null || !isMultiline) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value, isMultiline]);

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
    ...(isMultiline && rowsHeight != null && { height: rowsHeight }),
  }), [fieldWidth, isMultiline, rowsHeight]);

  const containerClassName = isMultiline ? css.textAreaFieldContainer : undefined;

  const inputOrTextArea = isMultiline
    ? <Scroller fullHeight>
      <textarea
        ref={ref}
        className={join(css.textArea, css[`textTransform_${transform}`], isReadOnly && css.isReadOnly, inputClassName)}
        value={(value ?? '') as any}
        maxLength={maxLength}
        onChange={handleOnChange as any}
        onFocusCapture={handleOnFocus as any}
        onBlurCapture={handleOnBlur as any}
        onClick={onClick as any}
        onKeyDown={handleKeyDown as any}
        onKeyUp={handleKeyUp as any}
        autoFocus={initialFocus}
        rows={multiline}
        disabled={isReadOnly}
        placeholder={placeholder}
      />
    </Scroller>
    : <input
      ref={ref}
      type={type}
      className={join(css.input, css[`textTransform_${transform}`], isReadOnly && css.isReadOnly, inputClassName)}
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
