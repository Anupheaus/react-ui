import { createContext } from 'react';
import { Api } from './ApiProviderModels';

export interface ApiProviderContextProps extends Api {
  isValid: boolean;
  registerStatusCodeHandler(id: string, code: number, callback: ((response: Response) => void | boolean) | undefined): void;
}

export const ApiProviderContext = createContext<ApiProviderContextProps>({
  isValid: false,
  ...({} as any),
});
