
import { ReactNode, useMemo } from 'react';
import { DatePicker as MuiDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Field, FieldProps } from '../Field';
import { useBound } from '../../hooks';
import { DateTime } from 'luxon';
import { Icon } from '../Icon';

const useStyles = createStyles(() => ({
  fieldContent: {
    padding: '0 4px',
  },
  muiDatePicker: {
    outline: 'none',
    justifyContent: 'center',
    width: '100%',

    '&>div': {
      padding: 0,
      color: 'inherit',
      fontSize: 'unset',
      fontFamily: 'unset',
      fontWeight: 'unset',

      '&>input': {
        height: 'unset',
        padding: 0,
        color: 'inherit',
        fontSize: 'unset',
        fontFamily: 'unset',
        fontWeight: 'unset',
      },
      '&>fieldset': {
        border: 0,
      },
    },
  },
}));

export type DateTimeMode = 'date' | 'time' | 'datetime';

interface PropsAllowClear {
  allowClear: true;
  onChange?(value: DateTime | undefined): void;
}

interface PropsDisallowClear {
  allowClear?: false;
  onChange?(value: DateTime): void;
}

type PropsAllowDisallowClear = PropsAllowClear | PropsDisallowClear;

type Props = PropsAllowDisallowClear & FieldProps & {
  mode?: DateTimeMode;
  format?: string;
  endAdornment?: ReactNode;
  labelEndAdornment?: ReactNode;
  maxDate?: DateTime;
  minDate?: DateTime;
  value?: string | Date | DateTime;
  onDialogClosed?(): void;
};

export const DatePicker = createComponent('DateTime', ({
  className,
  value: rawValue,
  onChange,
  format,
  ...props
}: Props) => {
  const { css } = useStyles();
  const value = useMemo(() => typeof (rawValue) === 'string'
    ? DateTime.fromISO(rawValue)
    : (DateTime.isDateTime(rawValue)
      ? rawValue
      : (rawValue instanceof Date
        ? DateTime.fromJSDate(rawValue)
        : undefined)), [rawValue]);
  const handleChange = useBound((newValue: Date | null) => {
    const newDateTime = (newValue ?? undefined) as unknown as DateTime | undefined;
    onChange?.(newDateTime as DateTime);
  });

  return (
    <Field {...props} tagName='date-picker' className={className} contentClassName={css.fieldContent}>
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={'en-gb'}>
        <MuiDatePicker
          value={value as Date | undefined}
          onChange={handleChange}
          className={css.muiDatePicker}
          format={format}
        />
        <Icon name='calendar' />
      </LocalizationProvider>
    </Field>
  );
});
