import type { ReactNode } from 'react';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';

interface Props {
  className?: string;
  children?: ReactNode;
}

export const ParallaxSectionScroller = createComponent('ParallaxSectionScroller', ({
  className,
  children = null,
}: Props) => {
  return (
    <Flex tagName="parallax-section-scroller" className={className} isVertical>
      {children}
    </Flex>
  );
});
