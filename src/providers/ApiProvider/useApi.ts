import { useContext, useEffect } from 'react';
import { useId } from '../../hooks';
import { ApiProviderContext } from './ApiProviderContext';
import type { Api } from './ApiProviderModels';

export function useApi() {
  const { isValid, registerStatusCodeHandler, ...api } = useContext(ApiProviderContext);
  const id = useId();
  if (!isValid) throw new Error('ApiProvider is not valid');

  const onStatusCode = (statusCode: number, callback: (response: Response) => void | boolean) => {
    registerStatusCodeHandler(id, statusCode, callback);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- unregister this caller's handler once, on unmount
  useEffect(() => () => registerStatusCodeHandler(id, 0, undefined), []);

  return {
    ...(api as Api),
    onStatusCode,
  };
}
