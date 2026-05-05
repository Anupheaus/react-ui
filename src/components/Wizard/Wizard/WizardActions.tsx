import { useContext } from 'react';
import { createComponent } from '../../Component';
import { useDistributedState } from '../../../hooks';
import { useBound } from '../../../hooks/useBound';
import { Button } from '../../Button';
import { UIState } from '../../../providers';
import type { ActionsToolbarProps } from '../../ActionsToolbar';
import { WindowActions } from '../../Windows/Window/WindowActions';
import { useWindowValidation } from '../../Windows/Window/WindowValidationContext';
import { WindowRenderContext } from '../../Windows/WindowsContexts';
import { WizardContext, WizardEnabledContext } from '../WizardContexts';

type Props = ActionsToolbarProps;

export const WizardActions = createComponent('WizardActions', ({ children, onSave, saveLabel, isSaveReadOnly, ...rest }: Props) => {
  const { state, steps, moveNext, moveBack, checkStepIsValid } = useContext(WizardContext);
  const { isNextEnabled, isBackEnabled } = useContext(WizardEnabledContext);
  const { getAndObserve } = useDistributedState(state);
  const { close } = useContext(WindowRenderContext);
  const { isValid: isWindowValid } = useWindowValidation();

  const activeStepId = getAndObserve();
  const activeIndex = steps.findIndex(s => s.id === activeStepId);
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex === steps.length - 1 || steps.length <= 1;
  const activeStep = steps[activeIndex];
  const stepHidesNext = activeStep?.hideNext === true;
  const stepHidesBack = activeStep?.hideBack === true;

  const handleSave = useBound(() => isLast ? (onSave ? onSave() : close?.('ok')) : moveNext());
  const handleCheckIsValid = useBound(() => isLast ? isWindowValid() : checkStepIsValid(activeStepId));

  return (
    <WindowActions
      {...rest}
      onSave={stepHidesNext ? undefined : handleSave}
      onCheckIsValid={handleCheckIsValid}
      saveLabel={isLast ? (saveLabel ?? 'Save') : 'Next'}
      isSaveReadOnly={isSaveReadOnly === true || (!isNextEnabled && !isLast)}
    >
      {children}
      {!isFirst && !stepHidesBack && (
        <UIState isReadOnly={!isBackEnabled}>
          <Button onClick={moveBack}>Back</Button>
        </UIState>
      )}
    </WindowActions>
  );
});
