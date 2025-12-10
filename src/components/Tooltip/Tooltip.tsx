import { useMemo, type ReactNode } from 'react';
import { createComponent } from '../Component';
import type { TooltipContextProps } from './TooltipContext';
import { TooltipContext } from './TooltipContext';
import { is } from '@anupheaus/common';

interface Props extends TooltipContextProps {
  children?: ReactNode;
}

export const Tooltip = createComponent('Tooltip', ({
  children = null,
  content = null,
  ...props
}: Props) => {
  const context = useMemo<TooltipContextProps>(() => ({
    ...props,
    content: is.string(content) ? content.split('\n').map((line, index) => <div key={index}>{line.length > 0 ? line : <br />}</div>) : content,
  }), [content, props]);

  return (
    <TooltipContext.Provider value={context}>
      {children}
    </TooltipContext.Provider>
  );
});
