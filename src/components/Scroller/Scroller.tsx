import type { CSSProperties, ReactNode, Ref } from 'react';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { UseActions } from '../../hooks';
import { useBooleanState, useBound } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { is } from '@anupheaus/common';
import { useScrollbarStyles } from './ScrollbarStyles';
import { ScrollContext, getScrollContextValueFromElement } from './ScrollContext';

const useStyles = createStyles(({ shadows: { scroll: shadow } }, { applyTransition }) => ({
  scroller: {
    display: 'flex',
    overflow: 'hidden',
    flex: 'auto',
    position: 'relative',
    maxHeight: '100%',
    maxWidth: '100%',
    flexDirection: 'inherit',
  },
  scrollerContainer: {
    display: 'flex',
    flex: 'auto',
    position: 'relative',
    flexDirection: 'inherit',

    '&.keep-height-to-content': {
      height: 'fit-content',
    },
  },
  scrollerContent: {
    display: 'flex',
    position: 'relative',
    flex: 'auto',
    height: 'fit-content',
    // minHeight: '100%',
    width: 'fit-content',
    // minWidth: '100%',
    flexDirection: 'inherit',
    gap: 'var(--gap)',

    '&.min-full-height': {
      minHeight: '100%',
    },
  },
  scrollerContentEdge: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  scrollerContentTop: {
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  scrollerContentLeft: {
    top: 0,
    left: 0,
    bottom: 0,
    width: 1,
  },
  scrollerContentBottom: {
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
  },
  scrollerContentRight: {
    top: 0,
    right: 0,
    bottom: 0,
    width: 1,
  },
  scrollerShadow: {
    position: 'absolute',
    opacity: 0,
    boxShadow: shadow(false),
    pointerEvents: 'none',
    ...applyTransition('opacity'),
    zIndex: 1000,

    '&.is-visible': {
      opacity: '1',
    },
  },
  scrollerShadowTop: {
    top: -2,
    left: -2,
    right: -2,
    height: 2,
  },
  scrollerShadowBottom: {
    bottom: -2,
    left: -2,
    right: -2,
    height: 2,

  },
  scrollerShadowLeft: {
    top: -2,
    left: -2,
    bottom: -2,
    width: 2,
  },
  scrollerShadowRight: {
    top: -2,
    right: -2,
    bottom: -2,
    width: 2,
  },
}));

export interface ScrollerActions {
  scrollTo(scrollTo: number | 'bottom'): void;
}

export interface OnScrollEventData {
  left: number;
  top: number;
  element: HTMLDivElement;
}

export interface OnShadowVisibleChangeEvent {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
}

interface Props {
  className?: string;
  containerClassName?: string;
  borderless?: boolean;
  disableShadows?: boolean;
  offsetTop?: number;
  scrollTo?: number | 'bottom';
  children: ReactNode;
  /** Rendered inside the scroll container above the scroller-content (e.g. sticky header). Scrollbar runs alongside it. */
  headerContent?: ReactNode;
  /** Rendered inside the scroller element after the scroll container (e.g. custom footer/shadow). */
  footerContent?: ReactNode;
  /** When true, do not provide scroll context; consume parent ScrollContextProvider and report scroll to it. */
  useParentContext?: boolean;
  ref?: Ref<HTMLDivElement | null>;
  fullHeight?: boolean;
  style?: CSSProperties;
  actions?: UseActions<ScrollerActions>;
  onScroll?(event: OnScrollEventData): void;
  onShadowVisibilityChange?(event: OnShadowVisibleChangeEvent): void;
}

export const Scroller = createComponent('Scroller', ({
  className,
  containerClassName,
  disableShadows = false,
  scrollTo,
  children,
  headerContent,
  footerContent,
  useParentContext = false,
  ref,
  fullHeight = false,
  style,
  actions,
  onScroll,
  onShadowVisibilityChange,
}: Props) => {
  const { css, join } = useStyles();
  const { css: scrollbarsCss } = useScrollbarStyles();
  const parentScrollContext = useContext(ScrollContext);
  const unsubscribeRef = useRef<() => void>();
  const lastScrollValuesRef = useRef<{ left?: number; top?: number; }>({});
  const scrollerElementRef = useRef<HTMLDivElement | null>(null);
  const scrollerContainerElementRef = useRef<HTMLDivElement | null>(null);
  const topElementRef = useRef<HTMLDivElement | null>(null);
  const leftElementRef = useRef<HTMLDivElement | null>(null);
  const bottomElementRef = useRef<HTMLDivElement | null>(null);
  const rightElementRef = useRef<HTMLDivElement | null>(null);
  const [scrollContextValue, setScrollContextValue] = useState({ scrollTop: 0, scrollLeft: 0, scrollRight: 0, scrollBottom: 0 });
  const [isScrollbarVisible, setScrollbarVisible, setScrolbarInvisible] = useBooleanState();
  const [shadowAtTop, setShadowAtTop] = useState(false);
  const [shadowOnLeft, setShadowOnLeft] = useState(false);
  const [shadowAtBottom, setShadowAtBottom] = useState(false);
  const [shadowOnRight, setShadowOnRight] = useState(false);
  const isRenderingRef = useRef(true);
  isRenderingRef.current = true;

  useEffect(() => {
    isRenderingRef.current = false;
  });

  const scrollToFunc = (value: number | 'bottom' | undefined): void => {
    const element = scrollerContainerElementRef.current;
    if (element == null || value == null) return;
    element.scrollTo({ top: value === 'bottom' ? element.scrollHeight + 500 : value, behavior: 'smooth' });
  };

  actions?.({
    scrollTo: scrollToFunc,
  });

  const saveScrollerContainerElement = useBound((element: HTMLDivElement | null) => {
    if (ref != null) { if (is.function(ref)) ref(element); else (ref as any).current = element; }
    scrollerContainerElementRef.current = element;
    unsubscribeRef.current?.();
    if (element != null) {
      const notifyScroll = () => {
        const left = element.scrollLeft;
        const top = element.scrollTop;
        if (lastScrollValuesRef.current.left === left && lastScrollValuesRef.current.top === top) return;
        lastScrollValuesRef.current = { left, top };
        const scrollValue = getScrollContextValueFromElement(element);
        let reportScroll = () => void 0 as void;
        // Flush scroll context updates synchronously so StickyHideHeader (and other consumers) re-render in the same tick, reducing perceived lag.
        if (useParentContext && parentScrollContext?.reportScroll) {
          reportScroll = () => parentScrollContext.reportScroll!(scrollValue);
        } else if (!useParentContext) {
          reportScroll = () => setScrollContextValue(scrollValue);
        }
        if (isRenderingRef.current) reportScroll(); else flushSync(reportScroll);

        onScroll?.({ left, top, element });
      };
      if (is.function(onScroll) || !useParentContext || parentScrollContext?.reportScroll) {
        element.addEventListener('scroll', notifyScroll);
        unsubscribeRef.current = () => element.removeEventListener('scroll', notifyScroll);
        notifyScroll();
      }
    }
  });

  useEffect(() => {
    if (scrollerElementRef.current == null) return;
    const intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === topElementRef.current) setShadowAtTop(!entry.isIntersecting);
        if (entry.target === leftElementRef.current) setShadowOnLeft(!entry.isIntersecting);
        if (entry.target === bottomElementRef.current) setShadowAtBottom(!entry.isIntersecting);
        if (entry.target === rightElementRef.current) setShadowOnRight(!entry.isIntersecting);
      });
    }, {
      root: scrollerElementRef.current,
      threshold: 0,
    });
    if (topElementRef.current != null) intersectionObserver.observe(topElementRef.current);
    if (leftElementRef.current != null) intersectionObserver.observe(leftElementRef.current);
    if (rightElementRef.current != null) intersectionObserver.observe(rightElementRef.current);
    if (bottomElementRef.current != null) intersectionObserver.observe(bottomElementRef.current);

    return () => intersectionObserver.disconnect();
  }, []);

  useEffect(() => {
    scrollToFunc(scrollTo);
  }, [scrollTo, scrollerContainerElementRef.current]);

  useLayoutEffect(() => onShadowVisibilityChange?.({ top: shadowAtTop, left: shadowOnLeft, bottom: shadowAtBottom, right: shadowOnRight }),
    [shadowAtTop, shadowOnLeft, shadowAtBottom, shadowOnRight, onShadowVisibilityChange]);

  const content = (
    <Tag name="scroller" ref={scrollerElementRef} className={css.scroller} onMouseOver={setScrollbarVisible} onMouseLeave={setScrolbarInvisible}>
      <Tag
        name="scroller-container"
        ref={saveScrollerContainerElement}
        className={join(
          css.scrollerContainer,
          scrollbarsCss.scrollbars,
          isScrollbarVisible && 'is-scrollbar-visible',
          !fullHeight && 'keep-height-to-content',
          containerClassName,
        )}
      >
        {headerContent}
        <Tag name="scroller-content" className={join(css.scrollerContent, fullHeight && 'min-full-height', className)} style={style}>
          <Tag name="scroller-content-top" ref={topElementRef} className={join(css.scrollerContentEdge, css.scrollerContentTop)} />
          <Tag name="scroller-content-left" ref={leftElementRef} className={join(css.scrollerContentEdge, css.scrollerContentLeft)} />
          <Tag name="scroller-content-bottom" ref={bottomElementRef} className={join(css.scrollerContentEdge, css.scrollerContentBottom)} />
          <Tag name="scroller-content-right" ref={rightElementRef} className={join(css.scrollerContentEdge, css.scrollerContentRight)} />
          {children}
        </Tag>
      </Tag>
      {!disableShadows && (<>
        <Tag name="scroller-shadow-top" className={join(css.scrollerShadow, css.scrollerShadowTop, shadowAtTop && 'is-visible')} />
        <Tag name="scroller-shadow-left" className={join(css.scrollerShadow, css.scrollerShadowLeft, shadowOnLeft && 'is-visible')} />
        <Tag name="scroller-shadow-right" className={join(css.scrollerShadow, css.scrollerShadowRight, shadowOnRight && 'is-visible')} />
        <Tag name="scroller-shadow-bottom" className={join(css.scrollerShadow, css.scrollerShadowBottom, shadowAtBottom && 'is-visible')} />
      </>)}
      {footerContent}
    </Tag>
  );
  if (useParentContext) return content;
  return (
    <ScrollContext.Provider value={scrollContextValue}>
      {content}
    </ScrollContext.Provider>
  );
});
