import { ReactNode } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { Error, is } from '@anupheaus/common';

interface Props {
  className?: string;
  error?: ReactNode | globalThis.Error;
  children?: ReactNode;
}

const useStyles = createStyles(({ assistiveLabel: { normal } }) => ({
  assistiveLabel: {
    fontSize: normal.fontSize,
    fontWeight: normal.fontWeight,
    cursor: 'default',
    width: 'max-content',
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
