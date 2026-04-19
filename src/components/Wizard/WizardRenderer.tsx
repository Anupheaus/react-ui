import { useContext, useMemo, useRef } from 'react';
import type { ComponentProps } from 'react';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';
import { WindowAction } from '../Windows/Window/WindowAction';
import { WindowOkAction } from '../Windows/Window/WindowOkAction';
import { WindowRenderContext } from '../Windows/WindowsContexts';
import type { WizardDefinition, WizardNavigationUtils } from './WizardModels';
import { Wizard } from './Wizard/Wizard';
import { WizardStep } from './Wizard/WizardStep';
import { WizardActions } from './Wizard/WizardActions';

interface Props<Args extends unknown[], CloseResponseType = string | undefined> {
  args: Args;
  wizardDefinition: WizardDefinition<Args, CloseResponseType>;
}

/**
 * Renders the wizard definition content. Relies on WindowRenderer (or equivalent) having already
 * portaled this into the correct manager DOM element and provided WindowRenderContext.
 */
export const WizardContentComponent = createComponent('WizardContentComponent', <Args extends unknown[], CloseResponseType = string | undefined>({
  args,
  wizardDefinition,
}: Props<Args, CloseResponseType>) => {
  const { id: windowId, close: contextClose } = useContext(WindowRenderContext);
  const close = useBound(async (response?: CloseResponseType) => { await contextClose?.(response as unknown); });

  const navigationRef = useRef<WizardNavigationUtils>({
    moveNext: () => void 0,
    moveBack: () => void 0,
    setNextIsEnabled: () => void 0,
    setBackIsEnabled: () => void 0,
  });

  const BoundWizard = useMemo(() =>
    createComponent('Wizard', (props: ComponentProps<typeof Wizard>) => (
      <Wizard {...props} navigationRef={navigationRef} />
    )), []); // intentional: navigationRef is stable

  const utils = useMemo(() => ({
    id: windowId,
    Wizard: BoundWizard,
    Step: WizardStep as any,
    Actions: WizardActions as any,
    Action: WindowAction,
    OkButton: WindowOkAction,
    close,
    moveNext: () => navigationRef.current.moveNext(),
    moveBack: () => navigationRef.current.moveBack(),
    setNextIsEnabled: (v: boolean) => navigationRef.current.setNextIsEnabled(v),
    setBackIsEnabled: (v: boolean) => navigationRef.current.setBackIsEnabled(v),
  }), [windowId, BoundWizard, close]); // intentional: navigationRef methods are stable

  const firstCall = wizardDefinition(utils as any);
  const content: JSX.Element | null = typeof firstCall === 'function'
    ? (firstCall as (...a: unknown[]) => JSX.Element | null)(...(args as unknown[]))
    : firstCall;

  return <>{content}</>;
});
