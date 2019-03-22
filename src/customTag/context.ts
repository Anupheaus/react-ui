import { createContext } from 'react';

export interface ICustomTagContext {
  prefix: string;
}

export const CustomTagContext = createContext({ prefix: '' });
