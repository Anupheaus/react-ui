import { createPortal } from 'react-dom';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';
import { WindowAction } from '../Windows/Window/WindowAction';
import { WindowOkAction } from '../Windows/Window/WindowOkAction';
import { WindowsManager } from '../Windows/WindowsManager';
import type { WindowRenderContextProps } from '../Windows/WindowsContexts';
import { WindowRenderContext } from '../Windows/WindowsContexts';
import type { WizardDefinition, WizardNavigationUtils } from './WizardModels';
import { Wizard } from './Wizard/Wizard';
import { WizardStep } from './Wizard/WizardStep';
import { WizardActions } from './Wizard/WizardActions';

interface Props<Args extends unknown[], CloseResponseType = string | undefined> {
  windowId: string;
  managerId: string;
  wizardDefinition: WizardDefinition<Args, CloseResponseType>;
}

export const WizardRenderer = createComponent('WizardRenderer', <Args extends unknown[], CloseResponseType = string | undefined>({
  windowId,
  managerId,
  wizardDefinition,
}: Props<Args, CloseResponseType>) => {
  const manager = WindowsManager.get(managerId);
  const args = manager.getArgs<Args>(windowId);
  const [element, setElement] = useState<HTMLElement>();
  const close = useBound((response?: CloseResponseType) => manager.close(windowId, response));
  const closeWithUnknown = useBound((response?: unknown) => close(response as CloseResponseType));

  const navigationRef = useRef<WizardNavigationUtils>({
    moveNext: () => void 0,
    moveBack: () => void 0,
    setNextIsEnabled: () => void 0,
    setBackIsEnabled: () => void 0,
  });

  // Stable Wizard component with the navigationRef pre-wired
  const BoundWizard = useMemo(() =>
    createComponent('Wizard', (props: React.ComponentProps<typeof Wizard>) => (
      <Wizard {...props} navigationRef={navigationRef} />
    )), []); // eslint-disable-line react-hooks/exhaustive-deps

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
  }), [windowId, BoundWizard]); // eslint-disable-line react-hooks/exhaustive-deps

  const [title, setTitle] = useState<ReactNode>(undefined);
  const setTitleStable = useBound((t: ReactNode) => setTitle(t));

  const context = useMemo<WindowRenderContextProps>(() => ({
    id: windowId,
    managerId,
    close: closeWithUnknown,
    setTitle: setTitleStable,
    title,
  }), [windowId, managerId, title]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    let stopped = false;
    const started = Date.now();
    const find = () => {
      const el = document.getElementById(managerId);
      if (el != null) { setElement(el); return; }
      if (stopped) return;
      if (Date.now() - started > 5000) throw new Error(`Could not find Windows component with id "${managerId}".`);
      setTimeout(find, 100);
    };
    find();
    return () => { stopped = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const firstCall = wizardDefinition(utils as any);
  const content: JSX.Element | null = typeof firstCall === 'function'
    ? (firstCall as (...a: unknown[]) => JSX.Element | null)(...(args as unknown[]))
    : firstCall;

  if (element == null) return null;

  return (
    <WindowRenderContext.Provider value={context}>
      {createPortal(content, element)}
    </WindowRenderContext.Provider>
  );
});
