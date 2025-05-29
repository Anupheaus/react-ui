import type { CSSProperties } from 'react';
import { useMemo, useRef } from 'react';
import { createAnimationKeyFrame, createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { createPortal } from 'react-dom';
import { useTimeout } from '../../hooks';

const fadeOutKeyframes = createAnimationKeyFrame({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const useStyles = createStyles({
  fadingOut: {
    display: 'contents',
    '&>*': {
      animationName: fadeOutKeyframes,
      animationDuration: 'inherit',
      animationFillMode: 'forwards',
    },
  },
});

interface Props {
  id: string;
  element: HTMLElement;
  content: string;
  duration: number;
  onCompleted(id: string): void;
}

export const FadingOut = createComponent('FadingOut', ({
  id,
  element,
  content,
  duration,
  onCompleted,
}: Props) => {
  const { css } = useStyles();
  const elementRef = useRef<HTMLDivElement>(null);
  const startedAnimationRef = useRef<number>();

  const renderedContent = useMemo(() => ({
    __html: content,
  }), [content]);

  useTimeout(() => {
    onCompleted(id);
  }, duration, { dependencies: [duration], triggerOnUnmount: true });

  const style = useMemo<CSSProperties>(() => {
    startedAnimationRef.current = Date.now();
    return {
      animationDuration: `${duration}ms`,
    };
  }, [duration]);

  return createPortal(<Tag ref={elementRef} name="fading-out" data-fader-id={id} className={css.fadingOut} dangerouslySetInnerHTML={renderedContent} style={style} />, element);
});