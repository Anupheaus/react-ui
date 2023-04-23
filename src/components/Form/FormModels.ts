import { Record } from '@anupheaus/common';
import { ReactNode } from 'react';

export interface FormError extends Record {
  message: ReactNode;
}