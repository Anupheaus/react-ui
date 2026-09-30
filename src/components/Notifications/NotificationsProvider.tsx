import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import { NotificationsInsetContext, type NotificationsInsetContextProps } from './NotificationsInsetContext';

/** The gap (px) between the toasts and the bottom of the screen, or whatever is docked there. */
const TOASTER_EDGE_GAP_PX = 16;

interface Props {
  children: ReactNode;
}

export const NotificationsProvider = createComponent('NotificationsProvider', ({
  children,
}: Props) => {
  const [insets, setInsets] = useState<ReadonlyMap<string, number>>(new Map());

  const setBottomInset = useBound((id: string, insetPx: number | undefined) => setInsets(current => {
    if (current.get(id) === insetPx) return current;
    const next = new Map(current);
    if (insetPx == null) next.delete(id); else next.set(id, insetPx);
    return next;
  }));

  const context = useMemo<NotificationsInsetContextProps>(() => ({ setBottomInset }), [setBottomInset]);

  // Lifted above the tallest thing docked at the bottom (a navigation bar), so a toast never covers it.
  const containerStyle = useMemo(() => ({ bottom: TOASTER_EDGE_GAP_PX + Math.max(0, ...insets.values()) }), [insets]);

  return (<>
    <Toaster
      position="bottom-center"
      reverseOrder
      containerStyle={containerStyle}
    />
    <NotificationsInsetContext.Provider value={context}>
      {children}
    </NotificationsInsetContext.Provider>
  </>);
});
