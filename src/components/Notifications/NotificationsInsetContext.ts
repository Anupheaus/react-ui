import { createContext } from 'react';

/** Lets something docked to the bottom of the screen (a navigation bar) keep toasts clear of it. */
export interface NotificationsInsetContextProps {
  /** Records how far up from the bottom of the viewport `id` covers, in px; `undefined` when it no longer does. */
  setBottomInset(id: string, insetPx: number | undefined): void;
}

/** Outside a `NotificationsProvider` there are no toasts to move, so reporting an inset does nothing. */
export const NotificationsInsetContext = createContext<NotificationsInsetContextProps>({
  setBottomInset: () => undefined,
});
