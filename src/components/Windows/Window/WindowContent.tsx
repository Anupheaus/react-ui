import type { ReactNode } from 'react';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import type { FlexProps } from '../../Flex';
import { Flex } from '../../Flex';

const useStyles = createStyles(({ windows: { content } }) => ({
  content: {
    padding: content.active.padding,
    backgroundColor: content.active.backgroundColor,
    color: content.active.textColor,
    fontSize: content.active.textSize,
    fontWeight: content.active.textWeight,

    '&.no-padding': {
      padding: 0,
    },
  },
}));

interface Props {
  className?: string;
  children?: ReactNode;
  disablePadding?: boolean;
  isVertical?: boolean;
  gap?: FlexProps['gap'];
}

export const WindowContent = createComponent('WindowContent', ({
  className,
  disablePadding = false,
  children = null,
  isVertical = false,
  gap,
}: Props) => {
  const { css, join } = useStyles();

  return (
    <Flex tagName="window-content" className={join(css.content, disablePadding && 'no-padding', className)} disableOverflow isVertical={isVertical} gap={gap}>
      {children}
    </Flex>
  );
});