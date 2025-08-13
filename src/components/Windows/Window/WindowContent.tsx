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

interface Props extends Pick<FlexProps, 'className' | 'isVertical' | 'gap' | 'children' | 'valign' | 'align'> {
  disablePadding?: boolean;
}

export const WindowContent = createComponent('WindowContent', ({
  className,
  disablePadding = false,
  ...props
}: Props) => {
  const { css, join } = useStyles();

  return (
    <Flex  {...props} tagName="window-content" className={join(css.content, disablePadding && 'no-padding', className)} disableOverflow />
  );
});