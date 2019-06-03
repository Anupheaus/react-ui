import { AxiosRequestConfig } from 'axios';
import { Omit, CancellationToken } from 'anux-common';

export type ForceRequest = () => void;
export type CancelRequest = (reason?: string) => void;
export type ExceptWhenDelegate<TDependencies extends ReadonlyArray<any>> = (dependencies: TDependencies, prevDependencies: TDependencies) => boolean;
export type ThenDelegate<TResponse> = (data: TResponse) => void;
export type CatchDelegate = (error: Error) => void;

export interface IUseApiConfig {
  cancelToken?: CancellationToken;
  dependencies?: ReadonlyArray<any>;
  exceptWhenDelegate?: ExceptWhenDelegate<any>;
  apiConfig?: AxiosRequestConfig;
  thenDelegate?: ThenDelegate<any>;
  catchDelegate?: CatchDelegate;
}

export interface IUseApiResponse<TResponse> {
  data: TResponse;
  error: Error;
  cancelRequest: CancelRequest;
  forceRequest: ForceRequest;
  promise: Promise<TResponse>;
}

export interface IUseApiResponseActions<TResponse> {
  end: IUseApiResponse<TResponse>;
  promise: Promise<TResponse>;
  then(delegate: ThenDelegate<TResponse>): Omit<IUseApiResponseActions<TResponse>, 'then'>;
  catch(delegate: CatchDelegate): Omit<IUseApiResponseActions<TResponse>, 'then' | 'catch'>;
}

export interface IUseApiMethods {
  get<TResponse>(url: string): IUseApiResponseActions<TResponse>;
  post<TResponse>(url: string): IUseApiResponseActions<TResponse>;
  post<TResponse>(url: string, data: any): IUseApiResponseActions<TResponse>;
  patch<TResponse>(url: string): IUseApiResponseActions<TResponse>;
  patch<TResponse>(url: string, data: any): IUseApiResponseActions<TResponse>;
  put<TResponse>(url: string): IUseApiResponseActions<TResponse>;
  put<TResponse>(url: string, data: any): IUseApiResponseActions<TResponse>;
  delete<TResponse>(url: string): IUseApiResponseActions<TResponse>;
  delete<TResponse>(url: string, data: any): IUseApiResponseActions<TResponse>;
}

export interface IUseApiWithUseCancellationToken extends IUseApiWithObserve {
  useCancellationToken(token: CancellationToken): IUseApiWithObserve;
}

export interface IUseApiWithObserve extends IUseApiMethods {
  observe<TNewDependencies extends ReadonlyArray<any>>(deps: TNewDependencies): IUseApiWithExcept<TNewDependencies>;
}

export interface IUseApiWithExcept<TDependencies extends ReadonlyArray<any>> extends IUseApiMethods {
  exceptWhen(exceptions: ExceptWhenDelegate<TDependencies>): IUseApiMethods;
}
