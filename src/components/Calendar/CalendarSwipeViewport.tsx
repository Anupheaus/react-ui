import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { createStyles } from '../../theme';
import { useBound } from '../../hooks';
import { shiftViewingDate, type CalendarView } from './calendarNavigation';

const DIRECTION_LOCK_PX = 4;
const COMMIT_THRESHOLD_PX = 60;
const CENTRE = -100 / 3;  // % of the 300%-wide track — centres the middle of three panels
const NEXT = -200 / 3;    // % — next panel centred
const PREV = 0;           // % — previous panel centred
const ANIMATE = 'transform 220ms ease';

type Phase = 'next' | 'prev' | 'snap' | null;

const useStyles = createStyles({
  viewport: {
    position: 'relative',
    flex: 'auto',
    minWidth: 0,
    minHeight: 0,
    maxWidth: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
    display: 'flex',
  },
  track: {
    display: 'flex',
    flexDirection: 'row',
    width: '300%',
    height: '100%',
    willChange: 'transform',
  },
  panel: {
    flex: '0 0 33.3333%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
});

interface Props {
  view: CalendarView;
  viewingDate: Date;
  onViewingDateChange?(date: Date): void;
  renderPanel(date: Date): ReactNode;
}

/**
 * A swipeable 3-panel carousel (previous / current / next period). The neighbouring panels are
 * rendered just off-screen so they "bleed" in as you drag; releasing past the threshold commits
 * (via onViewingDateChange) and the track is re-centred on the new period before the next paint,
 * so there is no flicker. Horizontal moves preventDefault to suppress the browser history gesture.
 */
export const CalendarSwipeViewport = createComponent('CalendarSwipeViewport', ({
  view, viewingDate, onViewingDateChange, renderPanel,
}: Props) => {
  const { css } = useStyles();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [dragX, setDragX] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>(null);

  const panels = useMemo(() => [
    renderPanel(shiftViewingDate(view, viewingDate, -1)),
    renderPanel(viewingDate),
    renderPanel(shiftViewingDate(view, viewingDate, 1)),
  ], [view, viewingDate, renderPanel]);

  // Refs so the once-bound native listeners can read/guard against the latest state.
  const phaseRef = useRef<Phase>(phase);
  phaseRef.current = phase;

  useEffect(() => {
    const element = viewportRef.current;
    if (element == null) return;
    let startX = 0;
    let startY = 0;
    let decided = false;
    let horizontal = false;
    let active = false;

    const onTouchStart = (event: TouchEvent): void => {
      if (phaseRef.current != null) return; // ignore while a commit/snap animation is running
      const touch = event.touches[0];
      if (touch == null) return;
      startX = touch.clientX;
      startY = touch.clientY;
      decided = false;
      horizontal = false;
      active = true;
    };
    const onTouchMove = (event: TouchEvent): void => {
      if (!active) return;
      const touch = event.touches[0];
      if (touch == null) return;
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      if (!decided) {
        if (Math.abs(deltaX) < DIRECTION_LOCK_PX && Math.abs(deltaY) < DIRECTION_LOCK_PX) return;
        horizontal = Math.abs(deltaX) > Math.abs(deltaY);
        decided = true;
      }
      if (!horizontal) return;
      event.preventDefault(); // claim the gesture from the browser's back/forward history swipe
      setDragX(deltaX);
    };
    const onTouchEnd = (event: TouchEvent): void => {
      if (!active) return;
      active = false;
      if (!horizontal) { setDragX(null); return; }
      const touch = event.changedTouches[0];
      const deltaX = touch != null ? touch.clientX - startX : 0;
      setDragX(null);
      if (deltaX <= -COMMIT_THRESHOLD_PX) setPhase('next');
      else if (deltaX >= COMMIT_THRESHOLD_PX) setPhase('prev');
      else setPhase('snap');
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    element.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // When the committed animation finishes, navigate. The re-centre happens in the layout effect
  // below (tied to viewingDate) so the panel swap + reset are applied before the browser paints.
  const handleTransitionEnd = useBound(() => {
    if (phase === 'next' && onViewingDateChange != null) onViewingDateChange(shiftViewingDate(view, viewingDate, 1));
    else if (phase === 'prev' && onViewingDateChange != null) onViewingDateChange(shiftViewingDate(view, viewingDate, -1));
    else setPhase(null); // snap-back, or a commit with no handler
  });

  // Re-centre instantly whenever the date changes (including right after a commit) — runs before paint.
  useLayoutEffect(() => { setPhase(null); }, [viewingDate]);

  const trackStyle = useMemo<CSSProperties>(() => {
    if (dragX != null) return { transform: `translateX(calc(${CENTRE}% + ${dragX}px))`, transition: 'none' };
    if (phase === 'next') return { transform: `translateX(${NEXT}%)`, transition: ANIMATE };
    if (phase === 'prev') return { transform: `translateX(${PREV}%)`, transition: ANIMATE };
    if (phase === 'snap') return { transform: `translateX(${CENTRE}%)`, transition: ANIMATE };
    return { transform: `translateX(${CENTRE}%)`, transition: 'none' };
  }, [dragX, phase]);

  return (
    <Tag name="calendar-swipe-viewport" ref={viewportRef} className={css.viewport}>
      <div className={css.track} style={trackStyle} onTransitionEnd={handleTransitionEnd}>
        <div className={css.panel}>{panels[0]}</div>
        <div className={css.panel}>{panels[1]}</div>
        <div className={css.panel}>{panels[2]}</div>
      </div>
    </Tag>
  );
});
