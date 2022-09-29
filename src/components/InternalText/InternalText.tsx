import { ReactElement, ReactNode, useMemo } from 'react';
import { pureFC, PureRef } from '../../anuxComponents';
import { useBinder } from '../../hooks';
import { useRipple } from '../Ripple';
import { Tag } from '../Tag';
import { Label } from '../Label';
import { InternalTextTheme } from './InternalTextTheme';
import { Toolbar } from '../Toolbar';
import { AssistiveLabel } from '../AssistiveLabel';
import { useUIState } from '../../providers';
import { NoSkeletons, Skeleton } from '../Skeleton';

export interface InternalTextProps<TValue = string> {
  className?: string;
  label?: ReactNode;
  value?: TValue;
  width?: string | number;
  endAdornments?: ReactElement[];
  isOptional?: boolean;
  help?: ReactNode;
  assistiveHelp?: ReactNode;
  error?: ReactNode;
  onChange?(value: TValue): void;
}

interface Props<TValue = string> extends InternalTextProps<TValue> {
  tagName: string;
  inputClassName?: string;
  type: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
  startAdornments?: ReactElement[];
}

export function InternalText<TValue = string>(props: Props<TValue>, ref: PureRef) {
  const Component = useMemo(() => pureFC<Props<TValue>>()('InternalText', InternalTextTheme, ({
    backgroundColor, borderColor, activeBorderColor, borderRadius,
  }) => ({
    text: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      minWidth: 50,
      gap: 4,
    },
    textInput: {
      display: 'flex',
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor,
      padding: '0 12px',
      boxShadow: `0 0 0 1px ${borderColor}`,
      borderRadius,
      minHeight: 34,
      alignItems: 'center',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.4s ease',

      '&:active, &:focus, &:focus-within': {
        boxShadow: `0 0 0 1px ${activeBorderColor}`,
      },
    },
    input: {
      outline: 'none',
      appearance: 'textfield',
      border: 0,
      padding: 0,
      width: 0,
      flexGrow: 1,
      textOverflow: 'ellipsis',
    },
    isLoading: {
      visibility: 'hidden',
    },
    toolbarAtEnd: {
      borderRadius: 0,
      borderWidth: 0,
      borderLeftWidth: 1,
      marginRight: -12,
      marginLeft: 12,
    },
    toolbarAtStart: {
      borderRadius: 0,
      borderWidth: 0,
      borderRightWidth: 1,
      marginLeft: -12,
      marginRight: 12,
    },
  }), ({
    tagName,
    type,
    className,
    inputClassName,
    theme: { css, join },
    label,
    value,
    width,
    endAdornments,
    startAdornments,
    isOptional,
    help,
    assistiveHelp,
    error,
    onChange
  }) => {
    const { UIRipple, rippleTarget } = useRipple();
    const { isLoading } = useUIState();
    const bind = useBinder();

    return (
      <Tag name={tagName} className={join(css.text, className)} width={width}>
        <Label isOptional={isOptional} help={help}>{label}</Label>
        <Tag name={`${tagName}-input`} ref={rippleTarget} className={join(css.textInput, isLoading && css.isLoading)}>
          <UIRipple />
          <NoSkeletons>
            {startAdornments instanceof Array && <Toolbar className={css.toolbarAtStart}>{startAdornments}</Toolbar>}
            <input
              type={type}
              className={join(css.input, inputClassName)}
              value={(value ?? '') as any}
              onChange={bind(event => onChange?.(event.target.value as any))}
            />
            {endAdornments instanceof Array && <Toolbar className={css.toolbarAtEnd}>{endAdornments}</Toolbar>}
          </NoSkeletons>
          <Skeleton />
        </Tag>
        <AssistiveLabel isError={error != null}>{error ?? assistiveHelp}</AssistiveLabel>
      </Tag>
    );
  }), []);
  return <Component {...props} ref={ref} />;
}
