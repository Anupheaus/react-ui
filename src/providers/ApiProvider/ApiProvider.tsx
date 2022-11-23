import { is } from '@anupheaus/common';
import { ReactNode, useMemo } from 'react';
import { createComponent } from '../../components/Component';
import { useBound } from '../../hooks/useBound';
import { ApiProviderContext, ApiProviderContextProps } from './ApiProviderContext';

interface Props {
  children?: ReactNode;
  headers?: Record<string, string>;
}

async function invokeApiCall<T>(delegate: () => Promise<Response>): Promise<T> {
  const response = await delegate();
  if (response.status >= 200 && response.status < 300) return await response.json();
  const body = await response.json();
  if (is.plainObject(body) && is.string(body.message)) throw new Error(body.message);
  throw new Error(`Unexpected response status: ${response.status}`);
}

export const ApiProvider = createComponent({
  id: 'ApiProvider',

  render({
    headers: providedHeaders,
    children = null,
  }: Props) {

    const headers = useMemo<RequestInit['headers']>(() => ({
      ...providedHeaders,
      'Content-Type': 'application/json',
    }), [providedHeaders]);

    const get = useBound<ApiProviderContextProps['get']>(async url => invokeApiCall(() => fetch(url, { method: 'GET', headers })));

    const post = useBound<ApiProviderContextProps['post']>(async (url, data) => invokeApiCall(() => fetch(url, { method: 'POST', headers, body: JSON.stringify(data) })));

    const remove = useBound<ApiProviderContextProps['remove']>(async url => invokeApiCall(() => fetch(url, { method: 'DELETE', headers })));

    const query = useBound<ApiProviderContextProps['query']>(async (url, request) => invokeApiCall(() => fetch(url, { method: 'SEARCH', headers, body: JSON.stringify(request) })));

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
