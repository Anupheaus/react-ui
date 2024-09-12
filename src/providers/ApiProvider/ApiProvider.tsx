import type { MapOf } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import type { ReactNode } from 'react';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { createComponent } from '../../components/Component';
import { useStorage } from '../../hooks';
import { useBound } from '../../hooks/useBound';
import type { ApiProviderContextProps } from './ApiProviderContext';
import { ApiProviderContext } from './ApiProviderContext';

interface StatusCodeHandler {
  statusCode: number;
  callback(response: Response): void | boolean;
}

interface Props {
  children?: ReactNode;
  authToken?: string;
  tokenHeaderName?: string;
  headers?: MapOf<string>;
}

async function invokeApiCall<T>(delegate: () => Promise<Response>, tokenHeaderName: string, setToken: (token: string) => void, statusCodeHandlers: Map<string, StatusCodeHandler>): Promise<T> {
  const response = await delegate();
  if (response.headers.has(tokenHeaderName)) setToken(response.headers.get(tokenHeaderName) ?? '');
  for (const [, { statusCode, callback }] of statusCodeHandlers) {
    if (statusCode !== response.status) continue;
    const result = callback(response);
    if (result === true) return undefined as T;
  }
  if (response.status >= 200 && response.status < 300) {
    if (response.status === 204) return undefined as T; // no content
    return await response.json();
  }
  const body = await response.json();
  if (is.plainObject(body) && is.string(body.message)) throw new Error(body.message);
  throw new Error(`Unexpected response status: ${response.status}`);
}

export const ApiProvider = createComponent('ApiProvider', ({
  headers: providedHeaders,
  authToken: providedAuthToken,
  tokenHeaderName = 'Api-Token',
  children = null,
}: Props) => {
  const contextProvidedHeaders = useRef(new Map<string, string>()).current;
  providedAuthToken = providedAuthToken ?? providedHeaders?.authToken;
  const { state: authToken, setState: saveAuthToken } = useStorage('api.auth.token', { type: 'local', defaultValue: () => providedAuthToken });
  const statusCodeHandlers = useRef(new Map<string, StatusCodeHandler>()).current;

  const generateHeaders = useBound(() => ({
    'Content-Type': 'application/json',
    ...(is.not.empty(authToken) ? { [tokenHeaderName]: authToken, } : {}),
    ...providedHeaders,
    ...Object.fromEntries(contextProvidedHeaders),
  }));

  const get = useBound<ApiProviderContextProps['get']>(async url => invokeApiCall(() => fetch(url, {
    method: 'GET', headers: generateHeaders()
  }), tokenHeaderName, saveAuthToken, statusCodeHandlers));

  const post = useBound<ApiProviderContextProps['post']>(async (url, data) => invokeApiCall(() => fetch(url, {
    method: 'POST', headers: generateHeaders(), body: JSON.stringify(data),
  }), tokenHeaderName, saveAuthToken, statusCodeHandlers));

  const remove = useBound<ApiProviderContextProps['remove']>(async url => invokeApiCall(() => fetch(url, {
    method: 'DELETE', headers: generateHeaders(),
  }), tokenHeaderName, saveAuthToken, statusCodeHandlers));

  const query = useBound<ApiProviderContextProps['query']>(async (url, request) => invokeApiCall(() => fetch(url, {
    method: 'SEARCH', headers: generateHeaders(), body: JSON.stringify(request),
  }), tokenHeaderName, saveAuthToken, statusCodeHandlers));

  const addToHeaders = useBound<ApiProviderContextProps['addToHeaders']>((key, value) => contextProvidedHeaders.set(key, value));

  const removeFromHeaders = useBound<ApiProviderContextProps['removeFromHeaders']>(key => contextProvidedHeaders.delete(key));

  const getHeaders = useBound<ApiProviderContextProps['getHeaders']>(() => Object.fromEntries(contextProvidedHeaders));

  const registerStatusCodeHandler = useBound((id: string, statusCode: number, callback: ((response: Response) => void | boolean) | undefined) => {
    if (callback == null) { statusCodeHandlers.delete(id); } else { statusCodeHandlers.set(id, { statusCode, callback }); }
  });

  const context = useMemo<ApiProviderContextProps>(() => ({
    isValid: true,
    get,
    post,
    remove,
    query,
    addToHeaders,
    removeFromHeaders,
    getHeaders,
    setAuthToken: saveAuthToken,
    registerStatusCodeHandler,
  }), []);

  useLayoutEffect(() => {
    saveAuthToken(authToken);
  }, [authToken]);

  return (
    <ApiProviderContext.Provider value={context}>
      {children}
    </ApiProviderContext.Provider>);
});
