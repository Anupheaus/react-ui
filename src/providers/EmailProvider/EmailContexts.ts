import { createContext } from 'react';
import type { EmailSendPayload } from './EmailModels';

export interface EmailContextValue {
  isProvided: boolean;
  send(payload: EmailSendPayload): Promise<void>;
}

export const EmailContext = createContext<EmailContextValue>({
  isProvided: false,
  send: () => {
    throw new Error('useEmail must be used within an <EmailProvider>. Wrap your component tree with <EmailProvider onSend={...}>.');
  },
});
