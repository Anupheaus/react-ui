import type { ReactNode } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { Error, is } from '@anupheaus/common';

interface Props {
  className?: string;
  error?: ReactNode | globalThis.Error;
  children?: ReactNode;
}

const useStyles = createStyles(({ assistiveLabel: { normal }, text }) => ({
  assistiveLabel: {
    fontSize: normal.fontSize,
    fontWeight: normal.fontWeight,
    color: normal.color ?? text.color,
    cursor: 'default',
    // The message wraps inside the width its field is given, long unbroken words included: sized to its text
    // (`max-content`) it pushed a form on a 320px phone wider than the screen and the form scrolled sideways.
    // `anywhere` (not `break-word`) also lowers the label's minimum width, so it never holds its field open either.
    minWidth: 0,
    maxWidth: '100%',
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
  },
  isError: {
    color: normal.errorTextColor,
  },
}));

export const AssistiveLabel = createComponent('AssistiveLabel', ({
  className,
  error,
  children = null,
}: Props) => {
  const { css, join } = useStyles();

  if (error != null) {
    if (is.string(error) || is.reactElement(error)) {
      children = error;
    } else {
      const baseError = new Error({ error });
      children = baseError.message;
    }
  }

  if (children === false) return null; // do not render if it is disabled

  return (
    <Tag
      name="assistive-label"
      className={join(
        css.assistiveLabel,
        error != null && css.isError,
        className,
      )}>
      {children ?? <>&nbsp;</>}
    </Tag>
  );
});
