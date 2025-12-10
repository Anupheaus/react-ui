import type { ReactNode } from 'react';
import { createContext } from 'react';

export interface TooltipContextProps {
  content: ReactNode;
  showArrow?: boolean;
  className?: string;
  persist?: boolean;
  debug?: boolean;
}

export const blankTooltipContext: TooltipContextProps = {
  content: null,
  showArrow: false,
  className: undefined,
  persist: false,
  debug: false,
};

export const TooltipContext = createContext<TooltipContextProps>(blankTooltipContext);
