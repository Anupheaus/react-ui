import { createStyles } from '../../theme/createStyles';
import { ReactElement, ReactNode, Ref } from 'react';
import { createComponent } from '../Component';
import { useRipple } from '../Ripple';
import { Tag } from '../Tag';
import { Label } from '../Label';
import { InternalFieldTheme } from './InternalFieldTheme';
import { Toolbar } from '../Toolbar';
import { AssistiveLabel } from '../AssistiveLabel';
import { useUIState } from '../../providers/UIStateProvider';
import { NoSkeletons, Skeleton } from '../Skeleton';
import { useDOMRef } from '../../hooks';

export interface InternalFieldProps {
  className?: string;
  label?: ReactNode;
  width?: string | number;
  isOptional?: boolean;
  help?: ReactNode;
  assistiveHelp?: ReactNode;
  error?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

interface Props extends InternalFieldProps {
  tagName: string;
  containerClassName?: string;
  contentClassName?: string;
  startAdornments?: ReactElement[];
  endAdornments?: ReactElement[];
  noContainer?: boolean;
  children: ReactNode;
}

const useStyles = createStyles(({ activePseudoClasses, useTheme }) => {
  const {
    backgroundColor, activeBackgroundColor, textColor, activeTextColor, borderColor, activeBorderColor, borderRadius,
    fontSize, fontWeight,
  } = useTheme(InternalFieldTheme);

  return {
    styles: {
      field: {
        display: 'flex',
        flexGrow: 0,
        flexShrink: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        minWidth: 50,
        gap: 4,
      },
      fieldContainer: {
        display: 'flex',
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor,
        color: textColor,
        borderColor,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius,
        fontSize,
        fontWeight,
        minHeight: 30,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        transitionProperty: 'border-color, background-color, color',
        transitionDuration: '0.4s',
        transitionTimingFunction: 'ease',

        [activePseudoClasses]: {
          borderColor: activeBorderColor,
          backgroundColor: activeBackgroundColor,
          color: activeTextColor,
        },
      },
      fieldContent: {
        display: 'flex',
        flexGrow: 1,
        flexShrink: 1,
        position: 'relative',
        overflow: 'hidden',
      },
      isLoading: {
        visibility: 'hidden',
        borderStyle: 'none',
      },
      toolbarAtEnd: {
        borderRadius: 0,
        borderWidth: 0,
        borderLeftWidth: 1,
      },
      toolbarAtStart: {
        borderRadius: 0,
        borderWidth: 0,
        borderRightWidth: 1,
      },
    },
  };
});

export const InternalField = createComponent('InternalField', ({
  tagName,
  className,
  containerClassName,
  contentClassName,
  label,
  width,
  endAdornments,
  startAdornments,
  isOptional,
  noContainer = false,
  help,
  assistiveHelp,
  error,
  children,
  ref,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const { Ripple, rippleTarget } = useRipple();
  const containerRef = useDOMRef([ref, rippleTarget]);
  const { isLoading } = useUIState();

  const wrapContent = (content: ReactNode) => {
    if (noContainer) return content;
    return (
      <Tag name={`${tagName}-container`} ref={containerRef} className={join(css.fieldContainer, isLoading && css.isLoading, containerClassName)}>
        <Ripple />
        <NoSkeletons>
          {startAdornments instanceof Array && <Toolbar className={css.toolbarAtStart}>{startAdornments}</Toolbar>}
          <Tag name={`${tagName}-content-container`} className={join(css.fieldContent, contentClassName)}>
            {children}
          </Tag>
          {endAdornments instanceof Array && <Toolbar className={css.toolbarAtEnd}>{endAdornments}</Toolbar>}
        </NoSkeletons>
        <Skeleton />
      </Tag>
    );
  };

  return (
    <Tag {...props} name={tagName} className={join(css.field, className)} width={width}>
      <Label isOptional={isOptional} help={help}>{label}</Label>
      {wrapContent(children)}
      <AssistiveLabel error={error}>{assistiveHelp}</AssistiveLabel>
    </Tag>
  );
});
