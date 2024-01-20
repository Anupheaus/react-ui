import { useMemo } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';

const useStyles = createStyles({
  image: {

  },
});

interface Props {
  src?: string;
  className?: string;
}

export const Image = createComponent('Image', ({
  src,
  className,
}: Props) => {
  const { css, join } = useStyles();

  const style = useMemo(() => ({
    backgroundImage: `url(${src})`,
  }), [src]);

  return (
    <Flex tagName='image' className={join(css.image, className)} style={style} />
  );
});