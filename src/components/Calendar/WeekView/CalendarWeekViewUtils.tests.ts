import { DateTime } from 'luxon';
import { CalendarWeekViewUtils } from './CalendarWeekViewUtils';

describe('CalendarWeekViewUtils', () => {
  describe('getWeekDayDates', () => {
    it('returns mon-sun for the week containing the viewing date', () => {
      const viewingDate = DateTime.fromISO('2025-06-11').toJSDate();
      const weekDayDates = CalendarWeekViewUtils.getWeekDayDates(viewingDate);

      expect(weekDayDates.map(({ day }) => day)).toEqual(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
      expect(weekDayDates.map(({ date }) => DateTime.fromJSDate(date).toISODate())).toEqual([
        '2025-06-09',
        '2025-06-10',
        '2025-06-11',
        '2025-06-12',
        '2025-06-13',
        '2025-06-14',
        '2025-06-15',
      ]);
    });

    it('returns only the requested weekdays', () => {
      const viewingDate = DateTime.fromISO('2025-06-11').toJSDate();
      const weekDayDates = CalendarWeekViewUtils.getWeekDayDates(viewingDate, ['mon', 'wed', 'fri']);

      expect(weekDayDates.map(({ day }) => day)).toEqual(['mon', 'wed', 'fri']);
      expect(weekDayDates.map(({ date }) => DateTime.fromJSDate(date).toISODate())).toEqual([
        '2025-06-09',
        '2025-06-11',
        '2025-06-13',
      ]);
    });

    it('falls back to mon-sun when weekDays is empty', () => {
      const viewingDate = DateTime.fromISO('2025-06-11').toJSDate();
      const weekDayDates = CalendarWeekViewUtils.getWeekDayDates(viewingDate, []);

      expect(weekDayDates).toHaveLength(7);
      expect(weekDayDates[0]?.day).toBe('mon');
      expect(weekDayDates[6]?.day).toBe('sun');
    });
  });
});
