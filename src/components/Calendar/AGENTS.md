# Calendar

A full-page calendar component with month and day views. It renders a list of `CalendarEntryRecord` items and supports entry selection. The month view shows a traditional grid; the day view shows a timed schedule for a single day.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `view` | `'month' \| 'day'` | No | Which view to render (default: `'month'`). |
| `viewingDate` | `Date` | No | The date the calendar is currently showing (default: today). |
| `entries` | `readonly CalendarEntryRecord[]` | No | Array of calendar entries to display. |
| `onSelect` | `(entry: CalendarEntryRecord) => void` | No | Called when the user selects an entry. |
| `label` | `ReactNode` | No | Optional label for the calendar. |
| `className` | `string` | No | CSS class applied to the root element. |

### Day-view-only props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `startHour` | `number` | No | First hour shown in the day view (0–23). |
| `endHour` | `number` | No | Last hour shown in the day view (0–23). |
| `hourHeight` | `number` | No | Pixel height of each hour row in the day view. |

## CalendarEntryRecord

```ts
interface CalendarEntryRecord {
  id: string;
  startDate: Date;
  endDate?: Date;
  isAllDay?: boolean;
  isBusy?: boolean;
  title?: ReactNode;          // omit or pass '' while loading; Typography shows a random-width skeleton
  description?: ReactNode;
  color?: string;           // hex/CSS colour used to tint the entry chip
  icon?: IconName;          // icon shown inside the entry chip
}
```

## Usage

```tsx
import { Calendar, CalendarEntryRecord } from '@anupheaus/react-ui';

const entries: CalendarEntryRecord[] = [
  {
    id: '1',
    title: 'Team Stand-up',
    startDate: new Date('2025-06-10T09:00:00'),
    endDate: new Date('2025-06-10T09:30:00'),
    color: '#9ADDFB',
    icon: 'calendar',
  },
];

function MyCalendar() {
  return (
    <Calendar
      entries={entries}
      viewingDate={new Date()}
      onSelect={entry => console.log('selected', entry)}
    />
  );
}

// Day view
function MyDayCalendar() {
  return (
    <Calendar
      view="day"
      viewingDate={new Date()}
      entries={entries}
      startHour={8}
      endHour={18}
      hourHeight={60}
    />
  );
}
```

## Architecture

`Calendar` wraps its content in two context providers — `CalendarEntrySelectionProvider` and `CalendarEntryHighlightProvider` — so that child views can coordinate hover/selection state without prop-drilling. The actual rendering is delegated to `CalendarMonthView` or `CalendarDayView` depending on the `view` prop.

## Decision rationale

**Two separate context providers for selection and highlight**

`CalendarEntrySelectionProvider` tracks which entry is selected (a persistent click-based state), while `CalendarEntryHighlightProvider` tracks which entry is hovered (transient pointer-based state). Keeping them separate prevents a hover on one entry from re-rendering every component subscribed to selection state. In the month view, each cell subscribes to highlight state for its own entries — if selection and highlight shared one context, hovering any entry would re-render every cell.

## Ambiguities and gotchas

- **`view` defaults to `'month'`** — omitting the `view` prop renders the month grid. Pass `view="day"` explicitly to get the hour-schedule view.
- **`viewingDate` defaults to today** — both views use `viewingDate` to determine which month/day to show. Updating `viewingDate` is the only way to navigate; there are no built-in prev/next controls.
- **Day-view-only props are silently ignored in month view** — `startHour`, `endHour`, and `hourHeight` are only read by `CalendarDayView`. Passing them when `view="month"` does nothing and produces no warning.

## Related

- [MonthView/AGENTS.md](./MonthView/AGENTS.md) — month grid view: 35-cell layout, `findFirstDateFor`, `createMonthEntries`, and the Monday-start/5-week-only caveats
- [DayView/AGENTS.md](./DayView/AGENTS.md) — day schedule view: hour grid, `getOffset`/`getHeight` pixel helpers, auto-expanding `startHour`/`endHour` range, and initial `scrollTo` behaviour

---

[← Back to Components](../AGENTS.md)
