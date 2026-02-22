import { useState } from 'react';
import { useBound, useDOMRef } from '../../hooks';
import { Menu } from './Menu';
import type { MenuProps } from './Menu';

export function usePopupMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const [isOpen, setIsOpen] = useState(false);

  const target = useDOMRef({
    connected: el => setAnchorEl(el),
    disconnected: () => setAnchorEl(undefined),
  });

  const openMenu = useBound(() => setIsOpen(true));
  const closeMenu = useBound(() => setIsOpen(false));

  const MenuWithPopup = (menuProps: Omit<MenuProps, 'anchorEl' | 'isOpen' | 'onClose'>) => (
    <Menu
      {...menuProps}
      anchorEl={anchorEl}
      isOpen={isOpen}
      onClose={closeMenu}
    />
  );

  return {
    target,
    Menu: MenuWithPopup,
    openMenu,
    closeMenu,
  };
}
