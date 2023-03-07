import { ReactNode } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { AssistiveLabelTheme } from './AssistiveLabelTheme';

interface Props {
  className?: string;
  error?: ReactNode | Error;
  children?: ReactNode;
}

const useStyles = createStyles(({ useTheme }) => {
  const { errorTextColor, fontSize, fontWeight } = useTheme(AssistiveLabelTheme);
  return {
    styles: {
      assistiveLabel: {
        fontSize,
        fontWeight,
        cursor: 'default',
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

  if (children == null) {
    if (error == null) return null;
    children = error instanceof Error ? error.message : error;
  }

  return (
    <Tag
      name="assistive-label"
      className={join(
        css.assistiveLabel,
        error != null && css.isError,
        className,
      )}>
      {children}
    </Tag>
  );
});
