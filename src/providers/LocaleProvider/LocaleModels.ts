export interface LocaleSettings {
  locale: string;
  currency: string;
  shortDateFormat?: string;
  longDateFormat?: string;
  timeFormat?: string;
}

export interface FormatDateProps {
  type?: 'short' | 'long' | 'readable';
  mode?: 'date' | 'time' | 'datetime';
  format?: string;
}