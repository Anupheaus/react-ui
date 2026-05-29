import { DateTime } from 'luxon';
import { calendarDayViewLayout } from './CalendarDayViewLayout';
import type { CalendarEntryRecord } from '../CalendarModels';

function entry(id: string, start: string, end: string): CalendarEntryRecord {
  return {
    id,
    title: id,
    startDate: new Date(`${start}Z`),
    endDate: new Date(`${end}Z`),
  };
}

describe('layoutDayViewEntries', () => {
  it('places concurrent appointments side by side', () => {
    const layouts = calendarDayViewLayout.layoutDayViewEntries([
      entry('long', '2025-06-10T10:00:00', '2025-06-10T14:00:00'),
      entry('short', '2025-06-10T10:00:00', '2025-06-10T11:00:00'),
      entry('mid', '2025-06-10T11:00:00', '2025-06-10T12:30:00'),
      entry('afternoon', '2025-06-10T12:30:00', '2025-06-10T13:30:00'),
      entry('late', '2025-06-10T13:00:00', '2025-06-10T14:00:00'),
    ]);

    const segmentsById = layouts.reduce<Record<string, typeof layouts>>((result, layout) => {
      result[layout.entry.id] ??= [];
      result[layout.entry.id].push(layout);
      return result;
    }, {});

    expect(segmentsById.long).toEqual(expect.arrayContaining([
      expect.objectContaining({ leftPercent: 0, widthPercent: 50 }),
      expect.objectContaining({ leftPercent: 0, widthPercent: 50 }),
      expect.objectContaining({ leftPercent: 0, widthPercent: 33.33 }),
    ]));
    expect(segmentsById.short).toEqual([
      expect.objectContaining({ leftPercent: 50, widthPercent: 50 }),
    ]);
    expect(segmentsById.mid).toEqual([
      expect.objectContaining({ leftPercent: 50, widthPercent: 50 }),
    ]);
    expect(segmentsById.afternoon).toEqual([
      expect.objectContaining({ leftPercent: 50, widthPercent: 50 }),
      expect.objectContaining({ leftPercent: 33.33, widthPercent: 33.33 }),
    ]);
    expect(segmentsById.late).toEqual([
      expect.objectContaining({ leftPercent: 66.67, widthPercent: 33.33 }),
      expect.objectContaining({ leftPercent: 50, widthPercent: 50 }),
    ]);
  });

  it('expands a single appointment to full width', () => {
    const [layout] = calendarDayViewLayout.layoutDayViewEntries([
      entry('solo', '2025-06-10T09:00:00', '2025-06-10T10:00:00'),
    ]);

    expect(layout).toMatchObject({ leftPercent: 0, widthPercent: 100 });
  });

  it('does not treat back-to-back appointments as overlapping', () => {
    const layouts = calendarDayViewLayout.layoutDayViewEntries([
      entry('first', '2025-06-10T09:00:00', '2025-06-10T10:00:00'),
      entry('second', '2025-06-10T10:00:00', '2025-06-10T11:00:00'),
    ]);

    expect(layouts).toHaveLength(2);
    expect(layouts.every(layout => layout.widthPercent === 100)).toBe(true);
  });
});

describe('clipEntryToDay', () => {
  const startOfDay = DateTime.fromISO('2025-06-11T00:00:00').toJSDate();
  const endOfDay = DateTime.fromISO('2025-06-11T23:59:59.999').toJSDate();

  it('clips an overnight entry to the portion inside the day', () => {
    const clipped = calendarDayViewLayout.clipEntryToDay(
      {
        id: 'overnight',
        title: 'overnight',
        startDate: DateTime.fromISO('2025-06-10T23:00:00').toJSDate(),
        endDate: DateTime.fromISO('2025-06-11T00:30:00').toJSDate(),
      },
      startOfDay,
      endOfDay,
    );

    expect(clipped?.startDate.getTime()).toBe(startOfDay.getTime());
    expect(clipped?.endDate?.getTime()).toBe(DateTime.fromISO('2025-06-11T00:30:00').toJSDate().getTime());
  });

  it('returns null when the entry ends exactly at the start of the day', () => {
    const clipped = calendarDayViewLayout.clipEntryToDay(
      {
        id: 'ends-at-midnight',
        title: 'ends-at-midnight',
        startDate: DateTime.fromISO('2025-06-09T00:00:00').toJSDate(),
        endDate: DateTime.fromISO('2025-06-11T00:00:00').toJSDate(),
      },
      startOfDay,
      endOfDay,
    );

    expect(clipped).toBeNull();
  });
});
