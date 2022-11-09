import { ReactNode } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { AssistiveLabelTheme } from './AssistiveLabelTheme';

interface Props {
  className?: string;
  isError?: boolean;
  children?: ReactNode;
}

export const AssistiveLabel = createComponent({
  id: 'AssistiveLabel',

  styles: ({ useTheme }) => {
    const { definition: { errorTextColor, fontSize, fontWeight } } = useTheme(AssistiveLabelTheme);
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
  },

  render({
    className,
    isError,
    children = null,
  }: Props, { css, join }) {
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
  },
});
