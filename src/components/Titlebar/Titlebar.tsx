import type { ReactNode } from 'react';
import { Children, createElement, isValidElement } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { Typography } from '../Typography';

const useStyles = createStyles(({ transitions, toolbar: { normal, active, title, content }, pseudoClasses }) => ({
  titlebar: {
    transitionDuration: `${transitions.duration}ms`,
    transitionTimingFunction: transitions.function,
    minHeight: 40,
    zIndex: 1000,
    ...normal,

    [pseudoClasses.active]: active,
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
}));

interface Props {
  className?: string;
  icon?: ReactNode;
  title?: ReactNode;
  endAdornment?: ReactNode;
  children?: ReactNode;
  /** Replaces the default title rendering (including its `titlebar-title` wrapper); receives the `title` prop. */
  renderTitle?(title: ReactNode): ReactNode;
}

export const Titlebar = createComponent('Titlebar', ({
  className,
  icon,
  title,
  endAdornment,
  renderTitle,
  children: rawChildren = null,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const children = Children.toArray(rawChildren)
    .map((child, index) => {
      // Text children are kept as-is; only elements are re-created with a stable key.
      if (!isValidElement(child)) return child;
      return createElement(child.type, { key: `titlebar-item-${index}`, ...child.props });
    })
    .removeNull();

  return (
    <Flex {...props} tagName="titlebar" className={join(css.titlebar, className)} valign="center" disableGrow>
      {icon}
      {renderTitle != null && renderTitle(title)}
      {renderTitle == null && title != null && <Typography tagName="titlebar-title" className={css.title} valign="center">{title}</Typography>}
      <Flex tagName="titlebar-content" className={css.content} valign="center">{children}</Flex>
      {endAdornment != null && <Flex tagName="titlebar-end-adornment" className={css.endAdornment} disableGrow valign="center">{endAdornment}</Flex>}
    </Flex>
  );
});
