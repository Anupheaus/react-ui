import { Record } from '@anupheaus/common';
import { ReactNode } from 'react';

export interface ValidationRecord extends Record {
  message: ReactNode;
}

export interface ValidationTools {
  validateRequired(value: any, isRequired: boolean, message?: ReactNode): ReactNode | void;
}
