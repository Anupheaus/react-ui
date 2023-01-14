import { ReactNode } from 'react';
import { createComponent } from '../../../components';
import { useBound } from '../../../hooks';
import { InteractionContext } from './InteractionContext';
import { MouseMoveEvent } from './InteractionEvents';

interface Props {
  children: ReactNode;
  onMouseMove?(event: MouseMoveEvent): void;
}

export const InteractionProvider = createComponent({
  id: 'InteractionProvider',

  render({
    onMouseMove,
    children,
  }: Props) {

    const context = useBound((event: Event) => {
      if (event.type === 'mousemove') onMouseMove?.(event as MouseMoveEvent);
    });

    return (
      <InteractionContext.Provider value={context}>
        {children}
      </InteractionContext.Provider>
    );
  },
});
