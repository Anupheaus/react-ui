import { Children, createElement, isValidElement, ReactNode } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';

const useStyles = createStyles(({ text: { primary: primaryText }, transition, toolbar: { normal, active, title, content }, activePseudoClasses }) => ({
  titlebar: {
    ...primaryText,
    ...transition,
    minHeight: 40,
    zIndex: 1000,
    ...normal,

    [activePseudoClasses]: active,
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
      {title != null && <Flex tagName="titlebar-title" className={css.title} valign="center">{title}</Flex>}
      <Flex tagName="titlebar-content" className={css.content} valign="center">{children}</Flex>
      {endAdornment != null && <Flex tagName="titlebar-end-adornment" className={css.endAdornment} disableGrow valign="center">{endAdornment}</Flex>}
    </Flex>
  );
});
