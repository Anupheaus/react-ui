import { AnyObject } from '@anupheaus/common';
import { createContext } from 'react';
import { DataRequest, DataResponse } from './ApiProviderModels';

export interface ApiProviderContextProps {
  isValid: boolean;
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data?: AnyObject): Promise<T>;
  remove(url: string): Promise<void>;
  search<T extends {}>(url: string, request: DataRequest<T>): Promise<DataResponse<T>>;
}

export const ApiProviderContext = createContext<ApiProviderContextProps>({
  isValid: false,
  ...({} as any),
});
