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

/**
 * The room a form leaves at the sides of a phone screen, in px: the screen's gutter and the dialog's padding, on both
 * sides. `100cqi` is the screen's width unless an ancestor is a size container.
 */
const SCREEN_SIDE_GUTTERS = 64;

const useStyles = createStyles(({ assistiveLabel: { normal }, text }) => ({
  assistiveLabel: {
    fontSize: normal.fontSize,
    fontWeight: normal.fontWeight,
    color: normal.color ?? text.color,
    cursor: 'default',
    // As wide as its message, so a short one holds a shrink-to-fit field open on one line, as it always has; never
    // wider than its field, so a long one wraps inside it.
    width: 'max-content',
    maxWidth: '100%',
  },
  // A percentage is ignored while a shrink-to-fit box measures its content, so on its own the label's 100% never
  // stopped a long message pushing a form on a 320px phone wider than the screen. A screen-relative length is not
  // ignored: the message is measured at most the screen's width less its side gutters, and wraps from there. `anywhere`
  // wraps a long unbroken word too.
  text: {
    display: 'block',
    maxWidth: `calc(100cqi - ${SCREEN_SIDE_GUTTERS}px)`,
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
      <Tag name="assistive-label-text" className={css.text}>{children ?? <>&nbsp;</>}</Tag>
    </Tag>
  );
});
