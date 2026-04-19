import { useContext } from 'react';
import { createComponent } from '../../Component';
import { createStyles } from '../../../theme';
import { useDistributedState } from '../../../hooks';
import { WizardContext } from '../WizardContexts';

const CIRCLE_SIZE = 20;
const LINE_WIDTH = 2;
const LINE_HEIGHT = 20;

const useStyles = createStyles(({ wizard: { progress } }) => ({
  panel: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    width: 200,
    padding: '24px 16px 24px 20px',
    backgroundColor: progress.panelBackgroundColor,
    borderRight: `1px solid ${progress.panelBorderColor}`,
    overflowY: 'auto',
  },
  stepRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    cursor: 'default',
    userSelect: 'none',
  },
  stepRowClickable: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: '50%',
    flexShrink: 0,
    transition: 'background-color 300ms ease, border-color 300ms ease',
  },
  circleCurrent: {
    backgroundColor: progress.currentColor,
  },
  circleCompleted: {
    backgroundColor: progress.completedColor,
  },
  circleFuture: {
    border: `2px solid ${progress.futureColor}`,
    backgroundColor: 'transparent',
  },
  connector: {
    width: LINE_WIDTH,
    height: LINE_HEIGHT,
    marginLeft: (CIRCLE_SIZE - LINE_WIDTH) / 2,
    flexShrink: 0,
    transition: 'background-color 300ms ease',
  },
  connectorCompleted: {
    backgroundColor: progress.lineCompletedColor,
  },
  connectorFuture: {
    backgroundColor: progress.lineColor,
  },
  label: {
    color: progress.labelColor,
    fontSize: 13,
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

export const WizardStepIndicator = createComponent('WizardStepIndicator', () => {
  const { state, steps, navigateTo } = useContext(WizardContext);
  const { getAndObserve } = useDistributedState(state);
  const { css, join } = useStyles();

  const activeStepId = getAndObserve();
  const activeIndex = steps.findIndex(s => s.id === activeStepId);

  return (
    <div className={css.panel}>
      {steps.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isCurrent = index === activeIndex;

        return (
          <div key={step.id}>
            {index > 0 && (
              <div className={join(css.connector, index <= activeIndex ? css.connectorCompleted : css.connectorFuture)} />
            )}
            <div
              className={join(css.stepRow, isCompleted && css.stepRowClickable)}
              onClick={isCompleted ? () => navigateTo(step.id) : undefined}
            >
              <div className={join(
                css.circle,
                isCurrent && css.circleCurrent,
                isCompleted && css.circleCompleted,
                !isCurrent && !isCompleted && css.circleFuture,
              )} />
              {step.label != null && <span className={css.label}>{step.label}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
});
