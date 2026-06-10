# Calendar

A full-page calendar component with month, week, and day views. It renders a list of `CalendarEntryRecord` items and supports entry selection. The month view shows a traditional grid; the week view shows a timed schedule across configurable weekdays; the day view shows a timed schedule for a single day.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `view` | `'month' \| 'week' \| 'day'` | No | Which view to render (default: `'month'`). |
| `viewingDate` | `Date` | No | The date the calendar is currently showing (default: today). |
| `entries` | `readonly CalendarEntryRecord[]` | No | **Static** entries to display (no live updates, no swipe). Provide EITHER `entries` OR `onEntries`. |
| `onEntries` | `(range: { from: Date; to: Date }, setEntries: (e) => void) => void` | No | **Reactive** entries provider. The calendar requests the date range it needs and the provider pushes entries back via `setEntries` (initially and on every live change). Enables the **swipe carousel** on touch devices. Provide EITHER `entries` OR `onEntries`. |
| `onSelect` | `(entry: CalendarEntryRecord) => void` | No | Called when the user selects an entry. |
| `label` | `ReactNode` | No | Label shown above the view. When omitted, the day view defaults it to the formatted viewing date. |
| `onViewingDateChange` | `(date: Date) => void` | No | Called when a **touch** swipe navigates to a new period — left = next, right = previous, stepped by `view` (day → ±1 day, week → ±1 week, month → ±1 month). Only active in `onEntries` mode on touch devices. The parent applies the new date back to `viewingDate`. |
| `className` | `string` | No | CSS class applied to the root element. |

### Week-view-only props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `weekDays` | `readonly CalendarWeekDay[]` | No | Weekdays to show as columns (default: Mon–Sun). |
| `startHour` | `number` | No | First hour shown in the week view (0–23). |
| `endHour` | `number` | No | Last hour shown in the week view (0–23). |
| `hourHeight` | `number` | No | Pixel height of each hour row in the week view. |

### Day-view-only props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `startHour` | `number` | No | First hour shown in the day view (0–23). |
| `endHour` | `number` | No | Last hour shown in the day view (0–23). |
| `hourHeight` | `number` | No | Pixel height of each hour row in the day view. |

## CalendarWeekDay

```ts
type CalendarWeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

const DEFAULT_CALENDAR_WEEK_DAYS: readonly CalendarWeekDay[] = [
  'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',
];
```

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

> No field changed for the expand-on-truncation behaviour below — `title` was already a `ReactNode`. Only the rendering/hover behaviour changed.

## Entry rendering and expand-on-truncation

Entries render their `title` as multi-line content clipped to the entry box. Day and week entries are sized by their duration (taller entries fit more lines); month entries are a fixed-height pill. Content that overflows the box is clipped.

When an entry's content is truncated (it doesn't fit the box), hovering the entry shows an in-place overlay anchored over it. The overlay starts at the entry's rendered width/height and grows to fit the full content, while being kept within the viewport (it is a MUI `Popover`). When the content fully fits, no overlay appears. This is automatic — there is no prop to enable it — and applies to the day, week, and month views.

The behaviour lives in `useCalendarEntryExpand.tsx`. It measures the rendered entry (`scrollHeight`/`scrollWidth` vs `clientHeight`/`clientWidth`, with a 1px tolerance) to decide whether content is truncated, and returns a `target` ref to attach to the entry, `onMouseEnter`/`onMouseLeave` handlers, and an `overlay` node to render. It is consumed by `CalendarDayViewEntries.tsx` (day and week views) and `CalendarMonthViewCellEntry.tsx` (month view).

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

// Week view (Mon–Sun by default)
function MyWeekCalendar() {
  return (
    <Calendar
      view="week"
      viewingDate={new Date()}
      entries={entries}
      startHour={8}
      endHour={18}
      onSelect={entry => console.log('selected', entry)}
    />
  );
}

