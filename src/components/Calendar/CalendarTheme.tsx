import { Theme } from '../../providers/ThemeProvider';

export const CalendarTheme = Theme.createThemeFor('calendar', {
  styles: {
    monthViewCellDateFontSize: 14,
    monthViewCellDateFontWeight: 400,
    monthViewEventFontSize: 12,
    monthViewEventFontWeight: 400,
    monthViewDayNameFontSize: 14,
    monthViewDayNameFontWeight: 600,
    monthViewTodayBackgroundColor: '#e1f7ff',
  },
});