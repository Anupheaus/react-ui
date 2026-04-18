import { useContext } from 'react';
import type { ReactNode } from 'react';
import { createComponent } from '../../Component';
import { useDistributedState } from '../../../hooks';
import { useBound } from '../../../hooks/useBound';
import { Button } from '../../Button';
import { UIState } from '../../../providers';
import { WindowActions } from '../../Windows/Window/WindowActions';
import { WindowRenderContext } from '../../Windows/WindowsContexts';
import { WizardContext } from '../WizardContexts';

interface Props {
  children?: ReactNode;
}

export const WizardActions = createComponent('WizardActions', ({ children }: Props) => {
  const { state, steps, isNextEnabled, isBackEnabled, moveNext, moveBack } = useContext(WizardContext);
  const { getAndObserve } = useDistributedState(state);
  const { close } = useContext(WindowRenderContext);

  const activeStepId = getAndObserve();
  const activeIndex = steps.findIndex(s => s.id === activeStepId);
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex === steps.length - 1 || steps.length <= 1;

  const handleSave = useBound(() => close?.('ok'));

  return (
    <WindowActions onSave={handleSave} saveLabel="Save">
      {children}
      {!isFirst && <UIState isReadOnly={!isBackEnabled}><Button onClick={moveBack}>Back</Button></UIState>}
      {!isLast && <UIState isReadOnly={!isNextEnabled}><Button onClick={moveNext}>Next</Button></UIState>}
    </WindowActions>
  );
});
