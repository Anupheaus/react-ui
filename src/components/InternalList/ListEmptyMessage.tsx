import type { ReactNode } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';

const useStyles = createStyles({
  emptyMessage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '0 24px',
    textAlign: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    pointerEvents: 'none',
    zIndex: 1,
  },
});

interface Props {
  children: ReactNode;
}

/**
 * What an empty List or Table says in its body — what the list is for and what to do next ("No tasks assigned to you.
 * Press Add task to create one."), so an empty list never looks broken or still loading. Centred over the body.
 */
export const ListEmptyMessage = createComponent('ListEmptyMessage', ({ children }: Props) => {
  const { css } = useStyles();
  return <Flex tagName="list-empty-message" className={css.emptyMessage} valign="center">{children}</Flex>;
});
