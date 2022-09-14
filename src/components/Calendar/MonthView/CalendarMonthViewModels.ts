import { CalendarEntryRecord } from '../CalendarModels';

export interface CalendarMonthEntryRecord {
  renderedOnRow: number;
  entry: CalendarEntryRecord;
}