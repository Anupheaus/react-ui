import { useContext } from 'react';
import type { ReactNode } from 'react';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { useDistributedState } from '../../../hooks';
import { useBound } from '../../../hooks/useBound';
import { Button } from '../../Button';
import { Flex } from '../../Flex';
import { WindowOkAction } from '../../Windows/Window/WindowOkAction';
import { UIState } from '../../../providers';
import { useWindowValidation } from '../../Windows/Window/WindowValidationContext';
import { useNotifications } from '../../Notifications';
import { WizardContext } from '../WizardContexts';

const useStyles = createStyles(({ windows: { content } }) => ({
  wizardActions: {
    height: 'min-content',
    padding: content.active.padding,
    backgroundColor: content.active.backgroundColor,
    color: content.active.textColor,
    fontSize: content.active.textSize,
    fontWeight: content.active.textWeight,
  },
}));

interface Props {
  children?: ReactNode;
}

export const WizardActions = createComponent('WizardActions', ({ children }: Props) => {
  const { state, steps, isNextEnabled, isBackEnabled, moveNext, moveBack } = useContext(WizardContext);
  const { getAndObserve } = useDistributedState(state);
  const { css } = useStyles();
  const { isValid } = useWindowValidation();
  const { showError } = useNotifications();

  const activeStepId = getAndObserve();
  const activeIndex = steps.findIndex(s => s.id === activeStepId);
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex === steps.length - 1 || steps.length <= 1;

  const handleNext = useBound(() => {
    if (!isValid()) {
      showError('There are validation errors that must be fixed before continuing.');
      return;
    }
    moveNext();
  });

  return (
    <Flex tagName="actions-toolbar" className={css.wizardActions} gap={8} disableGrow align="right">
      {children}
      {!isFirst && <UIState isReadOnly={!isBackEnabled}><Button onClick={moveBack}>Back</Button></UIState>}
      {!isLast && <UIState isReadOnly={!isNextEnabled}><Button onClick={handleNext}>Next</Button></UIState>}
      <WindowOkAction>Save</WindowOkAction>
    </Flex>
  );
});
