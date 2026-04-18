import { useContext } from 'react';
import type { ReactNode } from 'react';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { useDistributedState } from '../../../hooks';
import { useBound } from '../../../hooks/useBound';
import { Button } from '../../Button';
import { Flex } from '../../Flex';
import { WindowOkAction } from '../../Windows/Window/WindowOkAction';
import { WizardContext } from '../WizardContexts';

const useStyles = createStyles(({ windows: { content } }) => ({
  toolbar: {
    height: 'min-content',
    padding: content.active.padding,
    backgroundColor: content.active.backgroundColor,
  },
}));

interface Props {
  children?: ReactNode;
}

export const WizardActions = createComponent('WizardActions', ({ children }: Props) => {
  const { state, steps, isNextEnabled, isBackEnabled, moveNext, moveBack } = useContext(WizardContext);
  const { getAndObserve } = useDistributedState(state);
  const { css } = useStyles();

  const activeStepId = getAndObserve();
  const activeIndex = steps.findIndex(s => s.id === activeStepId);
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex === steps.length - 1 || steps.length <= 1;

  const handleNext = useBound(() => moveNext());
  const handleBack = useBound(() => moveBack());

  return (
    <Flex tagName="actions-toolbar" className={css.toolbar} gap={8} disableGrow align="right">
      {children}
      {!isFirst && <Button onClick={handleBack} disabled={!isBackEnabled}>Back</Button>}
      {!isLast && <Button onClick={handleNext} disabled={!isNextEnabled}>Next</Button>}
      <WindowOkAction>Save</WindowOkAction>
    </Flex>
  );
});
