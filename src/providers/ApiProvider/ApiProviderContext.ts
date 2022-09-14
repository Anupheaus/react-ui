import { AnyObject } from 'anux-common';
import { createContext } from 'react';
import { DataRequest, DataRequestResult } from '../../../common/data';

export interface ApiProviderContextProps {
  isValid: boolean;
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data?: AnyObject): Promise<T>;
  remove(url: string): Promise<void>;
  search<T extends {}>(url: string, request: DataRequest<T>): Promise<DataRequestResult<T>>;
}

export const ApiProviderContext = createContext<ApiProviderContextProps>({
  isValid: false,
  ...({} as any),
});
