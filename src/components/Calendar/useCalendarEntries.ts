import { useEffect, useState } from 'react';
import type { CalendarEntryRecord } from './CalendarModels';

export type CalendarEntriesProvider = (
  range: { from: Date; to: Date },
  setEntries: (entries: readonly CalendarEntryRecord[]) => void,
) => void;

/**
 * Resolves the entries to render. Exactly one source is used:
 *  - `staticEntries` — a fixed list passed straight through (no live updates, no swipe);
 *  - `onEntries` — the calendar requests the `range` it needs and the provider pushes entries
 *    back via `setEntries` (initially and on every live change), keeping the calendar reactive.
 */
export function useCalendarEntries(
  range: { from: Date; to: Date } | null,
  onEntries: CalendarEntriesProvider | undefined,
  staticEntries: readonly CalendarEntryRecord[] | undefined,
): readonly CalendarEntryRecord[] {
  const [pushed, setPushed] = useState<readonly CalendarEntryRecord[]>([]);

  useEffect(() => {
    if (onEntries == null || range == null) return;
    onEntries(range, setPushed);
    // setPushed is stable (useState); re-request whenever the requested range or provider changes.
  }, [onEntries, range?.from?.getTime(), range?.to?.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps

  return onEntries != null ? pushed : (staticEntries ?? []);
}
