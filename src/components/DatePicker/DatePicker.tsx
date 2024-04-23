
import { ComponentProps, ReactNode, useMemo } from 'react';
import { DatePicker as MuiDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Field, FieldProps } from '../Field';
import { useBooleanState, useBound } from '../../hooks';
import { DateTime } from 'luxon';
import { Icon } from '../Icon';
import { Button } from '../Button';

const useStyles = createStyles(({ datePicker, windows: { window: { active: activeWindow }, content: { active: activeWindowContent } },
  buttons: { default: { active: activeButton } }, pseudoClasses,
}, { makeImportant }) => ({
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
        padding: '1px 0 0',
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
  muiDatePickerButton: {
    display: 'none',
  },
  muiInputAdornment: {
    margin: 0,
  },
  muiDatePickerDialog: {
    backgroundColor: datePicker?.popup?.content?.backgroundColor ?? activeWindowContent.backgroundColor,
    color: datePicker?.popup?.content?.textColor ?? activeWindowContent.textColor,
    borderRadius: datePicker?.popup?.content?.borderRadius ?? activeWindow.borderRadius,
    boxShadow: datePicker?.popup?.content?.shadow ?? activeWindow.shadow,
  },
  muiDatePickerDialogHeader: {
    padding: '12px 12px 4px 24px',
    margin: 0,
    maxHeight: 'unset',
    borderRadius: datePicker?.popup?.content?.borderRadius ?? activeWindow.borderRadius,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: datePicker?.popup?.header?.backgroundColor ?? activeWindow.backgroundColor,
    color: datePicker?.popup?.header?.textColor ?? activeWindowContent.textColor,
    boxShadow: datePicker?.popup?.header?.shadow ?? activeWindow.shadow,
  },
  muiDatePickerDialogSelectedDay: {
    backgroundColor: makeImportant(datePicker?.popup?.days?.selected?.backgroundColor ?? activeButton.backgroundColor),
    [pseudoClasses.active]: {
      backgroundColor: makeImportant(datePicker?.popup?.days?.hover?.backgroundColor ?? activeButton.backgroundColor),
    },
  },
  MuiDatePickerDialogDay: {
    backgroundColor: 'transparent!important',
    [pseudoClasses.active]: {
      backgroundColor: makeImportant(datePicker?.popup?.days?.hover?.backgroundColor ?? activeButton.backgroundColor),
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
  minWidth?: string | number;
  value?: string | Date | DateTime;
  onDialogClosed?(): void;
};

export const DatePicker = createComponent('DateTime', ({
  className,
  value: rawValue,
  minWidth = 110,
  minDate,
  maxDate,
  onChange,
  format,
  ...props
}: Props) => {
  const { css } = useStyles();
  const [isPickerOpen, openPicker, closePicker] = useBooleanState();

  const value = useMemo(() => typeof (rawValue) === 'string'
    ? DateTime.fromISO(rawValue)
    : (DateTime.isDateTime(rawValue)
      ? rawValue
      : (rawValue instanceof Date
        ? DateTime.fromJSDate(rawValue)
        : undefined)), [rawValue]);
  const handleChange = useBound((newValue: DateTime | null) => onChange?.(newValue as DateTime));

  const slotProps = useMemo<ComponentProps<typeof MuiDatePicker>['slotProps']>(() => ({
    openPickerButton: {
      classes: {
        root: css.muiDatePickerButton,
      }
    },
    inputAdornment: {
      classes: {
        root: css.muiInputAdornment,
      },
    },
    desktopPaper: {
      classes: {
        root: css.muiDatePickerDialog,
      }
    },
    calendarHeader: {
      classes: {
        root: css.muiDatePickerDialogHeader,
      },
    },
    day: {
      classes: {
        root: css.MuiDatePickerDialogDay,
        selected: css.muiDatePickerDialogSelectedDay,
      },
    },
  }), []);

  return (
    <Field
      {...props}
      tagName='date-picker'
      className={className}
      contentClassName={css.fieldContent}
      minWidth={minWidth}
      endAdornments={(
        <Button onSelect={openPicker}><Icon name='calendar' /></Button>
      )}
    >
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={'en-gb'}>
        <MuiDatePicker
          value={value}
          onChange={handleChange}
          className={css.muiDatePicker}
          format={format}
          slotProps={slotProps}
          open={isPickerOpen}
          minDate={minDate}
          maxDate={maxDate}
          onClose={closePicker}
        />
        {/* <Icon name='calendar' /> */}
      </LocalizationProvider>
    </Field>
  );
});
