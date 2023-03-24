import { createStyles } from '../../theme/createStyles';
import { ReactElement, Ref } from 'react';
import { createComponent } from '../Component';
import { useBinder } from '../../hooks';
import { InternalField, InternalFieldProps } from '../InternalField';

export interface InternalTextProps<TValue = unknown> extends InternalFieldProps {
  value?: TValue;
  ref?: Ref<HTMLInputElement>;
  onChange?(value: TValue): void;
}

interface Props<TValue = unknown> extends InternalTextProps<TValue> {
  tagName: string;
  inputClassName?: string;
  type: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
  startAdornments?: ReactElement[];
  endAdornments?: ReactElement[];
}

const useStyles = createStyles({
  input: {
    outline: 'none',
    appearance: 'textfield',
    position: 'absolute',
    inset: 0,
    border: 0,
    padding: '0 12px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundColor: 'transparent!important',
  },
});

export const InternalText = createComponent('InternalText', function <T = unknown>({
  tagName,
  type,
  inputClassName,
  value,
  ref: innerRef,
  onChange,
  ...props
}: Props<T>) {
  const { css, join } = useStyles();
  const bind = useBinder();

  return (
    <InternalField {...props} tagName={tagName}>
      <input
        ref={innerRef}
        type={type}
        className={join(css.input, inputClassName)}
        value={(value ?? '') as any}
        onChange={bind(event => onChange?.(event.target.value as any))}
      />
    </InternalField>
  );
});
