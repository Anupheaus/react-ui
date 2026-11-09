import type { HTMLAttributes, KeyboardEvent, RefObject } from 'react';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useBound } from '../../../hooks';

const TABBABLE_SELECTOR = [
  'a[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  '[tabindex]',
].join(',');

const TITLE_SELECTOR = 'titlebar-title';

interface Props {
  windowElementRef: RefObject<HTMLElement>;
  windowId: string;
  /** When false the hook does nothing: a plain window is not a dialog. */
  isModal: boolean;
}

interface ModalWindowProps extends Pick<HTMLAttributes<HTMLElement>, 'role' | 'onKeyDown'> {
  'aria-modal'?: true;
}

function isTabbable(element: HTMLElement): boolean {
  if (element.matches(':disabled') || element.tabIndex < 0) return false;
  if (element.closest('[hidden], [inert]') != null) return false;
  const { display, visibility } = getComputedStyle(element);
  return display !== 'none' && visibility !== 'hidden';
}

function getTabbables(windowElement: HTMLElement): HTMLElement[] {
  return Array.from(windowElement.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter(isTabbable);
}

/** Names the dialog by its title: the title text gets an id and the dialog points at it. */
function labelByTitle(windowElement: HTMLElement, windowId: string): void {
  const titleElement = windowElement.querySelector(TITLE_SELECTOR);
  if (titleElement == null) return windowElement.removeAttribute('aria-labelledby');
  if (titleElement.id === '') titleElement.id = `${windowId}-title`;
  windowElement.setAttribute('aria-labelledby', titleElement.id);
}

/**
 * Makes a window behave as a modal dialog for a screen reader and the keyboard: it is announced as a dialog named by its
 * title with the page behind it unavailable, keyboard focus moves into it when it opens, Tab and Shift+Tab cycle through
 * its own controls only, and focus returns to whatever had it before when the dialog goes. Spread the returned props onto
 * the window's element.
 */
export function useModalWindow({ windowElementRef, windowId, isModal }: Props): ModalWindowProps {
  const openerRef = useRef<HTMLElement | null>(null);

  // Runs after every render so a title that appears or changes later still names the dialog.
  useLayoutEffect(() => {
    const { current: windowElement } = windowElementRef;
    if (!isModal || windowElement == null) return;
    labelByTitle(windowElement, windowId);
  });

  useLayoutEffect(() => {
    const { current: windowElement } = windowElementRef;
    if (!isModal || windowElement == null) return;
    const { activeElement } = document;
    openerRef.current = activeElement instanceof HTMLElement && !windowElement.contains(activeElement) ? activeElement : null;
    // Something inside (an input with autofocus) may have taken focus already: leave it there.
    if (!windowElement.contains(document.activeElement)) (getTabbables(windowElement)[0] ?? windowElement).focus({ preventScroll: true });
    return () => {
      const { current: opener } = openerRef;
      if (opener != null && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [isModal]);

  const keepFocusInside = useBound((event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const { current: windowElement } = windowElementRef;
    // A Tab pressed in a popup that belongs to the dialog (a drop-down's list) bubbles through here but is not ours to move.
    if (windowElement == null || !windowElement.contains(document.activeElement)) return;
    const tabbables = getTabbables(windowElement);
    if (tabbables.length === 0) return event.preventDefault();
    const [first] = tabbables;
    const last = tabbables[tabbables.length - 1];
    const { activeElement } = document;
    const isOnWindowItself = activeElement === windowElement;
    if (event.shiftKey && (activeElement === first || isOnWindowItself)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (activeElement === last || isOnWindowItself)) {
      event.preventDefault();
      first.focus();
    }
  });

  return useMemo<ModalWindowProps>(() => (isModal ? {
    role: 'dialog',
    'aria-modal': true,
    onKeyDown: keepFocusInside,
  } : {}), [isModal, keepFocusInside]);
}
