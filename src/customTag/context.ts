import { createContext, Context } from 'react';

export interface ICustomTagContext {
  prefix: string;
}

export const CustomTagContext: Context<ICustomTagContext> = createContext<ICustomTagContext>({ prefix: '' });
