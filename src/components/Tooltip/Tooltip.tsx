// import Tippy from '@tippyjs/react';
// import { ReactElement, ReactNode } from 'react';
// import { anuxPureFC } from '../../anuxComponents';
// import 'tippy.js/dist/tippy.css';

// interface Props {
//   value: ReactNode;
//   showArrow?: boolean;
//   children: ReactElement;
// }

// export const Tooltip = anuxPureFC<Props>('Tooltip', ({
//   value,
//   showArrow = false,
//   children = null,
// }) => {
//   if (children == null) return null;

//   return (
//     <Tippy content={value} arrow={showArrow && 'narrow'}>
//       {children}
//     </Tippy>
//   );
// });

import { anuxPureFC } from '../../anuxComponents';
import { TooltipContext, TooltipContextProps } from './TooltipContext';

interface Props extends TooltipContextProps { }

export const Tooltip = anuxPureFC<Props>('Tooltip', ({
  children = null,
  ...props
}) => {
  return (
    <TooltipContext.Provider value={props}>
      {children}
    </TooltipContext.Provider>
  );
});
