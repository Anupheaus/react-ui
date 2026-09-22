import { InternalError } from '@anupheaus/common';
import type { ReactElement, ReactNode } from 'react';
import { Children, Fragment, cloneElement, isValidElement } from 'react';
import { WindowHeader } from './WindowHeader';

/** A Window's children separated into its (optional) Header and everything else. */
export interface WindowHeaderSplitResult {
  header?: ReactElement;
  content: ReactNode;
}

interface FragmentProps {
  children?: ReactNode;
}

/**
 * Pulls the WindowHeader out of a Window's children (looking through fragments) so the Window can render it in the header
 * slot regardless of where it was declared. Throws if more than one Header is declared.
 */
export function splitWindowHeader(children: ReactNode): WindowHeaderSplitResult {
  let header: ReactElement | undefined;

  const removeHeader = (nodes: ReactNode): ReactNode[] => Children.toArray(nodes).map(child => {
    if (!isValidElement(child)) return child;
    if (child.type === WindowHeader) {
      if (header != null) throw new InternalError('A Window, Dialog or Wizard can only have one Header, but more than one was declared.');
      header = child;
      return null;
    }
    if (child.type !== Fragment) return child;
    const { children: fragmentChildren } = child.props as FragmentProps;
    return cloneElement(child, undefined, ...removeHeader(fragmentChildren));
  });

  const content = removeHeader(children);
  // Hand back the untouched children when there is no Header so windows without one reconcile exactly as before.
  if (header == null) return { content: children };
  return { header, content };
}
