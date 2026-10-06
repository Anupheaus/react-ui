import type { ReactNode } from 'react';
import { createContext } from 'react';
import type { TooltipProps as MuiTooltipProps } from '@mui/material';

export type TooltipPlacement = NonNullable<MuiTooltipProps['placement']>;

export interface TooltipContextProps {
  content: ReactNode;
  showArrow?: boolean;
  className?: string;
  persist?: boolean;
  debug?: boolean;
  /** Which side of the target the tooltip opens on. Defaults to below it. */
  placement?: TooltipPlacement;
  /** Milliseconds before the tooltip shows. Defaults to 300. */
  enterDelay?: number;
}

export const blankTooltipContext: TooltipContextProps = {
  content: null,
  showArrow: false,
  className: undefined,
  persist: false,
  debug: false,
  placement: undefined,
  enterDelay: undefined,
};

export const TooltipContext = createContext<TooltipContextProps>(blankTooltipContext);
