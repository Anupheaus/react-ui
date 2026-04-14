import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../../components/Component';
import { useBound } from '../../hooks';
import type { EmailSendPayload } from './EmailModels';
import { EmailContext } from './EmailContexts';

interface Props {
  children: ReactNode;
  onSend(payload: EmailSendPayload): Promise<void>;
}

export const EmailProvider = createComponent('EmailProvider', ({ children, onSend }: Props) => {
  const send = useBound(async (payload: EmailSendPayload) => {
    await onSend(payload);
  });

  const contextValue = useMemo(() => ({ send }), [send]);

  return (
    <EmailContext.Provider value={contextValue}>
      {children}
    </EmailContext.Provider>
  );
});
