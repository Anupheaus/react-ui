import { Children, ReactNode, useMemo } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { ButtonContexts } from './ButtonContext';

interface Props {
  children: ReactNode;
}

export const ButtonGroup = createComponent({
  id: 'ButtonGroup',

  styles: () => ({
    styles: {
      buttonGroup: {
      },
    },
  }),

  render({
    children,
  }: Props, { css, join }) {
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
  },
});
