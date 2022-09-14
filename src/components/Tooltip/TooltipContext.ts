import { createContext, ReactNode } from 'react';

export interface TooltipContextProps {
  content: ReactNode;
  showArrow?: boolean;
  className?: string;
  debug?: boolean;
}

export const blankTooltipContext: TooltipContextProps = {
  content: null,
  showArrow: false,
  className: undefined,
  debug: false,
};

export const TooltipContext = createContext<TooltipContextProps>(blankTooltipContext);
