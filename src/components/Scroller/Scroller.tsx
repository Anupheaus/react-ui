import { ReactNode, Ref, useEffect, useRef, useState } from 'react';
import { UseActions, useBooleanState, useBound } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { is } from '@anupheaus/common';
import { useScrollbarStyles } from './ScrollbarStyles';

const useStyles = createStyles(({ transition }) => ({
  scroller: {
    display: 'flex',
    overflow: 'hidden',
    flex: 'auto',
    position: 'relative',
    maxHeight: '100%',
    maxWidth: '100%',
    flexDirection: 'inherit',
    gap: 'inherit',
  },
  scrollerContainer: {
    display: 'flex',
    flex: 'auto',
    position: 'relative',
    flexDirection: 'inherit',
    gap: 'inherit',

    '&.prevent-unrequired-growth': {
      height: 0,
    },
  },
  scrollerContent: {
    display: 'flex',
    position: 'relative',
    flex: 'auto',
    height: 'fit-content',
    flexDirection: 'inherit',
    gap: 'inherit',
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
    boxShadow: '0 0 8px 0 #000',
    pointerEvents: 'none',
    transitionProperty: 'opacity',
    ...transition,
    zIndex: 1000,
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
  isShadowVisible: {
    opacity: 1,
  }
}));

export interface ScrollerActions {
  scrollTo(scrollTo: number | 'bottom'): void;
}

export interface OnScrollEventData {
  left: number;
  top: number;
  element: HTMLDivElement;
}

interface Props {
  className?: string;
  containerClassName?: string;
  borderless?: boolean;
  disableShadows?: boolean;
  offsetTop?: number;
  scrollTo?: number | 'bottom';
  children: ReactNode;
  ref?: Ref<HTMLDivElement | null>;
  preventContentFromDeterminingHeight?: boolean;
  actions?: UseActions<ScrollerActions>;
  onScroll?(event: OnScrollEventData): void;
}

export const Scroller = createComponent('Scroller', ({
  className,
  containerClassName,
  disableShadows = false,
  scrollTo,
  children,
  ref,
  preventContentFromDeterminingHeight = false,
  actions,
  onScroll,
}: Props) => {
  const { css, join } = useStyles();
  const { css: scrollbarsCss } = useScrollbarStyles();
  const unsubscribeRef = useRef<() => void>();
  const lastScrollValuesRef = useRef<{ left?: number; top?: number; }>({});
  const scrollerElementRef = useRef<HTMLDivElement | null>(null);
  const scrollerContainerElementRef = useRef<HTMLDivElement | null>(null);
  const topElementRef = useRef<HTMLDivElement | null>(null);
  const leftElementRef = useRef<HTMLDivElement | null>(null);
  const bottomElementRef = useRef<HTMLDivElement | null>(null);
  const rightElementRef = useRef<HTMLDivElement | null>(null);
  const [isScrollbarVisible, setScrollbarVisible, setScrolbarInvisible] = useBooleanState();
  const [shadowAtTop, setShadowAtTop] = useState(false);
  const [shadowOnLeft, setShadowOnLeft] = useState(false);
  const [shadowAtBottom, setShadowAtBottom] = useState(false);
  const [shadowOnRight, setShadowOnRight] = useState(false);

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
      if (is.function(onScroll)) {
        const eventHandler = () => {
          const left = element.scrollLeft;
          const top = element.scrollTop;
          if (lastScrollValuesRef.current.left === left && lastScrollValuesRef.current.top === top) return;
          const data = lastScrollValuesRef.current = { left, top };
          onScroll?.({ ...data, element });
        };
        element.addEventListener('scroll', eventHandler);
        unsubscribeRef.current = () => element.removeEventListener('scroll', eventHandler);
        onScroll({ left: element.scrollLeft, top: element.scrollTop, element });
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

  return (
    <Tag name="scroller" ref={scrollerElementRef} className={css.scroller} onMouseOver={setScrollbarVisible} onMouseLeave={setScrolbarInvisible}>
      <Tag
        name="scroller-container"
        ref={saveScrollerContainerElement}
        className={join(
          css.scrollerContainer,
          scrollbarsCss.scrollbars,
          isScrollbarVisible && 'is-scrollbar-visible',
          preventContentFromDeterminingHeight && 'prevent-unrequired-growth',
          containerClassName,
        )}
      >
        <Tag name="scroller-content" className={join(css.scrollerContent, className)}>
          <Tag name="scroller-content-top" ref={topElementRef} className={join(css.scrollerContentEdge, css.scrollerContentTop)} />
          <Tag name="scroller-content-left" ref={leftElementRef} className={join(css.scrollerContentEdge, css.scrollerContentLeft)} />
          <Tag name="scroller-content-bottom" ref={bottomElementRef} className={join(css.scrollerContentEdge, css.scrollerContentBottom)} />
          <Tag name="scroller-content-right" ref={rightElementRef} className={join(css.scrollerContentEdge, css.scrollerContentRight)} />
          {children}
        </Tag>
      </Tag>
      {!disableShadows && (<>
        <Tag name="scroller-shadow-top" className={join(css.scrollerShadow, css.scrollerShadowTop, shadowAtTop && css.isShadowVisible)} />
        <Tag name="scroller-shadow-left" className={join(css.scrollerShadow, css.scrollerShadowLeft, shadowOnLeft && css.isShadowVisible)} />
        <Tag name="scroller-shadow-right" className={join(css.scrollerShadow, css.scrollerShadowRight, shadowOnRight && css.isShadowVisible)} />
        <Tag name="scroller-shadow-bottom" className={join(css.scrollerShadow, css.scrollerShadowBottom, shadowAtBottom && css.isShadowVisible)} />
      </>)}
    </Tag>
  );
});
