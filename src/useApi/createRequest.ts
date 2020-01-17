import { useEffect, useRef, MutableRefObject } from 'react';
import { CancellationToken } from 'anux-common';
import { CancelTokenSource } from 'axios';
import { useBound } from '../useBound';
import { useOnUnmount } from '../useOnUnmount';
import { useForceUpdate } from '../useForceUpdate';
import { makeRequest } from './makeRequest';
import { IUseApiResponse, IUseApiConfig, CancelRequest, ForceRequest } from './models';

interface IPromise<TResponse> {
  promise: Promise<TResponse>;
  resolve(data: TResponse): void;
  reject(error: Error): void;
}

function resetCancelToken(tokenRef: MutableRefObject<CancellationToken>): void {
  if (tokenRef.current) { tokenRef.current.dispose(); }
  tokenRef.current = CancellationToken.create();
}

function createNewPromise<TResponse>(thenDelegate: (data: TResponse) => void, catchDelegate: (error: Error) => void): IPromise<TResponse> {
  let resolve: IPromise<TResponse>['resolve'];
  let reject: IPromise<TResponse>['reject'];
  const promise = new Promise<TResponse>((res, rej) => { resolve = res; reject = rej; });
  promise
    .then(thenDelegate)
    .catch(catchDelegate);
  return {
    promise,
    resolve,
    reject,
  };
}

export function createRequest<TResponse>(config: IUseApiConfig): IUseApiResponse<TResponse> {
  let { apiConfig, catchDelegate, dependencies, exceptWhenDelegate, thenDelegate } = config;
  const forceUpdate = useForceUpdate();
  const forceRequest = useBound<ForceRequest>(() => { performRequest(); }); // needs to be inside a arrow function to prevent return value and it is not yet defined
  const previousDependencies = useRef(dependencies);
  const cancelTokenRef = useRef<CancellationToken>(config.cancelToken || CancellationToken.create());
  const cancelRequest = useBound<CancelRequest>(cancelTokenRef.current.cancel);
  const sourceRef = useRef<CancelTokenSource>(undefined);
  const dataRef = useRef(undefined);
  const errorRef = useRef(undefined);
  const promiseRef = useRef<IPromise<TResponse>>(undefined);
  const isFirstCallRef = useRef<boolean>(true);
  thenDelegate = thenDelegate || forceUpdate;
  catchDelegate = catchDelegate || forceUpdate;

  const onResponse = (data: any) => { dataRef.current = data; resetCancelToken(cancelTokenRef); promiseRef.current.resolve(data); };
  const onError = (error: Error) => { errorRef.current = error; resetCancelToken(cancelTokenRef); promiseRef.current.reject(error); };
  const onCancel = () => { resetCancelToken(cancelTokenRef); };

  if (!promiseRef.current) { promiseRef.current = createNewPromise<TResponse>(thenDelegate, catchDelegate); }

  // perform the actual request
  const performRequest = () => {
    if (exceptWhenDelegate(dependencies, previousDependencies)) { return; }
    if (sourceRef.current) { sourceRef.current.cancel('Data dependencies for current request have changed or a force requrest has been called.'); sourceRef.current = undefined; }
    if (cancelTokenRef.current.isCancelled) { resetCancelToken(cancelTokenRef); return; }
    if (!isFirstCallRef.current) { promiseRef.current = createNewPromise<TResponse>(thenDelegate, catchDelegate); }
    isFirstCallRef.current = false;
    makeRequest(apiConfig, cancelTokenRef, sourceRef, onResponse, onError, onCancel);
  };

  useEffect(performRequest, dependencies);

  useOnUnmount(() => cancelTokenRef.current.cancel('Component requesting data was unmounted.'));
  return { data: dataRef.current, error: errorRef.current, cancelRequest, forceRequest, promise: promiseRef.current.promise };
}
