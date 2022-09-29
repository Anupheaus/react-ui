import { TooltipTheme } from './TooltipTheme';
import { pureFC } from '../../anuxComponents';
import { TooltipContext, TooltipContextProps } from './TooltipContext';

interface Props extends TooltipContextProps { }

export const Tooltip = pureFC<Props>()('Tooltip', TooltipTheme, () => ({}), ({
  children = null,
  ...props
}) => {
  return (
    <TooltipContext.Provider value={props}>
      {children}
    </TooltipContext.Provider>
  );
});
