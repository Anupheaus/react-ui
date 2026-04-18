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
}

export const Titlebar = createComponent('Titlebar', ({
  className,
  icon,
  title,
  endAdornment,
  children: rawChildren = null,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const children = Children.toArray(rawChildren)
    .map((child, index) => {
      if (isValidElement(child)) return createElement(child.type, { key: `titlebar-item-${index}`, ...child.props });
    })
    .removeNull();

  return (
    <Flex {...props} tagName="titlebar" className={join(css.titlebar, className)} valign="center" disableGrow>
      {icon}
      {title != null && <Typography tagName="titlebar-title" className={css.title} valign="center">{title}</Typography>}
      <Flex tagName="titlebar-content" className={css.content} valign="center">{children}</Flex>
      {endAdornment != null && <Flex tagName="titlebar-end-adornment" className={css.endAdornment} disableGrow valign="center">{endAdornment}</Flex>}
    </Flex>
  );
});
