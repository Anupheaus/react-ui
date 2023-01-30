import { createStyles } from '../../theme/createStyles';
import { Children, ReactNode, useMemo } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { ButtonContexts } from './ButtonContext';

interface Props {
  children: ReactNode;
}
const useStyles = createStyles(() => ({
  styles: {
    buttonGroup: {
    },
  },
}));

export const ButtonGroup = createComponent('ButtonGroup', ({
  children,
}: Props) => {
  const { css, join } = useStyles();
  const arrayOfChildren = useMemo(() => Children.toArray(children)
    .map((child, index) => (
      <ButtonContexts.buttonGroup.Provider key={index} value={{}}>
        {child}
      </ButtonContexts.buttonGroup.Provider>
    )), [children]);

  return (
    <Flex tagName="button-group" className={join(css.buttonGroup)}>
      {arrayOfChildren}
    </Flex>
  );
});
