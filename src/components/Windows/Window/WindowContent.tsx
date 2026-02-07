import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import type { FlexProps } from '../../Flex';
import { Flex } from '../../Flex';
import { Scroller } from '../../Scroller';

const useStyles = createStyles(({ windows: { content } }) => ({
  content: {
    backgroundColor: content.active.backgroundColor,
    color: content.active.textColor,
    fontSize: content.active.textSize,
    fontWeight: content.active.textWeight,
  },
  contentInner: {
    padding: content.active.padding,

    '&.no-padding': {
      padding: 0,
    },
  },
}));

interface Props extends Pick<FlexProps, 'className' | 'isVertical' | 'gap' | 'children' | 'valign' | 'align' | 'disableGrow'> {
  disablePadding?: boolean;
  disableScrolling?: boolean;
}

export const WindowContent = createComponent('WindowContent', ({
  className,
  disablePadding = false,
  disableScrolling = false,
  children,
  ...props
}: Props) => {
  const { css, join } = useStyles();

  const content = (() => {
    const renderedContent = (
      <Flex {...props} tagName="window-content-inner" className={join(css.contentInner, disablePadding && 'no-padding', className)} disableOverflow>
        {children}
      </Flex>
    );
    if (disableScrolling) return renderedContent;
    return (
      <Scroller>
        {renderedContent}
      </Scroller>
    );
  })();

  return (
    <Flex tagName="window-content" className={css.content} disableOverflow>
      {content}
    </Flex>
  );
});