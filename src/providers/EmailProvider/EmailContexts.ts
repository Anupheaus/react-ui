import { createContext } from 'react';
import type { EmailSendPayload } from './EmailModels';

export interface EmailContextValue {
  send(payload: EmailSendPayload): Promise<void>;
}

export const EmailContext = createContext<EmailContextValue>({
  send: () => {
    throw new Error('useEmail must be used within an <EmailProvider>. Wrap your component tree with <EmailProvider onSend={...}>.');
  },
});
