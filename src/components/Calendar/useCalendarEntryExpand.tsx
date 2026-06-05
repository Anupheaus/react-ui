import type { ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import type { PaperProps, PopoverProps } from '@mui/material';
import { Popover } from '@mui/material';
import { createComponent } from '../Component';
import { createStyles } from '../../theme';
import { useBound, useOnResize, useOnUnmount } from '../../hooks';

const MAX_OVERLAY_WIDTH = 360;
const CLOSE_DELAY_MS = 80;

const useStyles = createStyles(({ surface: { shadows } }) => ({
  overlayPaper: {
    ...shadows.light,
    border: '1px solid rgba(0 0 0 / 20%)',
    borderRadius: 8,
    padding: '1px 2px',
    boxSizing: 'border-box',
    // For entries wider than this, the per-entry minWidth (set inline) wins, which is intended.
    maxWidth: MAX_OVERLAY_WIDTH,
    maxHeight: '90vh',
    overflow: 'auto',
    pointerEvents: 'auto',
  },
}));

interface OverlayProps {
  anchor: HTMLElement;
  minWidth: number;
  minHeight: number;
  color: string;
  content: ReactNode;
  onMouseEnter(): void;
  onMouseLeave(): void;
}

const CalendarEntryExpandOverlay = createComponent('CalendarEntryExpandOverlay', ({
  anchor, minWidth, minHeight, color, content, onMouseEnter, onMouseLeave,
}: OverlayProps) => {
  const { css, useInlineStyle } = useStyles();
  const paperStyle = useInlineStyle(() => ({ minWidth, minHeight, backgroundColor: color }), [minWidth, minHeight, color]);
  const paperProps: PaperProps = { className: css.overlayPaper, style: paperStyle, onMouseEnter, onMouseLeave };
  const slotProps: PopoverProps['slotProps'] = { root: { style: { pointerEvents: 'none' } } };
  return (
    <Popover
      open
      anchorEl={anchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      hideBackdrop
      disableScrollLock
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      onClose={onMouseLeave}
      slotProps={slotProps}
      PaperProps={paperProps}
    >
      {content}
    </Popover>
  );
});

interface ExpandResult {
  target(element: HTMLElement | null): void;
  onMouseEnter(): void;
  onMouseLeave(): void;
  overlay: ReactNode;
}

export function useCalendarEntryExpand(content: ReactNode, color: string): ExpandResult {
  const elementRef = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [isHovered, setIsHovered] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const { width, height, target: sizeTarget } = useOnResize();

  const target = useBound((element: HTMLElement | null) => {
    elementRef.current = element;
    sizeTarget(element);
  });

  useLayoutEffect(() => {
    const el = elementRef.current;
    if (el == null) { setIsTruncated(false); return; }
    // +1 tolerance guards against sub-pixel rounding so we don't flag a fit as truncated.
    setIsTruncated(el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1);
  }, [width, height, content]);

  const open = useBound(() => {
    if (closeTimer.current != null) clearTimeout(closeTimer.current);
    setIsHovered(true);
  });
  const close = useBound(() => {
    if (closeTimer.current != null) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setIsHovered(false), CLOSE_DELAY_MS);
  });

  useOnUnmount(() => { if (closeTimer.current != null) clearTimeout(closeTimer.current); });

  const overlay = (isTruncated && isHovered && elementRef.current != null)
    ? (
      <CalendarEntryExpandOverlay
        anchor={elementRef.current}
        minWidth={width ?? 0}
        minHeight={height ?? 0}
        color={color}
        content={content}
        onMouseEnter={open}
        onMouseLeave={close}
      />
    )
    : null;

  return { target, onMouseEnter: open, onMouseLeave: close, overlay };
}
