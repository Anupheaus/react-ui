
import type { ComponentProps, ReactNode} from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { DatePicker as MuiDatePicker, TimePicker as MuiTimePicker, DateTimePicker as MuiDateTimePicker, LocalizationProvider, renderTimeViewClock } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon/index.js';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { useBound } from '../../hooks';
import { DateTime } from 'luxon';
import { buildDatePickerAdornments } from './CalendarNavigationAdornments';

// Module-level singleton: holds the close function of whichever picker is currently open.
// When a new picker opens it calls this first, ensuring only one is ever visible.
let closeActivePicker: (() => void) | undefined;

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
  startAdornments?: ReactNode;
  endAdornment?: ReactNode;
  labelEndAdornment?: ReactNode;
  maxDate?: DateTime;
  minDate?: DateTime;
  minWidth?: string | number;
  value?: string | Date | DateTime;
  onDialogClosed?(): void;
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
};

export const DatePicker = createComponent('DateTime', ({
  className,
  value: rawValue,
  minWidth = 110,
  minDate,
  maxDate,
  onChange,
  format,
  mode = 'date',
  startAdornments,
  endAdornment,
  onNavigatePrevious,
  onNavigateNext,
  ...props
}: Props) => {
  const { css } = useStyles();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  // Stable ref so the close callback registered in the singleton is always current.
  const closeRef = useRef<() => void>(() => setIsPickerOpen(false));
  closeRef.current = () => setIsPickerOpen(false);

  // Deregister from the singleton when this instance unmounts while open.
  useEffect(() => () => {
    if (closeActivePicker === closeRef.current) closeActivePicker = undefined;
  }, []);

  const openPicker = useBound(() => {
    // Close whichever picker is currently open (may be a different instance).
    if (closeActivePicker && closeActivePicker !== closeRef.current) closeActivePicker();
    closeActivePicker = closeRef.current;
    setIsPickerOpen(true);
  });

  const closePicker = useBound(() => {
    if (closeActivePicker === closeRef.current) closeActivePicker = undefined;
    setIsPickerOpen(false);
  });

  const value = useMemo(() => typeof (rawValue) === 'string'
    ? DateTime.fromISO(rawValue)
    : (DateTime.isDateTime(rawValue)
      ? rawValue
      : (rawValue instanceof Date
        ? DateTime.fromJSDate(rawValue)
        : undefined)), [rawValue]);
  const handleChange = useBound((newValue: DateTime | null) => onChange?.(newValue as DateTime));

  const dateSlotProps = useMemo<ComponentProps<typeof MuiDatePicker>['slotProps']>(() => ({
    openPickerButton: { classes: { root: css.muiDatePickerButton } },
    inputAdornment: { classes: { root: css.muiInputAdornment } },
    desktopPaper: { classes: { root: css.muiDatePickerDialog } },
    calendarHeader: { classes: { root: css.muiDatePickerDialogHeader } },
    day: { classes: { root: css.MuiDatePickerDialogDay, selected: css.muiDatePickerDialogSelectedDay } },
  }), []);

  const timeSlotProps = useMemo<ComponentProps<typeof MuiTimePicker>['slotProps']>(() => ({
    openPickerButton: { classes: { root: css.muiDatePickerButton } },
    inputAdornment: { classes: { root: css.muiInputAdornment } },
    desktopPaper: { classes: { root: css.muiDatePickerDialog } },
  }), []);

  const { startAdornments: fieldStartAdornments, endAdornments: fieldEndAdornments } = useMemo(
    () => buildDatePickerAdornments({
      onNavigatePrevious,
      onNavigateNext,
      startAdornments,
      endAdornment,
      onOpenPicker: openPicker,
    }),
    [endAdornment, onNavigateNext, onNavigatePrevious, openPicker, startAdornments],
  );

  return (
    <Field
      {...props}
      tagName='date-picker'
      className={className}
      contentClassName={css.fieldContent}
      minWidth={minWidth}
      startAdornments={fieldStartAdornments}
      endAdornments={fieldEndAdornments}
    >
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={'en-gb'}>
        {mode === 'time' && (
          <MuiTimePicker
            value={value}
            onChange={handleChange}
            className={css.muiDatePicker}
            format={format}
            slotProps={timeSlotProps}
            open={isPickerOpen}
            onClose={closePicker}
            viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock, seconds: renderTimeViewClock }}
          />
        )}
        {mode === 'datetime' && (
          <MuiDateTimePicker
            value={value}
            onChange={handleChange}
            className={css.muiDatePicker}
            format={format}
            slotProps={dateSlotProps as ComponentProps<typeof MuiDateTimePicker>['slotProps']}
            open={isPickerOpen}
            minDate={minDate}
            maxDate={maxDate}
            onClose={closePicker}
          />
        )}
        {(mode === 'date' || mode == null) && (
          <MuiDatePicker
            value={value}
            onChange={handleChange}
            className={css.muiDatePicker}
            format={format}
            slotProps={dateSlotProps}
            open={isPickerOpen}
            minDate={minDate}
            maxDate={maxDate}
            onClose={closePicker}
          />
        )}
      </LocalizationProvider>
    </Field>
  );
});
