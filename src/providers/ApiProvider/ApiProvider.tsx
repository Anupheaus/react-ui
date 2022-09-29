import { useMemo } from 'react';
import { pureFC } from '../../anuxComponents';
import { useBound } from '../../hooks/useBound';
import { ApiProviderContext, ApiProviderContextProps } from './ApiProviderContext';

interface Props {
  token?: string;
}

export const ApiProvider = pureFC<Props>()('ApiProvider', ({
  children = null,
}) => {

  const headers = useMemo<RequestInit['headers']>(() => ({
    'Content-Type': 'application/json',
  }), []);

  const get = useBound<ApiProviderContextProps['get']>(async url => {
    const response = await fetch(url, { method: 'GET', headers });
    return await response.json();
  });

  const post = useBound<ApiProviderContextProps['post']>(async (url, data) => {
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data) });
    return await response.json();
  });

  const remove = useBound<ApiProviderContextProps['remove']>(async url => {
    const response = await fetch(url, { method: 'DELETE', headers });
    return await response.json();
  });

  const search = useBound<ApiProviderContextProps['search']>(async (url, request) => {
    const response = await fetch(url, { method: 'SEARCH', headers, body: JSON.stringify(request) });
    return await response.json();
  });

  const context = useMemo<ApiProviderContextProps>(() => ({
    isValid: true,
    get,
    post,
    remove,
    search,
  }), []);

  return (
    <ApiProviderContext.Provider value={context}>
      {children}
    </ApiProviderContext.Provider>);
});
