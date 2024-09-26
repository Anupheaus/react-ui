import type { ReactNode } from 'react';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { Flex } from '../../Flex';

const useStyles = createStyles(({ windows: { content } }) => ({
  content: {
    padding: content.active.padding,
    backgroundColor: content.active.backgroundColor,
    color: content.active.textColor,
    fontSize: content.active.textSize,
    fontWeight: content.active.textWeight,
  },
}));

interface Props {
  className?: string;
  children?: ReactNode;
}

export const WindowContent = createComponent('WindowContent', ({
  className,
  children = null,
}: Props) => {
  const { css, join } = useStyles();

  return (
    <Flex tagName="window-content" className={join(css.content, className)} disableOverflow>
      {children}
    </Flex>
  );
});