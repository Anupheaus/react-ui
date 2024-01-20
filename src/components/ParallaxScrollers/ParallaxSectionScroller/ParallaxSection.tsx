import { ReactNode } from 'react';
import { createLegacyStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Flex } from '../../Flex';

const useStyles = createLegacyStyles({
  sectionTitle: {
    backgroundColor: 'white',
    padding: '8px 4px',
  },
});

interface Props {
  title?: ReactNode;
  className?: string;
  titleClassName?: string;
  children?: React.ReactNode;
}

export const ParallaxSection = createComponent('ParallaxSection', ({
  title,
  className,
  titleClassName,
  children = null,
}: Props) => {
  const { css, join } = useStyles();
  return (
    <Flex tagName="parallax-section" className={className} isVertical>
      <Flex tagName="parallax-section-title" className={join(css.sectionTitle, titleClassName)}>{title}</Flex>
      {children}
    </Flex>
  );
});