import { CSSProperties } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { SimpleImageCarousel } from './SimpleImageCarousel';

interface Props {
  className?: string;
  imageURLs?: string[];
  intervalMS?: number;
  transitionDurationMS?: number;
  style?: CSSProperties;
  onTransition?(index: number): void;
}

export const Carousel = createComponent('Carousel', ({
  className,
  imageURLs,
  intervalMS,
  transitionDurationMS,
  style,
  onTransition,
}: Props) => {

  const content = (() => {
    if (imageURLs != null) return (
      <SimpleImageCarousel imageURLs={imageURLs} intervalMS={intervalMS} transitionDurationMS={transitionDurationMS} onTransition={onTransition} />
    );
    return null;
  })();

  return (
    <Flex tagName={'carousel'} className={className} style={style}>
      {content}
    </Flex>
  );
});
