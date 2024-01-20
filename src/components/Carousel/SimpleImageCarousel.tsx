import { CSSProperties, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createLegacyStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';

const useStyles = createLegacyStyles({
  image: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    transitionProperty: 'opacity',
    transitionFunction: 'ease-in-out',
    opacity: 0,
    objectFit: 'cover',
  },
  isVisible: {
    opacity: 1,
  },
});

interface Props {
  imageURLs: string[];
  intervalMS?: number;
  transitionDurationMS?: number;
  onTransition?(index: number): void;
}

export const SimpleImageCarousel = createComponent('SimpleImageCarousel', ({
  imageURLs,
  intervalMS = 5000,
  transitionDurationMS = 500,
  onTransition,
}: Props) => {
  const { css, join } = useStyles();
  const [currentIndex, setCurrentIndex] = useState(0);

  const style = useMemo<CSSProperties>(() => ({
    transitionDuration: `${transitionDurationMS}ms`,
  }), [transitionDurationMS]);

  const content = useMemo(() => imageURLs.map((url, index) => (
    <img src={url} key={index} className={join(css.image, index === currentIndex && css.isVisible)} style={style} />
  )), [imageURLs, style, currentIndex]);

  useLayoutEffect(() => {
    onTransition?.(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(index => (index + 1) % imageURLs.length);
    }, intervalMS);
    return () => clearInterval(intervalId);
  }, [intervalMS, imageURLs]);

  return (
    <Flex tagName={'simple-image-carousel'}>
      {content}
    </Flex>
  );
});
