import { ReactNode } from 'react';
import { createLegacyStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { AssistiveLabelTheme } from './AssistiveLabelTheme';
import { Error, is } from '@anupheaus/common';

interface Props {
  className?: string;
  error?: ReactNode | globalThis.Error;
  children?: ReactNode;
}

const useStyles = createLegacyStyles(({ useTheme }) => {
  const { errorTextColor, fontSize, fontWeight } = useTheme(AssistiveLabelTheme);
  return {
    styles: {
      assistiveLabel: {
        fontSize,
        fontWeight,
        cursor: 'default',
        width: 'max-content',
      },
      isError: {
        color: errorTextColor,
      },
    },
  };
});

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
