import type { CSSProperties, ReactNode } from 'react';
import { useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { useId } from '../../hooks';
import { createAnimationKeyFrame, createStyles } from '../../theme';
import { FaderContext } from './FaderContext';

const fadeInKeyFrame = createAnimationKeyFrame({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const useStyles = createStyles({
  fader: {
    display: 'contents',

    '&>*': {
      opacity: 0,
      animationName: fadeInKeyFrame,
      animationDuration: 'inherit',
      animationFillMode: 'forwards',
    },
  },
});

interface Props {
  children?: ReactNode;
}

export const Fader = createComponent('Fader', ({
  children,
}: Props) => {
  const id = useId();
  const { css, join } = useStyles();
  const { isValid, duration, updateFadeData, fadeOut } = useContext(FaderContext);
  if (!isValid) throw new Error('Fader must be used within a FaderProvider');
  const elementRef = useRef<HTMLDivElement | null>(null);
  const ignoreMutationsRef = useRef(false);

  useLayoutEffect(() => {
    if (elementRef.current == null) return;
    const observer = new MutationObserver(() => {
      if (elementRef.current == null || ignoreMutationsRef.current) return;
      updateFadeData(id, elementRef.current);
    });
    observer.observe(elementRef.current, { childList: true, subtree: true });

    return () => { observer.disconnect(); };
  }, [elementRef.current]);

  useLayoutEffect(() => () => {
    ignoreMutationsRef.current = true;
    fadeOut(id);
  }, []);

  const style = useMemo<CSSProperties>(() => ({ animationDuration: `${duration}ms` }), [duration]);

  return (
    <Tag name="fader" ref={elementRef} className={join(css.fader)} style={style}>
      {children}
    </Tag>
  );
});
