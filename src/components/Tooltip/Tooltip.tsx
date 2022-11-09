import { ReactNode } from 'react';
import { createComponent } from '../Component';
import { TooltipContext, TooltipContextProps } from './TooltipContext';

interface Props extends TooltipContextProps {
  children?: ReactNode;
}

export const Tooltip = createComponent({
  id: 'Tooltip',

  render({
    children = null,
    ...props
  }: Props) {
    return (
      <TooltipContext.Provider value={props}>
        {children}
      </TooltipContext.Provider>
    );
  },
});
