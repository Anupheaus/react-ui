import type { ReactNode } from 'react';
import type { IconName } from '../Icon';

export interface CalendarEntryRecord {
  id: string;
  startDate: Date;
  endDate?: Date;
  isAllDay?: boolean;
  isBusy?: boolean;
  title: ReactNode;
  description?: ReactNode;
  color?: string;
  icon?: IconName;
}
