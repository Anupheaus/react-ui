import { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import type { ComponentType, ReactNode } from 'react';
import { useBound } from '../../hooks';
import type { EmailDefinitionUtils, EmailSendFunction, EmailSendProps, ReactUIEmail } from './EmailModels';
import { EmailContext } from './EmailContext';

export function useEmail<Name extends string, Args extends unknown[]>(
  template: ReactUIEmail<Name, Args>,
): EmailSendFunction<Args> {
  const { isProvided, send } = useContext(EmailContext);

  const email = useBound((...allArgs: unknown[]) => {
    if (!isProvided) {
      throw new Error('useEmail must be used within an <EmailProvider>');
    }

    const sendProps = allArgs[allArgs.length - 1] as EmailSendProps;
    const templateArgs = allArgs.slice(0, -1) as Args;

    return (async () => {
      let capturedSubject = '';

      const Email: ComponentType<{ subject: string; children?: ReactNode }> = ({ subject, children }) => {
        capturedSubject = subject;
        return <>{children}</>;
      };

      const Body: ComponentType<{ children?: ReactNode }> = ({ children }) => (
        <>{children}</>
      );

      const utils: EmailDefinitionUtils = { Email, Body };
      const renderer = template.definition(utils);
      const element = renderer(...templateArgs);

      const container = document.createElement('div');
      const root = createRoot(container);
      flushSync(() => root.render(element));
      const html = container.innerHTML;
      root.unmount();

      const subject = sendProps.subject ?? capturedSubject;

      await send({ ...sendProps, subject, html });
    })();
  });

  // useBound returns a stable reference typed as Function; cast is safe because
  // the inner IIFE always resolves to Promise<void>.
  return email as EmailSendFunction<Args>;
}
