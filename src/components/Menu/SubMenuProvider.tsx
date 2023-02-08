import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';

interface ContextProps {
  isVisible: boolean;
  element: HTMLDivElement | undefined;
  isSubMenu: boolean;
  onHasSubMenu(hasSubMenu: boolean): void;
}

const Context = createContext<ContextProps>({
  isVisible: false,
  element: undefined,
  isSubMenu: false,
  onHasSubMenu: () => void 0,
});

interface Props {
  isVisible?: boolean;
  element?: HTMLDivElement;
  children: ReactNode;
  onHasSubMenu?(hasSubMenu: boolean): void;
}

export const SubMenuProvider = createComponent('SubMenuProvider', ({
  isVisible = false,
  element,
  children,
  onHasSubMenu,
}: Props) => {
  const handleOnSubMenu = useBound((hasSubMenu: boolean) => onHasSubMenu?.(hasSubMenu));

  const context = useMemo<ContextProps>(() => ({
    isVisible,
    element,
    isSubMenu: element != null,
    onHasSubMenu: handleOnSubMenu,
  }), [element, isVisible]);

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  );
});

export function useSubMenu() {
  return useContext(Context);
}
