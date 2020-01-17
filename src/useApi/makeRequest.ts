import api, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { MutableRefObject } from 'react';
import { CancellationToken } from 'anux-common';
import { ThenDelegate, CatchDelegate } from './models';

export function makeRequest<TResponse>(config: AxiosRequestConfig, cancelTokenRef: MutableRefObject<CancellationToken>, sourceRef: MutableRefObject<CancelTokenSource>,
  thenDelegate: ThenDelegate<TResponse>, catchDelegate: CatchDelegate, cancelDelegate: () => void) {
  const source = api.CancelToken.source();
  cancelTokenRef.current.onCancelled(source.cancel);
  sourceRef.current = source;
  config = {
    ...config,
    cancelToken: source.token,
  };
  api(config)
    .then(response => thenDelegate(response.data))
    .catch((e: Error) => {
      if (api.isCancel(e)) { cancelDelegate(); return; }
      catchDelegate(e);
    });
}
