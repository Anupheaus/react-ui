import type { ReactNode } from 'react';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { createComponent } from '../Component';
import { createStyles } from '../../theme';
import type { FlexProps } from '../Flex';
import { Flex } from '../Flex';
import { useScroller } from '../Scroller/useScroller';
import { useOnResize } from '../../hooks';

const useStyles = createStyles(({ windows: { content: { active: { backgroundColor } } }, shadows: { light } }) => ({
  stickyHideHeader: {
    minHeight: 0,
    position: 'sticky' as const,
    top: 0,
    zIndex: 2,
    overflow: 'hidden',
  },
  stickyHideHeaderContent: {
    padding: 8,
    backgroundColor,
    backdropFilter: 'brightness(0) invert(1)', // Makes it so that anything underneath the header is invisible even when the header is using alpha colours
    overflow: 'hidden',
  },
  stickyHideHeaderShadow: {
    position: 'absolute',
    bottom: -shadowHeight,
    left: -(shadowHeight * 2),
    right: -(shadowHeight * 2),
    height: shadowHeight * 2,
    boxShadow: light(true),
  },
}));

export interface StickyHideHeaderProps extends Pick<FlexProps, 'gap' | 'align'> {
  /** Header content (e.g. action buttons). Actual height is measured via resize observer. */
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Called when the measured height of the header changes (e.g. so parent can adjust padding). */
  onHeightChange?(height: number): void;
}

/** Extra px to translate when fully hidden so the shadow is fully off-screen (max translation = totalHeight + this). */
const shadowHeight = 10;

/**
 * A header bar that slides up and out of view as the user scrolls down, and slides back in as they scroll up.
 * Uses scroll delta so the bar can reappear when scrolling up from anywhere (e.g. halfway down the list),
 * not only when near the top.
 */
export const StickyHideHeader = createComponent('StickyHideHeader', ({
  children,
  className,
  contentClassName,
  onHeightChange,
  gap = 'fields',
  ...props
}: StickyHideHeaderProps) => {
  const { css, join, useInlineStyle } = useStyles();
  const { height: measuredHeight, target: resizeTarget } = useOnResize({ observeHeightOnly: true });
  const { totalHeight, maxTranslate } = useMemo(() => {
    const total = measuredHeight ?? 0;
    return { totalHeight: total, maxTranslate: total + shadowHeight };
  }, [measuredHeight]);

  const { scrollTop } = useScroller();
  const prevScrollTopRef = useRef(scrollTop);
  const revealAmountRef = useRef(0);
  const hasScrolledPastHeightRef = useRef(false);

  const prev = prevScrollTopRef.current;
  if (scrollTop > maxTranslate) hasScrolledPastHeightRef.current = true;
  if (scrollTop <= 0) hasScrolledPastHeightRef.current = false;

  useLayoutEffect(() => {
    if (measuredHeight != null) onHeightChange?.(measuredHeight);
  }, [measuredHeight, onHeightChange]);

  let effectiveOffset: number;
  if (scrollTop <= 0) {
    revealAmountRef.current = maxTranslate;
    effectiveOffset = 0;
  } else if (scrollTop <= maxTranslate && !hasScrolledPastHeightRef.current) {
    // Initial scroll down: translate 1:1 so header slides up; at scrollTop === maxTranslate we translate by maxTranslate (height + extra)
    revealAmountRef.current = 0;
    effectiveOffset = scrollTop;
  } else {
    // Past maxTranslate, or scrolled up from past: use reveal amount (capped to maxTranslate)
    if (scrollTop < prev) {
      revealAmountRef.current = Math.min(maxTranslate, revealAmountRef.current + (prev - scrollTop));
    } else if (scrollTop > prev) {
      revealAmountRef.current = Math.max(0, revealAmountRef.current - (scrollTop - prev));
    }
    effectiveOffset = maxTranslate - revealAmountRef.current;
  }
  prevScrollTopRef.current = scrollTop;

  const translateY = -effectiveOffset;

  // Keep fixed height so scroll container height does not change on scroll (avoids flicker).
  // totalHeight includes shadow so the header slides out far enough to hide the shadow.
  const style = useInlineStyle(() => ({
    height: totalHeight + shadowHeight,
    transform: `translateY(${translateY}px)`,
    marginBottom: -totalHeight - shadowHeight,
  }), [totalHeight, translateY]);

  return (
    <Flex
      tagName="sticky-hide-header"
      className={join(css.stickyHideHeader, className)}
      style={style}
      isVertical
      disableGrow
      disableShrink
    >
      <Flex  {...props} tagName="sticky-hide-header-content" ref={resizeTarget} className={join(css.stickyHideHeaderContent, contentClassName)} disableGrow disableShrink gap={gap} valign="top">
        {children}
      </Flex>
      <Flex tagName="sticky-hide-header-shadow" className={css.stickyHideHeaderShadow} disableGrow disableShrink />
    </Flex>
  );
});
