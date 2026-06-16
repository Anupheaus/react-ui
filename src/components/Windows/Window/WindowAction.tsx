import { useContext, type ReactNode } from 'react';
import type { PromiseMaybe } from '@anupheaus/common';
import { createComponent } from '../../Component';
import { useBound } from '../../../hooks';
import { Button } from '../../Button';
import { WindowRenderContext } from '../WindowsContexts';
import { WindowsManager } from '../WindowsManager';

interface Props {
  value?: string;
  children?: ReactNode;
  onClick?(): PromiseMaybe<void>;
}

export const WindowAction = createComponent('WindowAction', ({
  value,
  children,
  onClick,
}: Props) => {
  const { id, managerId, close } = useContext(WindowRenderContext);

  const handleClick = useBound(async () => {
    if (onClick) await onClick();
    if (value == null) return;
    // Prefer the render context's close (works for both dialogs and inline wizards);
    // fall back to the manager only when no close was provided.
    if (close != null) await close(value);
    else WindowsManager.get(managerId).close(id, value);
  });

  return (
    <Button onClick={handleClick}>{children}</Button>
  );
});
