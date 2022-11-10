import { AnyObject } from '@anupheaus/common';
import { ReactNode } from 'react';
import { AnuxError } from './AnuxError';

export interface ApiErrorProps {
  title?: ReactNode;
  message?: ReactNode;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'DELETE';
  body?: AnyObject;
  statusCode?: number;
}

export class ApiError extends AnuxError {
  constructor({ message, title, url, method, body, statusCode }: ApiErrorProps = {}) {
    super({ message: message ?? 'An API error has occurred.', title: title ?? 'API Error', isAsync: true, meta: { url, method, body, statusCode } });
  }
}
