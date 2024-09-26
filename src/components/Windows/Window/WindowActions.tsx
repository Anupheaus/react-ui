import type { ReactNode } from 'react';
import { createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';

interface Props {
  className?: string;
  children?: ReactNode;
}
const useStyles = createStyles(({ windows: { content, actions } }) => ({
  windowActions: {
    height: 'min-content',
    padding: actions.padding,
    backgroundColor: content.active.backgroundColor,
    color: content.active.textColor,
    fontSize: content.active.textSize,
    fontWeight: content.active.textWeight,
  },
}));

export const WindowActions = createComponent('WindowActions', ({
  className,
  children = null,
}: Props) => {
  const { css, join } = useStyles();
  return (
    <Flex
      tagName="window-actions"
      className={join(css.windowActions, className)}
      valign="center"
      align="right"
      gap={12}
      disableGrow
    >
      {children}
    </Flex>
  );
});
