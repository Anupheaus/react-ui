import { FocusEvent, KeyboardEvent, MouseEvent, ReactNode, Ref, useMemo } from 'react';
import { createComponent } from '../Component';
import { useBinder, useBooleanState, useBound } from '../../hooks';
import { Field, FieldProps } from '../Field';
import { useInputStyles } from './InputStyles';
import { useValidation } from '../../providers';
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
  multiline?: number;
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
  multiline,
  onChange,
  onFocus,
  onBlur,
  onClick,
  onKeyDown,
  onKeyUp,
  ...props
}: Props<T>) {
  const { css, join } = useInputStyles();
  const { css: scrollbarCss } = useScrollbarStyles();
  const [isScrollbarVisible, setScrollbarVisible, setScrolbarInvisible] = useBooleanState();
  const { validate } = useValidation(`${tagName}-${props.label}`);
  const bind = useBinder();
  const isMultiline = (multiline ?? 0) > 1;
  const passwordManagerAttributes = useMemo(() => type === 'email' || type === 'password' ? {} : {
    'data-1p-ignore': true,
  }, [type]);

  const { error, enableErrors } = validate(({ validateRequired }) => validateRequired(value, !isOptional, requiredMessage));

  const handleOnBlur = useBound((event: FocusEvent<HTMLInputElement>) => {
    enableErrors();
    onBlur?.(event);
  });

  const containerClassName = isMultiline ? css.textAreaFieldContainer : undefined;

  const inputOrTextArea = isMultiline
    ? <textarea
      ref={innerRef as Ref<HTMLTextAreaElement>}
      className={join(css.textArea, scrollbarCss.scrollbars, css[`textTransform_${transform}`], isScrollbarVisible && 'is-scrollbar-visible', inputClassName)}
      value={(value ?? '') as any}
      maxLength={maxLength}
      onChange={bind(event => onChange?.(event.target.value as any))}
      onFocus={onFocus as any}
      onBlurCapture={handleOnBlur as any}
      onClick={onClick as any}
      onKeyDown={onKeyDown as any}
      onKeyUp={onKeyUp as any}
      onMouseOver={setScrollbarVisible}
      onMouseLeave={setScrolbarInvisible}
      autoFocus={initialFocus}
      rows={multiline}
    />
    : <input
      ref={innerRef}
      type={type}
      className={join(css.input, css[`textTransform_${transform}`], inputClassName)}
      value={(value ?? '') as any}
      maxLength={maxLength}
      onChange={bind(event => onChange?.(event.target.value as any))}
      onFocus={onFocus}
      onBlurCapture={handleOnBlur}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      autoFocus={initialFocus}

      {...passwordManagerAttributes}
    />;

  return (
    <Field {...props} containerClassName={containerClassName} isOptional={isOptional} error={props.error ?? error} tagName={tagName}>
      {inputOrTextArea}
    </Field>
  );
});
