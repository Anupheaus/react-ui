import { ReactNode, useEffect, useRef, useState } from 'react';
import { useBooleanState } from '../../hooks';
import { createStyles, TransitionTheme } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { ScrollerTheme } from './ScrollerTheme';

interface Props {
  className?: string;
  containerClassName?: string;
  borderless?: boolean;
  disableShadows?: boolean;
  offsetTop?: number;
  children: ReactNode;
}

const useStyles = createStyles(({ useTheme }, { offsetTop }: Props) => {
  const transitionSettings = useTheme(TransitionTheme);
  const { shadow, scrollbarColor, offsets, width } = useTheme(ScrollerTheme);
  return {
    styles: {
      scroller: {
        display: 'flex',
        overflow: 'hidden',
        flex: 'auto',
        position: 'relative',
        flexDirection: 'inherit',
      },
      scrollerContainer: {
        display: 'flex',
        overflow: 'overlay',
        flex: 'auto',
        position: 'relative',
        flexDirection: 'inherit',
        transitionProperty: 'background-color',
        ...transitionSettings,
        backgroundColor: 'rgba(0 0 0 / 0%)',
        backgroundClip: 'text',

        '&::-webkit-scrollbar': {
          width,
          height: width,
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-track-piece:vertical:start': {
          marginTop: offsetTop ?? offsets.top,
        },
        '&::-webkit-scrollbar-track-piece:vertical:corner-present:end': {
          marginBottom: offsets.bottom,
        },
        '&::-webkit-scrollbar-track-piece:horizontal:start': {
          marginLeft: offsets.left,
        },
        '&::-webkit-scrollbar-track-piece:horizontal:corner-present:end': {
          marginRight: offsets.right,
        },
        '&::-webkit-scrollbar-corner': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          minHeight: 40,
          borderRadius: 8,
          ...transitionSettings,
          backgroundColor: 'inherit',
          boxShadow: 'none',
          border: 'solid 4px transparent',
          backgroundClip: 'padding-box',
        },
      },
      scrollbarIsVisible: {
        backgroundColor: scrollbarColor,
      },
      scrollerContent: {
        display: 'flex',
        position: 'relative',
        flex: 'auto',
        height: 'fit-content',
        flexDirection: 'inherit',
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
        boxShadow: shadow,
        pointerEvents: 'none',
        transitionProperty: 'opacity',
        ...transitionSettings,
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
    },
  };
});

export const Scroller = createComponent('Scroller', ({
  className,
  containerClassName,
  disableShadows = false,
  children,
}: Props) => {
  const { css, join } = useStyles();
  const scrollerElementRef = useRef<HTMLDivElement | null>(null);
  const topElementRef = useRef<HTMLDivElement | null>(null);
  const leftElementRef = useRef<HTMLDivElement | null>(null);
  const bottomElementRef = useRef<HTMLDivElement | null>(null);
  const rightElementRef = useRef<HTMLDivElement | null>(null);
  const [isScrollbarVisible, setScrollbarVisible, setScrolbarInvisible] = useBooleanState();
  const [shadowAtTop, setShadowAtTop] = useState(false);
  const [shadowOnLeft, setShadowOnLeft] = useState(false);
  const [shadowAtBottom, setShadowAtBottom] = useState(false);
  const [shadowOnRight, setShadowOnRight] = useState(false);

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

  return (
    <Tag name="scroller" ref={scrollerElementRef} className={css.scroller} onMouseOver={setScrollbarVisible} onMouseLeave={setScrolbarInvisible}>
      <Tag name="scroller-container" ref={scrollerElementRef} className={join(css.scrollerContainer, isScrollbarVisible && css.scrollbarIsVisible, containerClassName)}>
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
