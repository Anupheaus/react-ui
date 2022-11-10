import { useContext } from 'react';
import { ApiProviderContext } from './ApiProviderContext';
import { Api } from './ApiProviderModels';

export function useApi(): Api {
  const { isValid, ...api } = useContext(ApiProviderContext);
  if (!isValid) throw new Error('ApiProvider is not valid');
  return api;
}
