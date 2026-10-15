import type { ReactNode } from 'react';
import { Children, createElement, isValidElement } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Tag } from '../Tag';
import { Typography } from '../Typography';
import { useCrowdedTitlebar } from './useCrowdedTitlebar';

const useStyles = createStyles(({ transitions, toolbar: { normal, active, title, content }, pseudoClasses }) => ({
  titlebar: {
    transitionDuration: `${transitions.duration}ms`,
    transitionTimingFunction: transitions.function,
    minHeight: 40,
    zIndex: 1000,
    ...normal,

    [pseudoClasses.active]: active,
  },
  // The icon and the title as one unit, so the wrapped layout can keep them on the first row with the end adornment. It
  // takes no part in the one-row layout (`display: contents`): its children are the titlebar's own flex items then.
  heading: {
    display: 'contents',
  },
  title: {
    ...title,
  },
  content: {
    ...content,
  },
  endAdornment: {
    ...content,
  },
  // Not enough width for everything on one row (a window on a phone): the icon, the title and the end adornment stay on
  // the first row, the title giving way first (an ellipsis), and the middle content takes a row of its own below, wrapping.
  // Consumers can style against `titlebar.is-crowded` for parts nested deeper inside the content.
  crowded: {
    flexWrap: 'wrap',
    rowGap: 4,
    // Two rows are taller than the bar's one-row height: keep that height rather than letting a short window squash the
    // bar over its own content.
    flexShrink: 0,

    '& > titlebar-heading': {
      display: 'flex',
      alignItems: 'center',
      flex: '1 1 0',
      minWidth: 0,
      gap: 'inherit',
    },
    '& > titlebar-heading > titlebar-title': {
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '& > titlebar-content': {
      order: 1,
      flex: '1 1 100%',
      flexWrap: 'wrap',
      minWidth: 0,
      '& > *': { flexWrap: 'wrap', minWidth: 0 },
    },
    '& > titlebar-end-adornment': {
      flex: 'none',
    },
  },
}));

interface Props {
  className?: string;
  icon?: ReactNode;
  title?: ReactNode;
  endAdornment?: ReactNode;
  children?: ReactNode;
  /** Replaces the default title rendering (including its `titlebar-title` wrapper); receives the `title` prop. */
  renderTitle?(title: ReactNode): ReactNode;
  /**
   * When the icon, title, content and end adornment need more width than the titlebar has, wrap: the icon, title and end
   * adornment stay on one row (the title shortening first) and the content goes on a row below, so nothing is pushed out of
   * reach. Adds the `is-crowded` class while wrapped. The titlebar is unchanged while everything fits.
   */
  wrapWhenCrowded?: boolean;
}

export const Titlebar = createComponent('Titlebar', ({
  className,
  icon,
  title,
  endAdornment,
  renderTitle,
  wrapWhenCrowded = false,
  children: rawChildren = null,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const { isCrowded, titlebarRef } = useCrowdedTitlebar(wrapWhenCrowded);
  const children = Children.toArray(rawChildren)
    .map((child, index) => {
      // Text children are kept as-is; only elements are re-created with a stable key.
      if (!isValidElement(child)) return child;
      return createElement(child.type, { key: `titlebar-item-${index}`, ...child.props });
    })
    .removeNull();

  return (
    <Flex {...props} ref={titlebarRef} tagName="titlebar" className={join(css.titlebar, isCrowded && css.crowded, isCrowded && 'is-crowded', className)} valign="center" disableGrow>
      <Tag name="titlebar-heading" className={css.heading}>
        {icon}
        {renderTitle != null && renderTitle(title)}
        {renderTitle == null && title != null && <Typography tagName="titlebar-title" className={css.title} valign="center">{title}</Typography>}
      </Tag>
      <Flex tagName="titlebar-content" className={css.content} valign="center">{children}</Flex>
      {endAdornment != null && <Flex tagName="titlebar-end-adornment" className={css.endAdornment} disableGrow valign="center">{endAdornment}</Flex>}
    </Flex>
  );
});
