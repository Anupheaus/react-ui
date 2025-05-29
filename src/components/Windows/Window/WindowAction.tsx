import { useContext, type ReactNode } from 'react';
import type { PromiseMaybe } from '@anupheaus/common';
import { createComponent } from '../../Component';
import { useBound } from '../../../hooks';
import { Button } from '../../Button';
import { WindowContext } from '../WindowsContexts';
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
  const { id, managerId } = useContext(WindowContext);
  const manager = WindowsManager.get(managerId);

  const handleClick = useBound(async () => {
    if (onClick) await onClick();
    if (value != null) manager.close(id, value);
  });

  return (
    <Button onClick={handleClick}>{children}</Button>
  );
});
