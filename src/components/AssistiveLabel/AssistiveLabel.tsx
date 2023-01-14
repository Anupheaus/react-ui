import { ReactNode } from 'react';
import { createStyles } from '../../theme';
import { createComponent2 } from '../Component';
import { Tag } from '../Tag';
import { AssistiveLabelTheme } from './AssistiveLabelTheme';

interface Props {
  className?: string;
  isError?: boolean;
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

export const AssistiveLabel = createComponent2('AssistiveLabel', ({
  className,
  isError,
  children = null,
}: Props) => {
  const { css, join } = useStyles();
  if (children == null) return null;
  return (
    <Tag
      name="assistive-label"
      className={join(
        css.assistiveLabel,
        isError && css.isError,
        className,
      )}>
      {children}
    </Tag>
  );
});
