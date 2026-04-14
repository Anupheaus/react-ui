import type { ComponentType, ReactNode } from 'react';

export interface EmailSendProps {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
  alias?: string;
  subject?: string;
  replyTo?: string;
}

export interface EmailSendPayload extends Omit<EmailSendProps, 'subject'> {
  subject: string;
  html: string;
}

export interface EmailDefinitionUtils {
  Email: ComponentType<{ subject: string; children?: ReactNode }>;
  Body: ComponentType<{ children?: ReactNode }>;
}

export type EmailDefinition<Args extends unknown[]> =
  (utils: EmailDefinitionUtils) => (...args: Args) => JSX.Element | null;

export type ReactUIEmail<Name extends string, Args extends unknown[]> = {
  readonly name: Name;
  readonly definition: EmailDefinition<Args>;
};

export type EmailSendFunction<Args extends unknown[]> =
  (...args: [...Args, EmailSendProps]) => Promise<void>;
