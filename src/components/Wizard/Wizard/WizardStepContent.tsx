import { useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useBatchUpdates, useDistributedState } from '../../../hooks';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { Flex } from '../../Flex';
import { Scroller } from '../../Scroller';
import { WizardContext } from '../WizardContexts';

const useStyles = createStyles(({ windows: { content: { active: contentActive } } }) => ({
  step: {
    gridRow: '1 / 1',
    gridColumn: '1 / 1',
    opacity: 0,
    transitionProperty: 'opacity, margin-left, margin-right',
    transitionDuration: '400ms',
    transitionTimingFunction: 'ease',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: -1,

    '&.is-visible': {
      opacity: 1,
      pointerEvents: 'all',
      zIndex: 0,
    },

    '&.slide-left': {
      marginLeft: -50,
      marginRight: 50,
    },

    '&.slide-right': {
      marginLeft: 50,
      marginRight: -50,
    },
  },
  stepContent: {
    padding: contentActive.padding,
  },
}));

interface Props {
  stepId: string;
  children: ReactNode;
}

export const WizardStepContent = createComponent('WizardStepContent', ({ stepId, children }: Props) => {
  const { state, steps } = useContext(WizardContext);
  const { onChange, get } = useDistributedState(state);
  const { css, join } = useStyles();
  const [isFocused, setIsFocused] = useState(get() === stepId);
  const [direction, setDirection] = useState('right');
  const batchUpdate = useBatchUpdates();

  onChange(newId => batchUpdate(() => {
    const newIndex = steps.findIndex(s => s.id === newId);
    const myIndex = steps.findIndex(s => s.id === stepId);
    setDirection(newIndex > myIndex ? 'left' : 'right');
    setIsFocused(newId === stepId);
  }));

  return (
    <Flex tagName="wizard-step" className={join(css.step, !isFocused && `slide-${direction}`, isFocused && 'is-visible')}>
      <Scroller fullHeight>
        <Flex tagName="wizard-step-content" isVertical className={css.stepContent}>
          {children}
        </Flex>
      </Scroller>
    </Flex>
  );
});
