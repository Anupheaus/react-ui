import { IUseApiWithExcept, IUseApiConfig, IUseApiResponseActions, IUseApiWithUseCancellationToken } from './models';
import { createRequest } from './createRequest';

function apiFactory(config: IUseApiConfig) {
  const result: IUseApiWithUseCancellationToken & IUseApiWithExcept<any> & IUseApiResponseActions<any> = {
    useCancellationToken: cancelToken => apiFactory({ ...config, cancelToken }),
    observe: dependencies => apiFactory({ ...config, dependencies }),
    exceptWhen: exceptWhenDelegate => apiFactory({ ...config, exceptWhenDelegate }),
    get: url => apiFactory({ ...config, apiConfig: { method: 'get', url } }),
    post: (url: string, data?: any) => apiFactory({ ...config, apiConfig: { method: 'post', url, data } }),
    patch: (url: string, data?: any) => apiFactory({ ...config, apiConfig: { method: 'patch', url, data } }),
    put: (url: string, data?: any) => apiFactory({ ...config, apiConfig: { method: 'put', url, data } }),
    delete: (url: string, data?: any) => apiFactory({ ...config, apiConfig: { method: 'delete', url, data } }),
    then: thenDelegate => apiFactory({ ...config, thenDelegate }),
    catch: catchDelegate => apiFactory({ ...config, catchDelegate }),
    end: undefined,
  };
  Object.defineProperty(result, 'end', {
    get: () => createRequest(config),
    enumerable: true,
    configurable: false,
  });
  return result;
}

export const useApi: IUseApiWithUseCancellationToken & IUseApiResponseActions<any> = apiFactory({});
