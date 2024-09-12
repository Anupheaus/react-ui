import { useContext } from 'react';
import { LocaleContext } from './LocaleContext';
import { useBound } from '../../hooks';
import type { DateTimeFormatOptions } from 'luxon';
import { DateTime } from 'luxon';
import type { FormatDateProps } from './LocaleModels';
import { is } from '@anupheaus/common';

const isoDateRegex = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

export function useLocale() {
  const { settings } = useContext(LocaleContext);

  const isValidISODate = useBound((date: DateTime | Date | string | undefined): boolean => {
    if (date == null) return false;
    if (date instanceof DateTime) return date.isValid;
    if (date instanceof Date) return DateTime.fromJSDate(date).isValid;
    if (typeof date === 'string') return isoDateRegex.test(date);
    return false;
  });

  const toDate = useBound((date: DateTime | Date | string | undefined): DateTime | undefined => {
    if (date == null) return;
    if (DateTime.isDateTime(date)) return date;
    if (date instanceof Date) return DateTime.fromJSDate(date);
    if (typeof date === 'string' && isoDateRegex.test(date)) return DateTime.fromISO(date);
  });

  const formatDate = useBound((date: DateTime | Date | string | undefined, props?: FormatDateProps): string | undefined => {
    const luxonDate = toDate(date);
    if (luxonDate == null) return;
    if (is.not.empty(props?.format)) return luxonDate.toFormat(props.format);
    const type = props?.type ?? 'long';
    if (type === 'long' && settings.longDateFormat != null) return luxonDate.toFormat(settings.longDateFormat);
    if (type === 'short' && settings.shortDateFormat != null) return luxonDate.toFormat(settings.shortDateFormat);
    const options: DateTimeFormatOptions = {};
    if (props?.mode === 'date' || props?.mode === 'datetime') {
      switch (type) {
        case 'long':
          if (settings.longDateFormat) return luxonDate.toFormat(settings.longDateFormat);
          options.dateStyle = 'long';
          break;
        case 'short':
          if (settings.shortDateFormat) return luxonDate.toFormat(settings.shortDateFormat);
          options.dateStyle = 'short';
          break;
        case 'readable':
          options.day = 'numeric';
          options.month = 'long';
          options.year = 'numeric';
          break;
      }
    }
    if (props?.mode === 'time' || props?.mode === 'datetime') {
      if (settings.timeFormat) return luxonDate.toFormat(settings.timeFormat);
      switch (type) {
        case 'long':
          options.timeStyle = 'long';
          break;
        case 'short':
          options.timeStyle = 'short';
          break;
        case 'readable':
          options.hour12 = true;
          options.hour = '2-digit';
          options.minute = '2-digit';
          break;
      }
    }
    return luxonDate.toLocaleString(options);
  });

  const formatCurrency = useBound((value: number | undefined): string | undefined => {
    if (!is.number(value)) return;
    return Intl.NumberFormat([settings.locale], { style: 'currency', currency: settings.currency }).format(value);
  });

  const formatNumber = useBound((value: number | undefined, decimalPlaces = 0): string | undefined => {
    if (!is.number(value)) return;
    return Intl.NumberFormat([settings.locale], { style: 'decimal', maximumFractionDigits: decimalPlaces }).format(value);
  });

  const formatPercentage = useBound((value: number | undefined, decimalPlaces = 0): string | undefined => {
    if (!is.number(value)) return;
    return Intl.NumberFormat([settings.locale], { style: 'percent', maximumFractionDigits: decimalPlaces }).format(value);
  });

  return {
    isValidISODate,
    toDate,
    formatDate,
    formatCurrency,
    formatNumber,
    formatPercentage,
  };
}
