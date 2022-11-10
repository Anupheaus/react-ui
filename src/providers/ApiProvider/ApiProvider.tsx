import { ReactNode, useMemo } from 'react';
import { createComponent } from '../../components/Component';
import { useBound } from '../../hooks/useBound';
import { ApiProviderContext, ApiProviderContextProps } from './ApiProviderContext';

interface Props {
  children?: ReactNode;
}

export const ApiProvider = createComponent({
  id: 'ApiProvider',

  render({
    children = null,
  }: Props) {

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

    const query = useBound<ApiProviderContextProps['query']>(async (url, request) => {
      const response = await fetch(url, { method: 'SEARCH', headers, body: JSON.stringify(request) });
      return await response.json();
    });

    const context = useMemo<ApiProviderContextProps>(() => ({
      isValid: true,
      get,
      post,
      remove,
      query,
    }), []);

    return (
      <ApiProviderContext.Provider value={context}>
        {children}
      </ApiProviderContext.Provider>);
  },
});
