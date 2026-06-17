import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useBound, useId } from '../../hooks';
import { createComponent } from '../Component';
import type { WindowRenderContextProps } from '../Windows/WindowsContexts';
import { WindowRenderContext } from '../Windows/WindowsContexts';
import { WizardRenderModeContext } from './WizardContexts';
import { WizardContentComponent } from './WizardRenderer';
import type { WizardDefinition } from './WizardModels';

export interface InlineWizardProps<Args extends unknown[] = unknown[], CloseResponseType = string | undefined> {
  /** The positional arguments the wizard definition takes. */
  args?: Args;
  /** Called when the wizard finishes (final-step Save) or the definition calls close(response). */
  onClose?(response?: CloseResponseType): void;
}

/**
 * Builds the inline (chrome-less) renderer for a wizard. It provides the same WindowRenderContext
 * the dialog path relies on — but with close() wired to the onClose prop instead of a window
 * manager — and flips WizardRenderModeContext to 'inline' so <Wizard> renders WizardInlineShell.
 */
export function createInlineWizard<Args extends unknown[], CloseResponseType = string | undefined>(
  name: string,
  wizardDefinition: WizardDefinition<Args, CloseResponseType>,
) {
  return createComponent(`Inline${name}`, ({ args, onClose }: InlineWizardProps<Args, CloseResponseType>) => {
    const id = useId();
    const [title, setTitle] = useState<ReactNode | undefined>(undefined);
    const close = useBound(async (response?: unknown) => { onClose?.(response as CloseResponseType); });
    const setTitleStable = useBound((newTitle: ReactNode) => setTitle(newTitle));

    const renderContext = useMemo<WindowRenderContextProps>(() => ({
      id,
      managerId: id, // sentinel: never dereferenced inline because consumers use close (see WindowAction)
      close,
      setTitle: setTitleStable,
      title,
    }), [id, close, setTitleStable, title]);

    return (
      <WizardRenderModeContext.Provider value={{ mode: 'inline' }}>
        <WindowRenderContext.Provider value={renderContext}>
          <WizardContentComponent args={(args ?? []) as Args} wizardDefinition={wizardDefinition} />
        </WindowRenderContext.Provider>
      </WizardRenderModeContext.Provider>
    );
  });
}
