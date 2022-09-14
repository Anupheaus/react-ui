import { useContext } from 'react';
import { ApiProviderContext } from './ApiProviderContext';

export function useApi() {
  const { isValid, ...api } = useContext(ApiProviderContext);
  if (!isValid) throw new Error('ApiProvider is not valid');
  return api;
}
