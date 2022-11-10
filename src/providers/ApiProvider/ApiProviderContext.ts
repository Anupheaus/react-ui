import { createContext } from 'react';
import { Api } from './ApiProviderModels';

export interface ApiProviderContextProps extends Api {
  isValid: boolean;
}

export const ApiProviderContext = createContext<ApiProviderContextProps>({
  isValid: false,
  ...({} as any),
});
