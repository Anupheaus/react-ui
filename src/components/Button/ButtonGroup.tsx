import { createStyles } from '../../theme';
import type { ReactNode } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { ButtonContext } from './ButtonContext';

interface Props {
  children: ReactNode;
}
const useStyles = createStyles({
  buttonGroup: {
  },
});

export const ButtonGroup = createComponent('ButtonGroup', ({
  children,
}: Props) => {
  const { css, join } = useStyles();

  return (
    <Flex tagName="button-group" className={join(css.buttonGroup)}>
      <ButtonContext.Provider value={{}}>
        {children}
      </ButtonContext.Provider>
    </Flex>
  );
});