// Week view with selected weekdays only
function MyWorkWeekCalendar() {
  return (
    <Calendar
      view="week"
      weekDays={['mon', 'tue', 'wed', 'thu', 'fri']}
      viewingDate={new Date()}
      entries={entries}
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

## Entries: static vs reactive (`onEntries`) + swipe carousel

Entries reach the calendar one of two mutually-exclusive ways:

- **`entries`** — a fixed list, rendered as-is. No live updates, no swipe. Used by static displays and Storybook stories.
- **`onEntries(range, setEntries)`** — the calendar declares the date range it needs (`calendarNavigation.getVisibleRange`) and the provider pushes entries back via `setEntries`. The provider should push the initial set and again whenever its live data changes, so the calendar stays reactive *without* re-passing a prop. `useCalendarEntries.ts` holds the pushed entries.

When `onEntries` is provided **and** the device is touch (`isTouchEnvironment`), the calendar renders a **3-panel swipe carousel** (`CalendarSwipeViewport.tsx`): previous / current / next period sit just off-screen and bleed in as you drag. The requested range widens to ±1 period so the neighbour panels have data; each view self-clips entries to its own period. Releasing past the threshold commits via `onViewingDateChange`; the track is re-centred on the new period in a `useLayoutEffect` (before paint) so there is no flicker. Horizontal moves `preventDefault` to suppress the browser's history (back/forward) swipe. On non-touch (or `entries` mode) a single static view renders.

## Architecture

`Calendar` wraps its content in two context providers — `CalendarEntrySelectionProvider` and `CalendarEntryHighlightProvider` — so that child views can coordinate hover/selection state without prop-drilling. A single period is rendered by `CalendarView` (the month/week/day switch); the carousel renders three `CalendarView`s in a track.

Grid lines and view shells (month grid border, week schedule frame, day/week hour dividers) resolve colour via `getCalendarGridLineColor` in `CalendarGridLineColor.ts` (`fields.content.normal.borderColor`, fallback `rgba(0 0 0 / 10%)`).

## Decision rationale

**Two separate context providers for selection and highlight**

`CalendarEntrySelectionProvider` tracks which entry is selected (a persistent click-based state), while `CalendarEntryHighlightProvider` tracks which entry is hovered (transient pointer-based state). Keeping them separate prevents a hover on one entry from re-rendering every component subscribed to selection state. In the month view, each cell subscribes to highlight state for its own entries — if selection and highlight shared one context, hovering any entry would re-render every cell.

## Ambiguities and gotchas

- **`view` defaults to `'month'`** — omitting the `view` prop renders the month grid. Pass `view="week"` or `view="day"` explicitly for schedule views.
- **`viewingDate` defaults to today** — all views use `viewingDate` to determine which month/week/day to show. Updating `viewingDate` is the only programmatic way to navigate; there are no prev/next buttons. In **`onEntries` mode on touch** devices, horizontal swipes navigate by `view` via `onViewingDateChange` (see the swipe carousel section + `CalendarSwipeViewport.tsx`); the parent must apply the emitted date to `viewingDate`. Swipe uses native non-passive listeners and `preventDefault`s horizontal moves to suppress the browser's back/forward history gesture (vertical scrolling is preserved). In `entries` mode (or non-touch) there is no swipe.
- **Week view uses Monday-start weeks** — the week containing `viewingDate` is resolved from Monday through Sunday unless `weekDays` limits the visible columns.
- **Schedule props are ignored in month view** — `weekDays`, `startHour`, `endHour`, and `hourHeight` are only read by the week and day views.

## Related

- [MonthView/AGENTS.md](./MonthView/AGENTS.md) — month grid view: 35-cell layout, `findFirstDateFor`, `createMonthEntries`, and the Monday-start/5-week-only caveats
- [WeekView/AGENTS.md](./WeekView/AGENTS.md) — week schedule view: configurable weekday columns and shared hour grid
- [DayView/AGENTS.md](./DayView/AGENTS.md) — day schedule view: hour grid, `getOffset`/`getHeight` pixel helpers, auto-expanding `startHour`/`endHour` range, and initial `scrollTo` behaviour

---

[← Back to Components](../AGENTS.md)
