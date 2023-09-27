import { useContext, useEffect } from 'react';
import { useId } from '../../hooks';
import { ApiProviderContext } from './ApiProviderContext';
import { Api } from './ApiProviderModels';

export function useApi() {
  const { isValid, registerStatusCodeHandler, ...api } = useContext(ApiProviderContext);
  const id = useId();
  if (!isValid) throw new Error('ApiProvider is not valid');

  const onStatusCode = (statusCode: number, callback: (response: Response) => void | boolean) => {
    registerStatusCodeHandler(id, statusCode, callback);
  };

  useEffect(() => () => registerStatusCodeHandler(id, 0, undefined), []);

  return {
    ...(api as Api),
    onStatusCode,
  };
}
