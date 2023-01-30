import { ReactNode } from 'react';
import { IconName } from '../Icon';

export interface CalendarEntryRecord {
  id: string;
  startDate: Date;
  endDate?: Date;
  isAllDay?: boolean;
  title: ReactNode;
  description?: ReactNode;
  color?: string;
  icon?: IconName;
}
