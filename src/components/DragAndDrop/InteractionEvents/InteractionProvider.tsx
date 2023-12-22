import { ReactNode } from 'react';
import { createComponent } from '../../../components/Component';
import { useBound } from '../../../hooks/useBound';
import { InteractionContext } from './InteractionContext';
import { MouseMoveEvent } from './InteractionEvents';

interface Props {
  children: ReactNode;
  onMouseMove?(event: MouseMoveEvent): void;
}

export const InteractionProvider = createComponent('InteractionProvider', ({
  onMouseMove,
  children,
}: Props) => {

  const context = useBound((event: Event) => {
    if (event.type === 'mousemove') onMouseMove?.(event as MouseMoveEvent);
  });

  return (
    <InteractionContext.Provider value={context}>
      {children}
    </InteractionContext.Provider>
  );
});
