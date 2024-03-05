export interface LocaleSettings {
  locale: string;
  currency: string;
  shortDateFormat?: string;
  longDateFormat?: string;
}

export interface FormatDateProps {
  type?: 'short' | 'long' | 'readable';
  includeTime?: boolean;
  format?: string;
}